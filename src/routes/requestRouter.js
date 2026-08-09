
const express=require("express");
const { UserAuth } = require("../middlewares/auth");
const  requestRouter=express.Router();
const ConnectionRequest=require("../models/connectionRequest")
const User=require("../models/user")


requestRouter.post("/request/send/:status/:toUserId",UserAuth,async(req,res)=>{
    try{

        const loginUser=req.user
        if(!loginUser){
            res.status(400).json({
                message:"please login"
            })
        }

        const fromUserId=loginUser?._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus=["addfriend","remove"];
            if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Unknown Status Type"
            })
            };

            const toUserIds=await User.findById(toUserId)
            if(!toUserIds){
                throw new Error("not found user")
            }


            const exitingConnection= await ConnectionRequest.findOne({
                $or:[
                    {fromUserId,toUserId},
                    {fromUserId:toUserId,toUserId:fromUserId},
                ],
            })

            if(exitingConnection){
                throw new Error("already exiting connection")
            }


      
        const connectionRequests= new ConnectionRequest({
            fromUserId:fromUserId,
            toUserId:toUserId,
            status:status
        })

         const data= await connectionRequests.save();

         res.status(200).json({
            message:`${loginUser?.firstName}  is  ${status}   to  ${toUserIds.firstName} `,
            data:data
         })
        

    }catch(err){
        res.status(400).json({
            message:"ERROR : " + err.message
        })
    }
})

requestRouter.post("/request/review/:status/:requestId",UserAuth,async(req,res)=>{

    try{
        const loginUser=req.user;
        if(!loginUser){
            throw new Error("please login")
        }

        //check login user 
       
        // check toUserid_id if equal  to_USER.Id.req.params._id or loginUser
        // check fromUserId, is eqaul  requestRevicedID? 

        const requestId=req.params.requestId
       
        const status=req.params.status

        const allowedStatus=["confirm","delete"];
        if(!allowedStatus.includes(status)){
         throw new Error("invalid status Type")
        }

        const toUserIdCheck=await ConnectionRequest.findById(requestId)
        if(!toUserIdCheck){
            throw new Error("not found user request from received this " + requestId)
        }

  
        const connectionRequests= await ConnectionRequest.findOne({
            // toUserId:loginUser._id,
            _id: requestId,
           toUserId:loginUser._id,
            status:"addfriend"
            
   

        })

        if(!connectionRequests){
       throw new Error("not found any request from this ")
        }

        connectionRequests.status=status

        await connectionRequests.save()


        res.status(200).json({
            message:"succesfflu receded",
            connectionRequests
        })

        
      


    }catch(err){
        res.status(400).json({
            message:"ERROR : " +err.message
        })
    }

})


module.exports=requestRouter








module.exports=requestRouter