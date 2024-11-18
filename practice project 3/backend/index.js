import express from  "express"
import { upload } from "./multer.middleware.js"
import cors from "cors"
import  fs from "fs"    
// enable all the server requests to get the data from sever
const app = express()
app.use(cors())

// app.get("/", function(req,res){
//     res.send("hi kasa ha mare jan si ja raha ha ")

// })
app.set("view engine", "ejs")
app.set('views', './views'); 
app.get("/upload", (req, res)=>{
    res.send(`<!DOCTYPE html>
<html lang="en">

<body>
    <h1>hi this is rehman</h1>
    <form action="/upload" encType='multipart/form-data' method='POST'>
     <input type="file" name='image' accept='image/*' />
     <input type="submit" value="submit" />
    </form>
</body>
</html>`)
})
app.post("/upload", upload.single("image"), (req, res)=>{
    res.send("uploaded successfully ")
})

app.listen(4000, ()=>{
    console.log("you are listening at port 4000")
})