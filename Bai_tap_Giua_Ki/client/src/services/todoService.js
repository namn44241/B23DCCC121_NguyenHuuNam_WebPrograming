const API_URL = 'http://localhost:5000/api/todos';

export const todoService = {
  async getAllTodos() {
    const response = await fetch(API_URL);
    return response.json();
  },

  async createTodo(todoData) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData)
    });
    return response.json();
  },

  async updateTodo(id, todoData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData)
    });
    return response.json();
  },

  async deleteTodo(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};