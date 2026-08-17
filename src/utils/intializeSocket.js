
const socket=require("socket.io")
const cors=require("cors")
const crypto=require("crypto")
const Chat = require("../models/Chat")
const ConnectionRequest = require("../models/connectionRequest")
const Public_Save_Data=["firstName","lastName","phone","photo","Gender"]

const getSecretRoomId=(userId,toTargetUser)=>{
    return crypto 
    .createHash("sha256")
    .update([userId, toTargetUser].sort().join("&"))
    .digest("hex")
}
const intializeSocket=(serverApp)=>{

const io=socket(serverApp,{
    cors:{
        origin:"http://localhost:5173",

    }
})


io.on("connection",(socket)=>{

    socket.on("joinChat",async({firstName,userId,toTargetUser})=>{
        // const roomId=({userId,toTargetUser}).sort().join("_");
            const connectionRequest = await ConnectionRequest.findOne({
    status: "confirm",
    $or: [
        {
            fromUserId: userId,
            toUserId: toTargetUser
        },
        {
            fromUserId: toTargetUser,
            toUserId: userId
        }
    ]
});
  
          
            if(!connectionRequest){
            
               console.log("user have not connected")
               return ;
              
            }
          const roomId =getSecretRoomId(userId,toTargetUser);
        //   const roomId = [userId, toTargetUser].sort().join("_");
        console.log(firstName + "joining room " + roomId)
        socket.join(roomId)

    })

    // socket.on("sendMessage",(socket)=>{

    // })

                // socket.on("sendMessage", ({ firstName, userId, toTargetUser, text }) => {
                // const roomId = [userId, toTargetUser].sort().join("_");

                // console.log(firstName + " " + text);

                // io.to(roomId).emit("messageRecieved", {
                // firstName,
                // text
                // });
                // });
    // socket.on("sendMessage",({firstName,userId,toTargetUser,text})=>{
 
    //        const roomId=[userId,toTargetUser].sort().join("_");
    //        console.log(firstName + " " + text)
    //        io.to(roomId).emit("messageRecieved",{
    //         firstName,
    //         text
    //        })
    // })

    socket.on("sendMessage", async({ firstName, userId, toTargetUser, text }) => {
      // const connectionReuqest=await ConnectionRequest.find({
      //   fromUserId:userId,
      //   toUserId:toTargetUser,
      //   status:"confirm"
      // })
     if(userId===toTargetUser){
       
          console.log("not allowed to chat in your self acocunt") 
      // throw new Error("not allowed to chat in your self account")
      
       return;
          
     
      
     }

      
            const connectionRequest = await ConnectionRequest.findOne({
    status: "confirm",
    $or: [
        {
            fromUserId: userId,
            toUserId: toTargetUser
        },
        {
            fromUserId: toTargetUser,
            toUserId: userId
        }
    ]
});
            if(!connectionRequest){
            
                console.log("user not have connected")
                return ;
              
            }
  const roomId =getSecretRoomId(userId,toTargetUser);
//   const roomId = [userId, toTargetUser].sort().join("_");

  console.log(firstName + " " + text);
     
  try{

    let chat = await Chat.findOne({
      participant :{$all:[userId,toTargetUser]},
    })

    if(!chat){
      chat= await new Chat({
        participant:[userId,toTargetUser],
         messages:[]
      })
    }

    chat.messages.push({
      senderId:userId,
      text,
    })

    await chat.save();


  }catch(err){
    console.log(err)
  }

  io.to(roomId).emit("messageRecieved", {
    firstName,
    text
  });
});

    socket.on("dissconnected",(socket)=>{

    })


})


}

module.exports=intializeSocket