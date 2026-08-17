const User=require("../models/user")
const jwt=require("jsonwebtoken")
 
// const UserAuth=async(req,res,next)=>{

//    //read token  use cookies?/
//    //destruct token {token}
//    // decodedData token use jwt
//    //check token
//    try{
//     const cookies=req.cookies
//     const {token}=cookies
//     if(!token){
//         return res.status(201).json({
//             message:"invalid token"
//         })
//     }
//     const decodedData=await jwt.verify(token,"Dev@9u3jn!");
//      const {_id}=decodedData
//      const user= await User.findById(_id);
//      if(!user){
//         return res.status(404).json({
//             message:"user not found"
//         })
//      }

//       req.user=user
//       next();
//    }
//  catch(err){
//     return res.status(401).json({
//     message: "ERROR : " + err.message
// });
//  }
   
// }

const UserAuth=async(req,res,next)=>{
    try{
        //read token  to read use
        //destruct token
        // check token 
        //decodeddata 
        //find _Id user


        const cookies=req.cookies
        const {token}=cookies
        if(!token){
           return  res.status(401).json({
                message:"please login"
             })
        }
        const decodedData=  jwt.verify(token,process.env.SecretKey)
        const {_id}=decodedData
        const user= await User.findById(_id)
         if(!user){
            throw new Error("user not found")
         }

         req.user=user
         next();
 
    }catch(err){
    return res.status(401).json({
        message:"ERROR : " + err.message
    })
}

}


const AdminAuth=(req,res,next)=>{
    const token = "adminIsmail";
    const isAuthorizedAdmin=token ==="adminIsmail"
    if(!isAuthorizedAdmin){
        res.send("not Authorized admin")
    }
    else{
        next()
    }

}





module.exports={
    UserAuth,
    AdminAuth
}