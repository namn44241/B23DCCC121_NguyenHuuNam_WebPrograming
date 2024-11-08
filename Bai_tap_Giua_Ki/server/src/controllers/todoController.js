const TodoModel = require('../models/todoModel');

class TodoController {
  async getAllTodos(req, res) {
    try {
      const todos = await TodoModel.getAll();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }

  async getTodoById(req, res) {
    try {
      const todo = await TodoModel.getById(req.params.id);
      if (!todo) {
        return res.status(404).json({ 
          status: 'error',
          message: 'Todo not found' 
        });
      }
      res.json(todo);
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }

  async createTodo(req, res) {
    try {
      const { title, description, due_date } = req.body;
      
      // Validation
      if (!title || !due_date) {
        return res.status(400).json({
          status: 'error',
          message: 'Title and due date are required'
        });
      }

      const newTodo = await TodoModel.create({ title, description, due_date });
      res.status(201).json({
        status: 'success',
        data: newTodo
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }

  async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const updatedTodo = await TodoModel.update(id, req.body);
      res.json({
        status: 'success',
        data: updatedTodo
      });
    } catch (error) {
      if (error.message === 'Todo not found') {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }

  async deleteTodo(req, res) {
    try {
      await TodoModel.delete(req.params.id);
      res.json({
        status: 'success',
        message: 'Todo deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Todo not found') {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }
}

module.exports = new TodoController();