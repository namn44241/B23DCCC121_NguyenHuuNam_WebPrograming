const express = require('express');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', todoRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});