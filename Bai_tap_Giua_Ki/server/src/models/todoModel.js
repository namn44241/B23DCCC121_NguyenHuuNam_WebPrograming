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
      // Lấy task chính
      const [todos] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
      if (todos.length === 0) return null;

      // Lấy subtasks
      const [subtasks] = await db.query('SELECT * FROM subtasks WHERE todo_id = ?', [id]);
      
      return {
        ...todos[0],
        subtasks
      };
    } catch (error) {
      throw new Error('Error getting todo: ' + error.message);
    }
  }

  async create(todoData) {
    const conn = await db.getConnection();
    
    try {
      await conn.beginTransaction();

      const { title, description, due_date, completed, subtasks } = todoData;
      
      // Tạo task chính
      const [result] = await conn.query(
        'INSERT INTO todos (title, description, due_date, completed) VALUES (?, ?, ?, ?)',
        [title, description, due_date, completed]
      );

      const todoId = result.insertId;

      // Thêm subtasks nếu có
      if (subtasks && subtasks.length > 0) {
        const subtaskValues = subtasks.map(subtask => [
          todoId,
          subtask.title,
          subtask.due_date,
          subtask.completed ? 1 : 0,
          subtask.created_by || todoData.created_by, // Thêm created_by
          subtask.assigned_to
        ]);

        await conn.query(
          'INSERT INTO subtasks (todo_id, title, due_date, completed, created_by, assigned_to) VALUES ?',
          [subtaskValues]
        );
      }

      await conn.commit();
      conn.release();

      // Lấy todo vừa tạo kèm subtasks
      return this.getById(todoId);

    } catch (error) {
      await conn.rollback();
      conn.release();
      throw new Error('Error creating todo: ' + error.message);
    }
  }

  async update(id, todoData) {
    const conn = await db.getConnection();
    
    try {
      await conn.beginTransaction();

      const { title, description, due_date, completed, subtasks } = todoData;
      
      // Cập nhật task chính
      const [result] = await conn.query(
        'UPDATE todos SET title = ?, description = ?, due_date = ?, completed = ? WHERE id = ?',
        [title, description, due_date, completed, id]
      );

      if (result.affectedRows === 0) {
        await conn.rollback();
        conn.release();
        throw new Error('Todo not found');
      }

      // Cập nhật subtasks
      await conn.query('DELETE FROM subtasks WHERE todo_id = ?', [id]);

      if (subtasks && subtasks.length > 0) {
        const subtaskValues = subtasks.map(subtask => [
          id,
          subtask.title,
          subtask.due_date,
          subtask.completed ? 1 : 0,
          subtask.created_by || todoData.created_by, // Thêm created_by
          subtask.assigned_to
        ]);

        await conn.query(
          'INSERT INTO subtasks (todo_id, title, due_date, completed, created_by, assigned_to) VALUES ?',
          [subtaskValues]
        );
      }

      await conn.commit();
      conn.release();

      // Lấy todo đã cập nhật kèm subtasks
      return this.getById(id);

    } catch (error) {
      await conn.rollback();
      conn.release();
      throw new Error('Error updating todo: ' + error.message);
    }
  }

  async getByAssignedUser(userId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM todos WHERE assigned_to = ? ORDER BY id DESC',
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error('Error getting todos by user: ' + error.message);
    }
  }

  async delete(id) {
    const conn = await db.getConnection();
    
    try {
      await conn.beginTransaction();

      // Xóa subtasks trước
      await conn.query('DELETE FROM subtasks WHERE todo_id = ?', [id]);
      
      // Xóa task chính
      const [result] = await conn.query('DELETE FROM todos WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        await conn.rollback();
        conn.release();
        throw new Error('Todo not found');
      }

      await conn.commit();
      conn.release();
      return true;
    } catch (error) {
      await conn.rollback();
      conn.release();
      throw new Error('Error deleting todo: ' + error.message);
    }
  }
}

module.exports = new TodoModel();