const db = require('../configs/database');

class TodoModel {
  async getAll() {
    try {
      // Sửa câu query để lấy thêm thông tin người tạo
      const [rows] = await db.query(`
        SELECT 
          t.*,
          u.username as created_by_name
        FROM todos t
        LEFT JOIN users u ON t.created_by = u.id
        ORDER BY t.id DESC
      `);
      console.log('Todos with creator:', rows); // Thêm log để debug
      return rows;
    } catch (error) {
      throw new Error('Error getting todos: ' + error.message);
    }
  }

  async getById(id) {
    try {

      // Lấy task chính với thông tin người tạo
      const [todos] = await db.query(`
        SELECT 
          t.*,
          u.username as created_by_name
        FROM todos t
        LEFT JOIN users u ON t.created_by = u.id
        WHERE t.id = ?
      `, [id]);
      
      if (todos.length === 0) return null;

      // Lấy subtasks với thông tin người tạo
      const [subtasks] = await db.query(`
        SELECT 
          s.*,
          u.username as created_by_name
        FROM subtasks s
        LEFT JOIN users u ON s.created_by = u.id
        WHERE s.todo_id = ?
      `, [id]);
        
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
  
      const { title, description, due_date, completed, created_by, assigned_to, subtasks } = todoData;
      
      console.log('Creating todo with data:', todoData); // Debug log
  
      // Tạo task chính
      const [result] = await conn.query(
        'INSERT INTO todos (title, description, due_date, completed, created_by, assigned_to) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, due_date, completed, created_by, assigned_to]
      );
  
      const todoId = result.insertId;
  
      // Thêm subtasks nếu có
      if (subtasks && subtasks.length > 0) {
        const subtaskValues = subtasks.map(subtask => [
          todoId,
          subtask.title,
          subtask.due_date,
          subtask.completed ? 1 : 0,
          created_by, // Sử dụng created_by từ task chính
          subtask.assigned_to || null
        ]);
  
        await conn.query(
          'INSERT INTO subtasks (todo_id, title, due_date, completed, created_by, assigned_to) VALUES ?',
          [subtaskValues]
        );
      }
  
      await conn.commit();
      conn.release();
  
      return this.getById(todoId);
  
    } catch (error) {
      await conn.rollback();
      conn.release();
      console.error('Model - Error creating todo:', error); // Debug log
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