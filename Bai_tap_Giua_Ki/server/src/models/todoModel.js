const db = require('../configs/database');

class TodoModel {
  async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM todos ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw new Error('Error getting todos: ' + error.message);
    }
  }

  async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Error getting todo: ' + error.message);
    }
  }

  async create(todoData) {
    try {
      const { title, description, due_date, completed } = todoData;
      const [result] = await db.query(
        'INSERT INTO todos (title, description, due_date, completed) VALUES (?, ?, ?, ?)',
        [title, description, due_date, completed]
      );
  
      const [newTodo] = await db.query(
        'SELECT * FROM todos WHERE id = ?',
        [result.insertId]
      );
  
      return newTodo[0];
    } catch (error) {
      throw new Error('Error creating todo: ' + error.message);
    }
  }

  async update(id, todoData) {
    try {
      const { title, description, due_date, completed } = todoData;
      
      const query = `
        UPDATE todos 
        SET title = ?, description = ?, due_date = ?, completed = ?
        WHERE id = ?
      `;
      
      const [result] = await db.execute(query, [
        title,
        description,
        due_date, // Sử dụng ngày đã format ở controller
        completed,
        id
      ]);
  
      if (result.affectedRows === 0) {
        throw new Error('Todo not found');
      }
  
      return { id, ...todoData };
    } catch (error) {
      console.error('Model - Error in update:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM todos WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        throw new Error('Todo not found');
      }
      return true;
    } catch (error) {
      throw new Error('Error deleting todo: ' + error.message);
    }
  }
}

module.exports = new TodoModel();