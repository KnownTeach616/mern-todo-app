// routes/todos.js
// Defines API routes for To-Do list operations: create, read, update, delete, with filtering and sorting.

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Todo = require('../models/Todo');

// POST /api/todos: Creates a new To-Do item.
router.post('/', auth, async (req, res) => {
    const { title, description, priority } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required.' });
    }

    try {
        const newTodo = new Todo({
            user: req.user.id,
            title,
            description,
            priority: priority || 'Medium', // Default to Medium if priority is not provided
        });

        const todo = await newTodo.save();
        res.status(201).json({ message: 'To-Do created successfully!', todo });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/todos: Retrieves all To-Do items for the authenticated user with optional filtering and sorting.
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { completed, priority, sort } = req.query;

        let filter = { user: userId };
        let sortOptions = {};

        // Apply completed status filter
        if (completed !== undefined) {
            filter.completed = completed === 'true'; // Convert string 'true'/'false' to boolean
        }

        // Apply priority filter
        if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
            filter.priority = priority;
        }

        // Apply sorting based on the 'sort' query parameter
        switch (sort) {
            case 'createdAtAsc':
                sortOptions = { createdAt: 1 }; // Ascending by creation date
                break;
            case 'completedDesc':
                sortOptions = { completed: -1, createdAt: -1 }; // Completed first, then newest
                break;
            case 'completedAsc':
                sortOptions = { completed: 1, createdAt: -1 }; // Incomplete first, then newest
                break;
            case 'priorityDesc':
                // For priority sorting, data is fetched and then sorted in memory.
                break;
            case 'priorityAsc':
                // For priority sorting, data is fetched and then sorted in memory.
                break;
            case 'createdAtDesc':
            default:
                sortOptions = { createdAt: -1 }; // Default: Descending by creation date (newest first)
                break;
        }

        let todos = await Todo.find(filter).sort(sortOptions);

        // Manual sorting for priority if requested, as MongoDB's sort on enum strings is alphabetical.
        // This ensures 'High', 'Medium', 'Low' order.
        if (sort === 'priorityDesc' || sort === 'priorityAsc') {
            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
            todos.sort((a, b) => {
                if (sort === 'priorityDesc') {
                    return priorityOrder[b.priority] - priorityOrder[a.priority]; // High to Low
                } else {
                    return priorityOrder[a.priority] - priorityOrder[b.priority]; // Low to High
                }
            });
        }

        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT /api/todos/:id: Updates a To-Do item.
router.put('/:id', auth, async (req, res) => {
    const { title, description, completed, priority } = req.body;

    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'To-Do not found' });
        }

        // Ensure the To-Do belongs to the authenticated user
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Update fields if provided in the request body
        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (completed !== undefined) todo.completed = completed;
        if (priority && ['Low', 'Medium', 'High'].includes(priority)) todo.priority = priority;

        await todo.save(); // Save the updated To-Do item
        res.json({ message: 'To-Do updated successfully!', todo });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/todos/:id: Deletes a To-Do item.
router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'To-Do not found' });
        }

        // Ensure the To-Do belongs to the authenticated user
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Todo.deleteOne({ _id: req.params.id }); // Delete the To-Do item
        res.json({ message: 'To-Do deleted successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
