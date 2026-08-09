// //import express
// const express =require("express")
// require("dotenv").config();
// // intialize express 
// const app=express();
// const {UserAuth,AdminAuth} = require("./middlewares/auth")
// const {ConnectDB}=require("./config/database")
// const User= require("./models/user")
// const mongoose = require('mongoose');
// const jwt=require("jsonwebtoken");
// const cookiesParser=require("cookie-parser")


// const Bcrypt=require("bcrypt");
// const { ValidateSignUp } = require("./utils/validate");

// app.use(cookiesParser())
// app.use(express.json())
// app.use(express.urlencoded({ extended: true })); // For form data



// // app.use("/hello",(req,res)=>{
// //     res.send("hello hello hello")
// // })

// // app.get("/user",(req,res)=>{
// //     res.send({
// //         firstName:"ismail",
// //         lastName:"oday"
// //     })
// // })

// // app.get("/user/id/:id",(req,res)=>{
// //     res.send({
// //         id:1,
// //         firstName:"mohamed",
// //         lastName:"aamin"
// //     })
// // })


// // // app.get("/user",(req,res)=>{
    
// // //         const UserId=req.query.id ||1;
// // //        const firstName=req.query.firstName || "ahmed";
// // //        const lastName=req.query.lastName || "ismailoday";
// // //     console.log({
// // //         UserId,
// // //         firstName,
// // //         lastName
// // //     })
// // //     res.send(
// // //        {
// // //          id:UserId,
// // //         firstName:firstName,
// // //         lastName:lastName
// // //     }
      
// // //     )
    
// // // })
// // app.get("/user/abc",(req,res)=>{
// //     res.send({
// //         message:"message"
// //     })
// // })
 

// // app.get("/user",(req,res)=>{
// //     const userId=req.query.id || 1;
// //     const firstName=req.query.firstName || "ismail";
// //     const lastName=req.query.lastName || "oday";
// //     console.log({
// //          "message":"successfuly get user data",
// //         userId,
// //         firstName,
// //         lastName
// //     })
// //     res.status(200).json({
// //         message:"successfuly get user data",
// //         userId,
// //         firstName,
// //         lastName
// //     })
// // })



// // app.use("/",async(req,res,next)=>{ // rout

// //      next();
// //     console.log("hanleer route") //router handler

   
// // },(req,res,next)=>{ //route
// //     // second route handler
// //      // res.send("second  route handler")
// //       next();
  
   
   
// // },(req,res,next)=>{
     
// //     res.send("third router handler")
// //     console.log("third handler router")
// // })
 


// // app.use("/admin",AdminAuth)

// //  app.use("/user",UserAuth)

// // app.get("/admin/GetAllData",(req,res,next)=>{
    
// //         res.send("Get All data")

// // })

// // app.use("/user/login",(req,res)=>{
// //     res.send("login successfully")
// // })


// // app.get("/user/getUSER",(req,res,next)=>{
   
     
// //      res.send("GETS USER DATA")
    
// // })
// // app.get("/user/data",(req,res,next)=>{
     
    
// //      res.send("GETS USER DATA")
    
// // })


// const port=process.env.PORT || 7000
 

// app.post("/signUp",async(req,res)=>{

//     try{

//         // validate data
//         ValidateSignUp(req)
       
      

//         const {firstName,lastName,phone,email,password}=req.body;
//           //Encrypt password
//         const Password_Hash= await Bcrypt.hash(password,10)

//           //create instance
//         const user=  new User({
//             firstName,
//             lastName,
//             phone,
//             email,
//             password:Password_Hash
//         })

//         await user.save();
//         res.send("successfully added")


//     }catch(err){
//       res.send("not added" + err.message)
//     }

// })


// // app.post("/login",async(req,res)=>{
// //     try{
// //        const {email,password}=req.body
// //        const user= await User.findOne({email:email})
// //        if(!user){
// //         return res.status(400).json({
// //             message:"invalid credentails"
// //         })
// //        }

// //        const Hashed_Password=user?.password

// //        const passwordCheck= await Bcrypt.compare(password,Hashed_Password)
// //        if(!passwordCheck){
// //       return  res.status(400).json({
// //             message:"invalid credentails"
// //         })
// //        }
// //        else{
// //         res.status(200).json({
// //             message:"successfully login"
// //         })
// //        }


// //     }catch(err){
// //         res.status(400).json({
// //             message:"ERROR : " + err.message
// //         })
// //     }
// // })

// app.post("/login",async(req,res)=>{
//     try{
//         const {email,password}=req.body
//         const user= await User.findOne({email:email})
//         if(!user){
//             return res.status(400).json({
//                 message:"invalid credentails"
//             })
//         }
  
         
//         const validate_Password=await Bcrypt.compare(password,user?.password)
//         if(!validate_Password){
//             return res.status(400).json({
//                 message:"invalid credentails"
//             })
//         }

//         //check user email and password 
//        //create jwt 
//        //send cookies token

//        const token = await jwt.sign({_id:user?._id},"Dev@9u3jn!");
//        res.cookie("token",token)

//     ///    console.log(token)

       

//         res.status(200).json({
//             message:"successfully login",
//             user
//         })



//     }catch(err){

//         res.status(400).json({
//             message:"Error " + err.message
//         })

//     }
// })


// app.get("/profile",UserAuth,async(req,res)=>{
//     try{
//         const user=req.user
//     //    const cookies=req.cookies
//     //    const {token}=cookies
//     //     if(!token){

//     //     return res.status(400).json({
//     //         message:"token invalid"
//     //     })

//     //    }

//     //    const decodedData= await jwt.verify(token,"Dev@9u3jn!")
      
//     //    const {_id}=decodedData

//     //    const user= await User.findById(_id)
//     //    if(!user){
//     //     return res.status(400).json({
//     //         message:"user not found"
//     //     })

//     //    }

//        res.status(200).json({
//         message:`${user.firstName}  your profile`,
//         user
//        })

//     }catch(err){
//         res.send("something wrong ....." + err.message)
//     }
// })



// // app.patch("/profile/edit/:email",async(req,res)=>{
// //     try{

        
// //         const UserCheck= await User.findOne({email:req?.params?.email})
// //         if(!UserCheck){
// //           return  res.status(400).json({
// //                 message:"user not found"
// //             })
// //         }
// //         const{firstName,lastName,phone}=req.body
// //         const UpdatedUser= await User.findByIdAndUpdate(UserCheck?._id,{
// //             firstName,
// //             lastName,
// //             phone
 
// //         },{
// //             runValidators:true,
// //             returnDocument:"after"
// //         })
        
// //         res.status(200).json({
// //             message:`${UserCheck?.firstName} your updated profile`
// //         })
// //     }catch(err){
// //         res.status(400).json({
// //             message:"something wrong " + err.message
// //         })
// //     }
// // })



// // app.delete("/user/delete/email/:email",async(req,res)=>{
// //     try{
// //         const user = await User.findOne({email:req.params?.email})
// //         if(!user){
// //         return    res.status(400).json({
// //                 message:" not authorized"
// //             })
// //         }
// //         const deletedUser= await User.findByIdAndDelete(user?._id)
// //         res.status(200).json({
// //             message:"successfully deleted"
// //         })

// //     }catch(err){
// //      res.status(400).json({
// //         message:"something wrong " + err.message
// //      })
// //     }
// // })


// app.get("/feed",UserAuth,async(req,res)=>{

//     try{
//         const loginUser=req.user
//         if(!loginUser){
//             throw new Error("please login")
//         }
//         const users=await User.find()
//          res.status(200).json({
//             count:users.length,
//             users:users
//          })

//     }catch(err){
//         res.status(400).json({
//             message:"ERROR " +err.message
//         })
//     }

// })


// ConnectDB().then(async()=>{
//   try{
//       console.log("connected successfuuly")
//     app.listen(port,()=>{
//     console.log("server running port 7000")
// })
//   }catch(err){
//     console.log("not connected database")
//   }


// })

