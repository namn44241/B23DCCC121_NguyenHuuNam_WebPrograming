const db = require('../config/database');

const Todo = {
    getAll: async () => {
        try {
            const [rows] = await db.query('SELECT * FROM todos');
            return rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Todo;