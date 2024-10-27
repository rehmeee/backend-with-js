import express from 'express';
// require('dotenv').config()
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.get('/', (req, res) => {
    res.send('Server is ready');
})
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})