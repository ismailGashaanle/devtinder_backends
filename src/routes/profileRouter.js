const express=require("express");
const { UserAuth } = require("../middlewares/auth");
const {ValidateProfileEdit}=require("../utils/validate")
const User=require("../models/user")
const Bcrypt=require("bcrypt")

const profileRouter=express.Router();


profileRouter.get("/profile",UserAuth,async(req,res)=>{

    try{
        const loginUser=req.user;
        if(!loginUser){
            throw new Error("Unthorized please login")
        }


        const Public_Save_Data={
            _id:loginUser?._id,
            firstName:loginUser.firstName,
            lastName:loginUser.lastName,
            phone:loginUser.phone,
            photo:loginUser.photo,
            email:loginUser.email
        }
        res.status(200).json({
            message:`${loginUser?.firstName} your profile `,
            loginUser:Public_Save_Data
        })


    }catch(err){
        res.status(400).json({
            message:'ERROR : ' + err.message
        })
    }

})


profileRouter.patch("/profile/edit",UserAuth,async(req,res)=>{

    try{
         const loginUser=req.user
        if(!loginUser){
            throw new Error("please login")
        }
        ValidateProfileEdit(req)
       
        const {firstName,lastName,phone,Gender,photo}=req.body

        const user=await User.findByIdAndUpdate(loginUser?._id,{
             firstName,
             lastName,
             phone,
             Gender,
             photo
             
        },{runValidators:true,runDocument:"after"}
    
    )

    await user.save();

        res.status(200).json({
            message:"updated profile successuflly",
            user:user
        })
    }catch(err){
        res.status(400).json({
            message:"ERROR " + err.message
        })
    }

})

profileRouter.patch("/profile/password/Edit",UserAuth,async(req,res)=>{
    try{
        // new password and input for current password ? 
        // must be input password matched this loginUser in database password
        //if matched  allowed to update newpassword to in databse and make hash
        
        const loginUser=req.user
        if(!loginUser){
            return res.status(400).json({
                message:"please login"
            })
        }

        const {newPassword,currentPassword}=req.body

//const checkPassword = await Bcrypt.comapre(currentPassword,loginUser.password)
const checkPassword= await Bcrypt.compare(currentPassword,loginUser.password)
          if(!checkPassword){
            return res.status(400).json({
                message:"please try again incorrect password"
            })
          }

          const CheckOldPassword= await Bcrypt.compare(newPassword,loginUser.password);
          if(CheckOldPassword){
            throw new Error("please create a new password this is your Old password")
          }
          const Hash_password= await Bcrypt.hash(newPassword,10)

          

           loginUser.password=Hash_password

           await loginUser.save()

           res.status(200).json({
            message:"successfully change your password " + loginUser?.firstName
           })

    }catch(err){

        res.status(400).json({
        message:"ERROR : " + err?.message
        })
         
    }

})



module.exports=profileRouter