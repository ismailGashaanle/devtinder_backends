
const mongoose=require("mongoose");
const express= require("express")
const validator=require("validator")
const jwt=require("jsonwebtoken")
const Bcrypt=require("bcrypt")
const userSchema= new mongoose.Schema({

    firstName:{
        type:String,
        required:[true,"please fill firstName"],
        trim:true,
        maxLength:50,
        lowercase:true,
        minlength:2
        
    },
    lastName:{
        type:String,
        required:[true,"please fill lastName"],
        trim:true,
        maxLength:50,
        lowercase:true,
        minlength:2,
      //  index:true
    },

    phone:{
        type:String,
        maxLength:18,
        trim:true,
        required:[true,"please fill phone"],
        unique:[true,"phone already exit"],
        validate(value){
            if(!validator.isMobilePhone(value)){
                throw new Error("invalid phone number")
            }
        }
    },
    email:{
        type:String,
        required:[true,"please fill Email"],
        unique:[true,' already exit email'],
        trim:true,
        maxLength:70,
        lowercase:true,
        validate(value){
           if(!validator.isEmail(value)){
            throw new Error("invalid Email")
           }
        }
    },

    password:{
         type:String,
        required:[true,"please fill Email"],
        trim:true, 
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("invalid password")
            }
        } 
    },
    Gender:{
        type:String,
        enum:{
            values:["male","female"],
            message:`{VALUE} incorrect Gender`
        },
        trim:true,
        lowercase:true,
        
    },
   photo:{
    type:String,
    validate(value){
        if(!validator.isURL(value)){
            throw new Error("invalid photo Image")
        }
    },
    default:"https://static.vecteezy.com/system/resources/thumbnails/032/176/191/small_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg"
   },
   status:{
   type:String,
   enum:{
    values:["AddFriend","confirm","delete","Remove","block","unblock"],
    message:`{VALUE} incorrect status`
   }
   },

   isAdmin:{
    type:Boolean,
    default:false

   }



},{timestamps:true})

userSchema.methods.getJWT = async function  (){
    const user=this;
    const token=await jwt.sign({_id:user?._id},process.env.SecretKey,{
        expiresIn:"1d"
    })
    return token
}


userSchema.methods.validatePassword=async function(InputPasswordUser){
const user=this;

const validatePassword= await Bcrypt.compare(InputPasswordUser,user?.password);


return validatePassword

}

const User =mongoose.model("User",userSchema)


module.exports= User
