import { app } from "./app.js";
import DbConnect from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({path:'./env'})

const port=process.env.PORT || 8000;

DbConnect()
.then(()=>{
    app.listen(port,()=>{
     console.log(`Server is running at port ${port}`)
    })
})
.catch((err)=>console.log(`DB connection failed !!` ,err))