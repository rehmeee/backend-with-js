import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
function App() {
  const [jokes, setJokes] = useState([])
  useEffect(()=>{
    axios.get("http://localhost:3000/jokes")
    .then(response=>setJokes(response.data)  )
    .catch(error=>console.log(error))
  },[])
  return (
    <>
      <h1>Rehman ali</h1>
      <div>
        <h2>{jokes.length}</h2>
        {
          jokes.map((joke) => (
            <div key={joke.id}>
              <p>{joke.jokeName}</p>
              <h3>{joke.joke}</h3>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App
