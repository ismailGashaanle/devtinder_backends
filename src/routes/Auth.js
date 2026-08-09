
const express=require("express");
const { ValidateSignUp, ValidateLogin } = require("../utils/validate");
const User=require("../models/user")
const Bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const BodyParse=require("body-parser");
const { UserAuth } = require("../middlewares/auth");
const Public_Save_Data=["firstName","lastName","phone","photo","Gender"]
const AuthRouter= express.Router();
 


AuthRouter.post("/signUp",async(req,res)=>{

    try{
         ValidateSignUp(req);
         const {firstName,lastName,phone,email,password}=req.body;

         const hash_password=await Bcrypt.hash(password,10)

         const allowedPost=["firstName","lastName","email","phone","password"]

         const postAllowedData=Object.keys(req.body).every((k)=>allowedPost.includes(k))
         if(!postAllowedData){
          return  res.status(400).json({
              message:"Unthorized data"
            }) 
         }

         const user= new User ({
            firstName,
            lastName,
            phone,
            email,
            password:hash_password
         })

         const Public_Data={
            firstName:user?.firstName,
            lastName:user?.lastName,
            phone:user?.phone,
            photot:user?.photot,
            Gender:user?.Gender
            
         }

      const data =  await user.save();
    //   const token=user.getJWT();
    //  // res.cookie("token",token,{
    //      expires:new Date(Date.now() +8 * 360000)
    //   })
       const token= await user.getJWT();
            res.cookie("token",token,{
                expires:new Date(Date.now() +8 * 360000)
            })

         res.status(200).json({
            message:"successfully added",
            data:Public_Data
         })


    }catch(err){
        res.status(400).json({
            message:"ERROR : " +  err?.message
        })
    }

})



AuthRouter.post("/login",async(req,res)=>{

    try{
        //validate 
        ValidateLogin(req)
        const {email,password}=req.body;
          
        const user=await User.findOne({email:email});
          if(!user){
          return  res.status(400).json({
                  message:"invalid Crendentails"
                }) 
          }
          const hash_password=user?.password
        //   const validate_password=await Bcrypt.compare(password,hash_password)
        const validate_Password = await user.validatePassword(password);
            if(!validate_Password){
               return res.status(400).json({
                  message:"invalid Crendentails"
                }) 
            }
      
            // const token = await jwt.sign({_id:user._id},process.env.SecretKey,{expiresIn:"1d"})
      
            const token= await user.getJWT();
            res.cookie("token",token,{
                expires:new Date(Date.now() +8 * 360000)
            })

         ///  console.log(token)

           const Public_User_Data={
            firstName:user.firstName,
            lastName:user.lastName,
            phone:user.phone,
            Gender:user?.Gender
             
           }
            
             
            res.status(200).json({
               // message:"successfuly login",
                data:Public_User_Data
            })



    }catch(err){
        res.status(400).json({
            message:"ERROR : " + err.message
        })
    }
    
})

AuthRouter.post("/logout",UserAuth,async(req,res)=>{
    try{
        const loginUser=req.user;
        if(!loginUser){
            throw new Error("please login")
        }
        const token=await loginUser.getJWT();
       res.cookie("token",null,{
        expires:new Date(Date.now())
       })
   

       res.status(201).json({
        message:"successfully logout"
       })
         


    }catch(err){
    res.status(400).json({
        message:"ERROR : " +err?.message
    })
    }
})




module.exports=AuthRouter
