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
      const { title, description, due_date } = todoData;
      const [result] = await db.query(
        'INSERT INTO todos (title, description, due_date) VALUES (?, ?, ?)',
        [title, description, due_date]
      );
      return {
        id: result.insertId,
        title,
        description,
        due_date,
        completed: 0
      };
    } catch (error) {
      throw new Error('Error creating todo: ' + error.message);
    }
  }

  async update(id, todoData) {
    try {
      const { title, description, due_date, completed } = todoData;
      const [result] = await db.query(
        'UPDATE todos SET title = ?, description = ?, due_date = ?, completed = ? WHERE id = ?',
        [title, description, due_date, completed ? 1 : 0, id]
      );
      if (result.affectedRows === 0) {
        throw new Error('Todo not found');
      }
      return {
        id,
        title,
        description,
        due_date,
        completed: completed ? 1 : 0
      };
    } catch (error) {
      throw new Error('Error updating todo: ' + error.message);
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