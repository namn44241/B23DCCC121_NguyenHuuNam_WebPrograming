const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  port: 3307,
  user: 'baitap',
  password: '1',
  database: 'todolist_app'
});

module.exports = db;

// db.connect((err) => {
//     if (err) {
//         console.error('Database connection thaats bai:', err.stack);
//         return;
//     }
//     console.log('Connected den mysql');
// });