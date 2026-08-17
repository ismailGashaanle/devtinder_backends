const express=require("express");
const { UserAuth } = require("../middlewares/auth");
const Chat = require("../models/Chat");


const ChatRouter=express.Router();


ChatRouter.get("/chat/:toTargetUser",UserAuth,async(req,res)=>{

    const userId=req?.user._id
    const {toTargetUser}=req.params
    try{
        let chat = await Chat.findOne({
              participant:{$all:[userId,toTargetUser]},
        }).populate({
            path:"messages.senderId",
            select:"firstName  lastName"
        })
        if(!chat){
            chat= await new Chat({
                participant:[userId,toTargetUser],
                messages:[],
            })
           
        }
        
         await chat.save();

            res.status(200).json({
            messages: chat.messages,
            });

    }catch(err){
        res.status(400).json({
            message:err?.message
        })
    }


})




module.exports=ChatRouter