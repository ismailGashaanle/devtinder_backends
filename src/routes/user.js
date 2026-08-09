const express = require("express");
const ConnectionRequest= require("../models/connectionRequest")
const UserRouter=express.Router();
const {UserAuth}=require("../middlewares/auth")
const User=require("../models/user")
const Public_Save_Data=["firstName","lastName","phone","photo","Gender"]

UserRouter.get("/user/request/received",UserAuth,async(req,res)=>{
    try{

        const loginUser=req.user;
     if(!loginUser){
        res.status(400).json({
          message:"please login"
        })
     }
        const connectionRequest = await  ConnectionRequest.find({
            toUserId:loginUser._id,
            status:"addfriend"
        }).populate("fromUserId",["firstName" ,"lastName","Gender","photo","phone"])
          .populate("toUserId",["firstName"])


        
        if(!connectionRequest){
            res.status(404).json({
               message:("not recieved any requests")
            })
        }

        res.status(200).json({
            recieved:connectionRequest.length + " requests",
            message:"recieved request from",
            connectionRequest
        })

    }catch(err){
        res.status(400).json({
            message:"ERROR  : " + err.message
        })
    }
})

UserRouter.get("/user/connection",UserAuth,async(req,res)=>{
    try{
        const loginUser=req.user;
        if(!loginUser){
            throw new Error("please login")
        }

        // if I request accepted means confirm //show me  else not

        const connectionRequest=await ConnectionRequest.find({
        $or:[
            {toUserId:loginUser._id,status:"confirm"},
            {fromUserId:loginUser._id,status:"confirm"}
        ]
        }).populate("fromUserId",Public_Save_Data).populate("toUserId",Public_Save_Data)
        if(!connectionRequest){
            throw new Error("not found any connections ")
        }

        const data=connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString()===loginUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.status(200).json({
            friend:connectionRequest.length,
            message:"your friends",
            data
        })





    }catch(err){
        res.status(400).json({
            message:"ERROR : " + err.message
        })
    }
})


UserRouter.get("/feed",UserAuth,async(req,res)=>{
    try{

        //
        const loginUser=req.user;
        if(!loginUser){
            throw new Error("please login")
        }

        let limit= parseInt( req.query.limit || 10);
          limit=limit > 50 ? 50 :limit;
        const page = parseInt(req.query.page ||1);
      
        const skip=(page-1)*limit

        const  connectionRequest=await ConnectionRequest.find({
          $or:[
            {fromUserId:loginUser._id},{toUserId:loginUser._id},

          ]     
        }).select("fromUserId toUserId")
 

        const HiddenFeedUsers= new Set();

        connectionRequest.forEach((req)=>{
          HiddenFeedUsers.add(req.fromUserId.toString());
          HiddenFeedUsers.add(req.toUserId.toString());
        }) 

        const user= await  User.find({

              
               $and:[
               {_id:{
                    $nin : Array.from(HiddenFeedUsers)
                }},
               // loginUser._id
               {_id:
                 {$ne: loginUser._id}
            }
            ]
                
             

        }).select(Public_Save_Data).skip(skip).limit(limit)
        res.status(200).json({
            users:user.length,
            data:user
        })

    }catch(err){
        res.status(400).json({
            message:"ERROR : " + err.message
        })
    }

})
module.exports=UserRouter