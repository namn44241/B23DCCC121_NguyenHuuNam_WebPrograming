const API_URL = 'http://localhost:5000/api/todos';

export const todoService = {
  async getAllTodos() {
    const response = await fetch(API_URL);
    return response.json();
  },

  async createTodo(todoData) {
    // Chuyển đổi completed từ boolean sang số trước khi gửi
    const dataToSend = {
      ...todoData,
      completed: todoData.completed ? 1 : 0
    };

    console.log('Sending to server:', dataToSend); // Debug log

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend)
    });

    const data = await response.json();
    console.log('Server response:', data); // Debug log
    return data;
  },

  async updateTodo(id, todoData) {
    console.log('TodoService - Sending update:', todoData);
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData)
    });
  
    if (!response.ok) {
      const error = await response.text();
      console.error('Server error:', error);
      throw new Error('Network response was not ok');
    }
  
    const data = await response.json();
    console.log('TodoService - Response:', data);
    return data;
  },

  async deleteTodo(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  async getTodoById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
  },

};