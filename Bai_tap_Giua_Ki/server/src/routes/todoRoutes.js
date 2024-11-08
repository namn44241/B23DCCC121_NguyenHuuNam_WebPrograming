const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController');

// Get all todos
router.get('/', TodoController.getAllTodos);

// Get single todo
router.get('/:id', TodoController.getTodoById);

// Create new todo
router.post('/', TodoController.createTodo);

// Update todo
router.put('/:id', TodoController.updateTodo);

// Delete todo
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;