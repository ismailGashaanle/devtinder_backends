const  mongoose  = require("mongoose");

const connectionRequest= new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",//references from user collection
        required:true
    },
    toUserId:{
        type:mongoose.Schema.ObjectId,
        ref:"User" ,
        required:true
    },

    status:{
        type:String,
        enum:{
            values:["addfriend","remove","confirm","delete","block","unblock"],
            message:`{VALUE} incorrect status Type`
        }
    }

},{timestamps:true})




 connectionRequest.pre("save",function(){

    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
         throw new Error("not request your self Account")
    }
           //next();
   })



   //compound indexing

   connectionRequest.index({fromUserId:1, toUserId:1});

 


const ConnectionRequest=mongoose.model("ConnectionRequest",connectionRequest);

module.exports=ConnectionRequest