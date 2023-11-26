// Here is the authen-thing
const express = require('express');
   const oathenRouther = express.Router();
   oathenRouther.use(express.static("public"));



  //   the tokenencrypting thing
  const {cookieToken}  = require("../util-staff/Token-staff")
  const {sendMail}  = require("../util-staff/sendEmail")
  const {veriToken}  = require("../util-staff/Token-staff")
  const useridentity = require("../Model/Useridentity");

   
// here is for the passport thing 
const passport = require("passport"); 
//  for the express-session  
const session = require("express-session");
// get ready expresso  
 
oathenRouther.use(session({
   secret: 'SECRET',
   resave: false,
   saveUninitialized: true
 }));
//   here is for the passport
 passport.serializeUser(function(user,done){
    done(null,user);
 })  //doing the saving of  the data called user

 passport.deserializeUser(function(user,done){
   done(null,user);
 })
  
    

   oathenRouther.use(passport.initialize());
   oathenRouther.use(passport.session())

// for the googleauthen 
 const googleAuthen = require("passport-google-oauth").OAuth2Strategy
 const client_ID  = "499424974257-8fns3gu3opui5mnoe1ig91q5vjpj973c.apps.googleusercontent.com"
const client_secret  = "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";
  
  
//  making the passport use the googlepassport thing 
passport.use(new googleAuthen({
   clientID :client_ID,
   clientSecret : client_secret,
   callbackURL: "http://localhost:3000/auth/google/callback"   ,
   passReqToCallback: true // Add this option to pass 'req' as the first argument
  
}, 
async function(req,acessToken,refreshToken,person,done){
    try {   
   const user= await useridentity.findOne({GoogleUserID  : person.id})
              if(user !== null){ 

                //  req.res.cookie("UserToken",cookieToken(user._id),{ httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }).redirect("/")
                 done(null,user)
              }else{
                const oneman = new useridentity({
                  Email: person.emails[0].value,
                  StageName: person.displayName,
                  verificationToken: veriToken()
                })
                   await oneman.save();
                   req.res.cookie("UserToken", cookieToken(oneman._id),
                    { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                 console.log("User saved successfully");
                  done(null,oneman)
           }
          }catch(err){
             done(err)
          }

          
          })
  )
  

//  router for instance  
oathenRouther.get("/",
 passport.authenticate("google",{scope : ["profile","email"]}
 ))
  
//  rout for going to be google auth people
oathenRouther.get('/google/callback', passport.authenticate("google", { failureMessage: "/" })
, async (req, res) => {
 res.redirect("/")
 });
 
  module.exports = oathenRouther;  
 
 