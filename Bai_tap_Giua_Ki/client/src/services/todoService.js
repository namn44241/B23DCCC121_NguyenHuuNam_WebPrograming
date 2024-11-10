const API_URL = 'http://localhost:5000/api/todos';

export const todoService = {
  async getAllTodos() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.status === 'success') {
        return data.data; // Trả về mảng todos
      }
      throw new Error(data.message || 'Failed to get todos');
    } catch (error) {
      console.error('Error in getAllTodos:', error);
      throw error;
    }
  },

  async getTodoById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();
      if (data.status === 'success') {
        return data.data; // Trả về chỉ phần data
      }
      throw new Error(data.message || 'Failed to get todo');
    } catch (error) {
      console.error('Error in getTodoById:', error);
      throw error;
    }
  },

  async createTodo(todoData) {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      const dataToSend = {
        ...todoData,
        completed: todoData.completed ? 1 : 0,
        created_by: currentUser?.id || null,
        assigned_to: todoData.assigned_to || null
      };
  
      console.log('Sending to server:', dataToSend);
  
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
  
      const data = await response.json();
      console.log('Server response:', data);
  
      if (data.status === 'success') {
        return data.data;
      }
      throw new Error(data.message || 'Failed to create todo');
    } catch (error) {
      console.error('Error in createTodo:', error);
      throw error;
    }
  },

  async updateTodo(id, todoData) {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      const dataToSend = {
        ...todoData,
        created_by: currentUser?.id || null,
        assigned_to: todoData.assigned_to || null
      };
  
      console.log('TodoService - Sending update:', dataToSend);
  
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
  
      const data = await response.json();
      console.log('TodoService - Response:', data);
  
      if (data.status === 'success') {
        return data.data;
      }
      throw new Error(data.message || 'Failed to update todo');
    } catch (error) {
      console.error('Error in updateTodo:', error);
      throw error;
    }
  },

  async deleteTodo(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.status === 'success') {
        return true;
      }
      throw new Error(data.message || 'Failed to delete todo');
    } catch (error) {
      console.error('Error in deleteTodo:', error);
      throw error;
    }
  }
};