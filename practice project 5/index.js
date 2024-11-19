import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"

const app = express();

// middleware 
// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))
// app.use(cookieParser())

app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
);
app.use(
  express.json({
    limit: "16kb",
  }),
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
// database connection

const dbConnection = async ()=>{
    try {
       const dbConnectionResponse = await mongoose.connect("mongodb+srv://rehman:akroo258@cluster0.oa8kk.mongodb.net/backend")

        console.log(dbConnectionResponse.connection.host, "this is database connection response");
        

    } catch (error) {
        console.error("something went wrong while connecting to the database", error)
    }
}
dbConnection().then(()=>{
    
    app.get("/", (req, res) => {
        res.send("Hello World")
    })
    app.listen(5000, () => {
        console.log("Server is running on port 5000")
    })

}).catch((error)=>{
    console.error("something went wrong while connecting to the database", error)
})





import userRouter  from "./user.routes.js"
app.use("/api/v1/user", userRouter)











// DATABASE_URI = mongodb+srv://rehman:akroo258@cluster0.oa8kk.mongodb.net
// CORS_ORIGIN = *
// ACCESS_TOKEN_SECRET = lakmdflaljfdlaoidf43283u4kmmlk
// ACCESS_TOKEN_EXPIRY = 1d
// REFRESH_TOKEN_SECRET = lkdlasfljadkfo2349814091
// REFRESH_TOKEN_EXPIRY = 
// CLOUD_NAME = druwqr9lo
// CLOUD_KEY = 861241485628533
// CLOUD_SECRET = hVEbZGuqLqYbPOiPr0ORXJgBJKM