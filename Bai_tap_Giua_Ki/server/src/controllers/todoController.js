const TodoModel = require('../models/todoModel');

class TodoController {
  async getAllTodos(req, res) {
    try {
      const todos = await TodoModel.getAll();
      res.json(todos);
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
      res.json(todo);
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
      const { title, description, due_date, completed } = req.body;
      
      // Log request data
      console.log('Controller - Received create request:', req.body);
      
      // Validation
      if (!title || !due_date) {
        return res.status(400).json({
          status: 'error',
          message: 'Title and due date are required'
        });
      }
  
      // Format date to MySQL format (YYYY-MM-DD)
      const formattedDate = new Date(due_date).toISOString().split('T')[0];
  
      const todoData = {
        title,
        description: description || '',
        due_date: formattedDate,
        completed: completed ? 1 : 0  // Đảm bảo giá trị là 1 hoặc 0
      };

      // Log processed data
      console.log('Controller - Processed todo data:', todoData);
  
      const newTodo = await TodoModel.create(todoData);
  
      // Log created todo
      console.log('Controller - Created todo:', newTodo);
  
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
      const { title, description, due_date, completed } = req.body;
  
      console.log('Received due_date:', due_date); // Debug log
  
      // Đảm bảo due_date không bị thay đổi bởi timezone
      const formattedDate = due_date ? due_date.split('T')[0] : null;
  
      const todoData = {
        title,
        description: description || '',
        due_date: formattedDate, // Sử dụng ngày không có timezone
        completed: completed !== undefined ? completed : 0
      };
  
      console.log('Saving to database:', todoData); // Debug log
  
      const updatedTodo = await TodoModel.update(id, todoData);
      
      // Trả về đúng định dạng ngày đã lưu
      res.json({
        ...updatedTodo,
        due_date: formattedDate
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