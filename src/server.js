const express= require("express");
 require("dotenv").config();
const app=express();
require("./utils/CronJob");

const cookiesParser=require("cookie-parser")
const intializeSocket=require("./utils/intializeSocket")

const  {ConnectDB}=require("./config/database") 
const AuthRouter=require("./routes/Auth")
const profileRouter=require("./routes/profileRouter")
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser())
const requestRouter=require("./routes/requestRouter")
const UserRouter=require("./routes/user")
const cors=require("cors")
const http=require("http");
const ChatRouter = require("./routes/Chat");

// app.use(cors({
//     origin:"https://ismailoday.dev",
//     credentials:true
// }))
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ["https://ismailoday.dev", "https://www.ismailoday.dev"]
    : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));



app.use("/api",AuthRouter)
app.use("/api",profileRouter)
app.use("/api",requestRouter)
app.use("/api",UserRouter)
app.use("/api",ChatRouter)




const serverApp=http.createServer(app)

 intializeSocket(serverApp)


 

const port=process.env.PORT || 7000
ConnectDB().then(async(req,res)=>{
    try{
        console.log("successfully connected")
    serverApp.listen(port,()=>{
          console.log("connected successfully")
    })
    }catch(err){
        res.status(400).json({
            message:"ERROR : " +  err.messsage
        })
    }
})


 