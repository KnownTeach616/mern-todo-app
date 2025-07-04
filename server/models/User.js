// models/User.js
// Defines the Mongoose schema for user data, including password and security answer hashing,
// and user preferences for To-Do filtering and sorting.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 3 },
    email: { type: String, required: true, unique: true, match: [/.+@.+\..+/, 'Invalid email.'] },
    password: { type: String, required: true, minlength: 6 },
    securityQuestion: { type: String, required: false },
    securityAnswer: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    defaultFilterStatus: { type: String, enum: ['all', 'completed', 'incomplete'], default: 'all' },
    defaultFilterPriority: { type: String, enum: ['all', 'Low', 'Medium', 'High'], default: 'all' },
    defaultSortOption: { type: String, enum: ['createdAtDesc', 'createdAtAsc', 'priorityDesc', 'priorityAsc', 'completedDesc', 'completedAsc'], default: 'createdAtDesc' },
});

// Hashes password and security answer before saving.
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    // Only hash security answer if it's provided and modified.
    if (this.isModified('securityAnswer') && this.securityAnswer) {
        const salt = await bcrypt.genSalt(10);
        this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt);
    }
    next();
});

// Compares a candidate password with the hashed password.
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Compares a candidate security answer with the hashed security answer.
UserSchema.methods.compareSecurityAnswer = async function(candidateAnswer) {
    if (!this.securityAnswer) return false;
    return await bcrypt.compare(candidateAnswer, this.securityAnswer);
};

module.exports = mongoose.model('User', UserSchema);
