const Todo = require('../models/todo');

exports.getAllTodos = async (req, res) => {
    try {
        const results = await Todo.getAll();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};