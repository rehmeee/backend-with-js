import './App.css'

function App() {

  return (
    <>
    <h1>hi this is rehman</h1>
     <form action="/upload" encType='multipart/form-data' method='POST'>
      <input type="file" name='image' accept='image/*' />
      <input type="submit" value="submit" />
     </form>
    </>
  ) 
}

export default App