import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

 app.use(express.json({limit:'16kb'}));
 app.use(express.static('public'));
 app.use(cookieParser())



//  import Routes
import userRouter from "./routes/user.routes.js";




// Route Declaration
app.use("/api/v1/users",userRouter)





// https://localhost:8000/api/v1/users/register

// Another method to export 
export { app }