const express = require('express');
const app = express();
const db = require('./src/configs/database');
const todosRouter = require('./src/routers/todos');

app.use(express.json());

// Todos Endpoints
app.use('/todos', todosRouter);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});