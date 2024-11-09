const TodoModel = require('../models/todoModel');

class TodoController {
  async getAllTodos(req, res) {
    try {
      // Lấy tất cả todos, không cần check role
      const todos = await TodoModel.getAll();
      
      res.json({
        status: 'success',
        data: todos
      });
    } catch (error) {
      console.error('Controller - Error in getAllTodos:', error);
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
      res.json({
        status: 'success',
        data: todo  // Đã bao gồm subtasks từ model
      });
    } catch (error) {
      console.error('Controller - Error in getTodoById:', error);
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }

  async createTodo(req, res) {
    try {
      const { title, description, due_date, completed, subtasks } = req.body;
      
      // Validation
      if (!title || !due_date) {
        return res.status(400).json({
          status: 'error',
          message: 'Title and due date are required'
        });
      }

      // Format date
      const formattedDate = new Date(due_date).toISOString().split('T')[0];
  
      const todoData = {
        title,
        description: description || '',
        due_date: formattedDate,
        completed: completed ? 1 : 0,
        subtasks: subtasks?.map(subtask => ({
          ...subtask,
          due_date: new Date(subtask.due_date).toISOString().split('T')[0],
          completed: subtask.completed ? 1 : 0
        }))
      };

      const newTodo = await TodoModel.create(todoData);
  
      res.status(201).json({
        status: 'success',
        data: newTodo
      });
    } catch (error) {
      console.error('Controller - Error in createTodo:', error);
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }

  async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const { title, description, due_date, completed, subtasks } = req.body;
  
      const formattedDate = due_date ? due_date.split('T')[0] : null;
  
      const todoData = {
        title,
        description: description || '',
        due_date: formattedDate,
        completed: completed !== undefined ? completed : 0,
        subtasks: subtasks?.map(subtask => ({
          ...subtask,
          due_date: new Date(subtask.due_date).toISOString().split('T')[0],
          completed: subtask.completed ? 1 : 0
        }))
      };
  
      const updatedTodo = await TodoModel.update(id, todoData);
      
      res.json({
        status: 'success',
        data: updatedTodo
      });
    } catch (error) {
      console.error('Controller - Error in updateTodo:', error);
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
      console.error('Controller - Error in deleteTodo:', error);
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