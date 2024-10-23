const express = require('express');  
const app = express();  
const port = 3000;  

app.use(express.json());  

app.listen(port, () => {  
    console.log(`sever đang chạy tại localhost:${port}`);  
});

app.get("/users", (req, res) => {  
    res.json([   
        {id: 1, name: 'chicken'},  
        {id: 2, name: 'dog'}       
    ]);
});
