import express from 'express';
// require('dotenv').config()
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const jokes = [
    {
      id: 1,
      jokeName: "Programming Joke",
      joke: "Why do programmers prefer dark mode? Because light attracts bugs!"
    },
    {
      id: 2,
      jokeName: "Math Joke",
      joke: "Why was the equal sign so humble? Because it knew it wasn’t less than or greater than anyone else."
    },
    {
      id: 3,
      jokeName: "Tech Support Joke",
      joke: "I told my computer I needed a break, and now it won’t stop sending me Kit-Kat ads."
    },
    {
      id: 4,
      jokeName: "Coffee Joke",
      joke: "How does a computer take its coffee? With a lot of Java."
    },
    {
      id: 5,
      jokeName: "HTML Joke",
      joke: "Why did the web developer go broke? Because he used up all his cache."
    }
  ];
  
  // Output to console

  
app.get('/', (req, res) => {
    res.send('Server is ready');
})
app.get('/jokes', (req, res) => {
    res.json(jokes);
})
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})