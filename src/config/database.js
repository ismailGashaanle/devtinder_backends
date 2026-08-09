const mongoose= require("mongoose")


const ConnectDB = async()=>{
    
     await mongoose.connect(process.env.DB_URL)
   

}


module.exports={
    ConnectDB
}