const express = require('express');
const bodyParser = require('body-parser');
// Debug để xem đường dẫn hiện tại
console.log('Current directory:', __dirname);

const todoRoutes = require('./routes/todoRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', todoRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});