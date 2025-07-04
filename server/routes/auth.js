// routes/auth.js
// Defines API routes for user authentication: signup, login, fetching user data, password reset, and setting security questions.

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('./../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// POST /api/auth/signup: Registers a new user.
router.post('/signup', async (req, res) => {
    const { username, email, password, securityQuestion, securityAnswer } = req.body;
    if (!username || !email || !password || password.length < 6) {
        return res.status(400).json({ message: 'Please provide valid credentials (username, email, password).' });
    }
    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: 'User with that email or username already exists.' });
        }
        user = new User({ username, email, password, securityQuestion, securityAnswer });
        await user.save();
        const payload = { user: { id: user.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ message: 'User registered successfully', token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during signup.');
    }
});

// POST /api/auth/login: Authenticates user and provides a JWT token.
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }
        const payload = { user: { id: user.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, (err, token) => {
            if (err) throw err;
            res.json({ message: 'Logged in successfully', token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during login.');
    }
});

// GET /api/auth/user: Retrieves authenticated user's data.
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -securityAnswer');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error fetching user data.');
    }
});

// PUT /api/auth/preferences: Updates user's To-Do preferences.
router.put('/preferences', authMiddleware, async (req, res) => {
    const { defaultFilterStatus, defaultFilterPriority, defaultSortOption } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (defaultFilterStatus !== undefined) user.defaultFilterStatus = defaultFilterStatus;
        if (defaultFilterPriority !== undefined) user.defaultFilterPriority = defaultFilterPriority;
        if (defaultSortOption !== undefined) user.defaultSortOption = defaultSortOption;

        await user.save();
        res.json({ message: 'Preferences updated successfully.', user: {
            defaultFilterStatus: user.defaultFilterStatus,
            defaultFilterPriority: user.defaultFilterPriority,
            defaultSortOption: user.defaultSortOption
        }});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error updating preferences.');
    }
});

// PUT /api/auth/set-security-question: Allows logged-in user to set security question/answer.
router.put('/set-security-question', authMiddleware, async (req, res) => {
    const { securityQuestion, securityAnswer } = req.body;
    if (!securityQuestion || !securityAnswer) {
        return res.status(400).json({ message: 'Both security question and answer are required.' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.securityQuestion = securityQuestion;
        user.securityAnswer = securityAnswer;
        await user.save();

        res.json({ message: 'Security question and answer set successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error setting security question.');
    }
});


// POST /api/auth/forgot-password-request: Initiates password reset by providing the user's security question.
router.post('/forgot-password-request', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Please provide your email address.' });
    }
    try {
        const user = await User.findOne({ email }).select('securityQuestion');
        if (!user) {
            return res.status(404).json({ message: 'User not found with that email.' });
        }
        if (!user.securityQuestion) {
            return res.status(400).json({ message: 'No security question set for this user. Please contact support.' });
        }
        res.json({ securityQuestion: user.securityQuestion, userId: user._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during password reset request.');
    }
});

// POST /api/auth/reset-password-security-question: Resets password after verifying security answer.
router.post('/reset-password-security-question', async (req, res) => {
    const { userId, securityAnswer, newPassword } = req.body;
    if (!userId || !securityAnswer || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Please provide all required fields and a new password of at least 6 characters.' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (!user.securityAnswer) {
            return res.status(400).json({ message: 'No security answer set for this user.' });
        }
        const isAnswerMatch = await user.compareSecurityAnswer(securityAnswer);
        if (!isAnswerMatch) {
            return res.status(400).json({ message: 'Incorrect security answer.' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password reset successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during password reset.');
    }
});

module.exports = router;
