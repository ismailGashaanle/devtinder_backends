// const cron=require("node-cron")
// const  {SubsDay}=require("date-fns")

// const ConnectionRequest = require("../models/connectionRequest");
// const sendEmail=require("../services/emailService");


// cron.schedule("32,22,*,*,*",async()=>{
//     try{
//         const yesterday= SubsDay(new Date(),0);
//         const yesterdayStart = startofDay(yesterday);
//         const yesterdayEnd = endOfDay(yesterday);

//         const pendingRequest= await ConnectionRequest.find({
//             status:"interested",
//             createdAt:{
//                 $gte:yesterdayStart,
//                 $lt:yesterdayEnd,
//             }
//         }).populate("fromUserId toUserId");

//         const listOfEmail=[
//             ...new Set(pendingRequest.map((req)=>req.toUserId.email)),
//         ]

//         console.log(res);
//         for(const email of listOfEmail){
//             try{

//                 const emailResult = await sendEmail({
//                       to: data.email,
              
//                       subject: "Welcome to DevTinder",
              
//                       text: `${data.firstName} Welcome to DevTinder!`,
              
//                       html: `
//                         <h1>Welcome ${data.firstName} to DevTinder!</h1>
              
//                         <p>
//                           Your account has been created successfully.
//                         </p>
              
//                         <p>
//                           You can now log in and start connecting with developers.
//                         </p>
              
//                         <p>
//                           Thanks for joining DevTinder!
//                         </p>
//                       `
//                     });

//                     console.log(emailResult)
//             }catch(err){
//                 console.log(err)
//             }
//         }


//     }catch(err){
//         console.log(err)
//     }
// })


const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");

const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("../services/emailService");

cron.schedule("1 23 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 0);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequest = await ConnectionRequest.find({
      status: "addfriend",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

  const listOfEmail = [
    ...new Set(
        pendingRequest
            .filter((req) => req.toUserId?.email)
            .map((req) => req.toUserId.email)
    ),
];

    console.log("Emails:", listOfEmail);

    for (const email of listOfEmail) {
      try {
        const emailResult = await sendEmail({
          to: email,

          subject: "You have pending connection requests",

          text: "You have pending connection requests on DevTinder.",

          html: `
            <h1>Pending Connection Requests</h1>

            <p>
              You have pending connection requests on DevTinder.
            </p>

            <p>
              Log in to DevTinder to review your connection requests.
            </p>

            <p>
              Thanks for using DevTinder!
            </p>
          `,
        });

        console.log("Email sent:", emailResult);
      } catch (err) {
        console.log("Email error:", err);
      }
    }
  } catch (err) {
    console.log("Cron job error:", err);
  }
});