const bodyParser = require("body-parser");
 const bcrypt = require("bcryptjs");
  const cokieParser = require("cookie-parser");
const express = require("express");
 const UserRouter = express.Router();
    UserRouter.use(express.static("public"))
     UserRouter.use(cokieParser())
 



     // utile function 
     
     const {veriToken} = require("../util-staff/Token-staff")
      const {cookieToken}= require("../util-staff/Token-staff")
         const {sendMail}  = require("../util-staff/sendEmail")
          const {genToken} = require("../util-staff/Token-staff")
          const {verifyToken} = require("../util-staff/Token-staff")






//   DataBases
 const  UserIdentity = require("../Model/Useridentity");
  
//  FOR SignUp
UserRouter.get("/signUp",(req,res)=>{
     res.render("Pages/SignUp.ejs");
 })
//  FOR LogIn
 UserRouter.get("/logIn",(req,res)=>{
      res.render("Pages/login.ejs");
 })

//  For Signing Up
 UserRouter.post("/signUp",async(req,res)=>{
     
     const exitsthere =  await UserIdentity.findOne({Email: req.body.emailContent})
  if(exitsthere){
       res.status(400).send("Email is in the system")
  }
   console.log(req.body.type);
 
     try {
      const NewUserIdentity  =  new UserIdentity({
           StageName :  req.body.StageName,
            Email  :req.body.emailContent,
            Password :  req.body.Password,
            verificationToken : veriToken(),
            type : req.body.type
          
      })
       let outNow =  await NewUserIdentity.save();
         if(outNow){ 
          //  Token thing
           res.cookie("UserToken",cookieToken(outNow._id),{ httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }).redirect("/")
//   Sending the verification Email 
 await sendMail(`http://localhost:3000/user/verification?token=${outNow.verificationToken}`,"Verification of accout",outNow.Email);
//    res.send("well done thing are in place "); 
}else{
         res.redirect('/');
         console.log("token staff could not work");
         }
           } catch (error) {
               console.log(error)
                res.send("sometime Bad happend so no saving");
                 }
     })
// For Logining In
UserRouter.post("/logIn",async(req,res)=>{
      const  emailContent= req.body.emailContent
      const  Password = req.body.Password
 try {
     const outcomeofS = await UserIdentity.findOne({Email : emailContent})
     console.log(outcomeofS)
       if(outcomeofS){
          //  here is for the checking of the password
           const userHashPW = outcomeofS.Password;
            
 bcrypt.compare(Password,userHashPW,(err,outcome)=>{
       if(outcome){
          res.cookie("UserToken",cookieToken(outcomeofS._id),{ httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }).redirect("/")
          }else{
          //  we are going to be serving the 
          res.render("Pages/login.ejs",{news : "Password incorrect"});

       }
 })             

       
     }else{
           res.send("not a user")
       }
// here for the login session token 
 
 } catch (error) {
      res.send("this man not a  user..")
 }
})

// Router for the handling of the user information 
UserRouter.get("/n/:user_id/editing",async(req,res)=>{
      try{
const userNow = await UserIdentity.findOne({_id : req.params.user_id})
           res.render("./component/Edit",{user : userNow})
      }catch{
           res.send("it is not happening bro")
      }
})

UserRouter.post("/:user_id/edit", async(req,res)=>{
     //  here  the person do the real edit 
     try{
          const userNow  =  
          await UserIdentity.findOneAndUpdate({_id : req.params.user_id},{StageName : req.body.StageName})
          // await userNow.save()
       res.send("this name was change goody")
     }catch{
           res.send("could not do the change")
     }
})


//  here is for the useremailcheking
 UserRouter.get("/check-email",async(req,res)=>{
      const emailvalue = req.query.email
       const inther =  await UserIdentity.findOne({Email: emailvalue})

        if(inther){  
           res.json({isthere :true})
         }else{
          res.json({isthere :false})
     }
 })

// ----------- Password Recovery Process ------- 
UserRouter.get("/forget",(req,res)=>{
//   Enter you email
      res.render("Pages/forget.ejs")
           })
UserRouter.post("/forget",async(req,res)=>{
             let emailContent = req.body.emailContent;
             let user = await UserIdentity.findOne({Email : emailContent});
               const token =   genToken();
 const recoveryURL =  
          `http://localhost:3000/user/recovery?userid=${user._id}?token=${token}`
//    send the recorvery link
 const ans =  sendMail(`${user.StageName} <br>
 <div> Please visit this link to enter you new password
   <span>
    Note the link is dead within the next 24 hour!!! 
    </span> <br>
     
    ${recoveryURL}
    </div>`,"Password-Recorvery",user.Email)
    
     
            if(ans == "email sent"){
              res.render("Pages/Massage-Delivery.ejs",{message :"good new"})
            }else{
               res.render("Pages/Massage-Delivery.ejs",{message:"could not send"})
            }
       
     })
           
// if the email was sent   
               UserRouter.get("/recovery",(req,res)=>{
                const tokenvalue  = req.query.token;
                const cheker =   verifyToken(tokenvalue);
                if(cheker === "GoodLink"){
                      res.render("Pages/Password-Recreation").
                       console.log("some one is trying to create the password")
                }else{
                     res.status(400).send("there was an error")
                }
           })
            
          //   here for the getting of the value of the password
           UserRouter.post("/recovery/:userid",async(req,res)=>{
                   const userid  = req.params.userid;
               //     finding the user
                 var userNow  = await UserIdentity.findOne({_id:userid})
     
                  if(userNow){
                    userNow.Password  = req.body.Password;
                     userNow.save();
                  }else{
                      res.status(400).send("there is some wrong with the password")
                  }
                    
           })


  // for the logout and other
  UserRouter.get("/:userid",async(req,res)=>{
     let user = await UserIdentity.findOne({_id : req.params.userid});
   //  here is the option 
    res.render("./Pages/log_out.ejs",{user});
 })
UserRouter.get("/:ans/log_out",(req,res)=>{
   let thing = req.params.ans;
    if(thing === "Yes"){
      res.clearCookie("UserToken");

        res.redirect("/");
    }else{
  res.status(400).send("there was a big error"); 
 }
  
})



module.exports  = UserRouter;