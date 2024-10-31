const Todo = require('../models/todo');

exports.getAllTodos = async (req, res) => {
    try {
        const results = await Todo.getAll();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTodo = (req, res) => {
    const { title, description, due_date } = req.body;
    Todo.create(title, description, due_date, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({message: 'Todo created successfully'});
    });
};

exports.updateTodo = (req, res) => {
    const { id } = req.params;
    const { title, description, due_date, completed } = req.body;
    Todo.update(id, title, description, due_date, completed, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({message: 'Todo updated successfully'});
    });
};

exports.deleteTodo = (req, res) => {
    const { id } = req.params;
    Todo.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({message: 'Todo delete successfully'});
    });
};