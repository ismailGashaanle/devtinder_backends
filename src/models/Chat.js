const mongoose  = require("mongoose");


const MessageSchema= new mongoose.Schema({

    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true
    }

},{timestamps:true})

const ChatSchema= new mongoose.Schema({

    participant :[
      {  type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
    ],

    messages:[MessageSchema]
},{timestamps:true})


const Chat=mongoose.model("Chat",ChatSchema);

module.exports=Chat