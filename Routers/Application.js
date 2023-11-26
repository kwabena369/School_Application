const  express = require('express'); 
 const application =   express.Router();
 const multer = require("multer");
const path  = require("path")
   const Application = require("../Model/Application")
 
  
 const { sendMail } = require('../util-staff/sendEmail');
const { cookieToken } = require('../util-staff/Token-staff');
const { applicant_authen } = require('../util-staff/Authen_Applicant');
 
const requireAuthn  = require("../util-staff/Authen_Applicant")

application.use(express.static("public"));
//   for the dealing with the file 
 const storage = multer.diskStorage({
      destination : (req,file,cb)=>{
          cb(null,path.join(__dirname,"../public/Application/Teacher"))
      }, 
       filename : (req,file,cb)=>{
          cb(null,req.body.fname +"-"+req.body.lname+"."+file.mimetype.split('/')[1]);
       }
 })
  
  const uploader = multer({storage : storage});
  

    
   let job_db = require("../Model/Create_Job")
   
//   for the teacherApplication
 application.get("/",async(req,res)=>{    
   // for the sending of all the poitn available
   let all_jobs = await job_db.find();
   res.render("./Pages/Applicants/All_Job.ejs",{all_jobs})
})


application.get("/job/output.css",(req,res)=>{
   res.sendFile("output.css",{root : "./public"})
 })
 
//  here is the router to direct the user to the specific job form 
  
 application.get("/job",async(req,res)=>{
   //   for the specific job
    let job_id = req.query.job_id;
    let job_now = await job_db.findOne({_id : job_id}); 
    res.render("./Pages/Applicants/Apply.ejs",
    {job_info : job_now,massage:""})   
   })



 application.post("/job",uploader.single("application_letter"),async(req,res)=>{
        let fname = req.body.fname;
        let lname = req.body.lname;
        let Password = req.body.Password;
        let email = req.body.emailContent;
        console.log(req.file)

         // here is for the getting of the object thing
   let job_type = await job_db.findOne({_id :req.query.job_id}) 

    
   const  isthere  = await Application.findOne({Email : email}); 
 if(isthere){
   res.render("./Pages/Applicants/Apply.ejs",{massage:"login"})   
 }else{
     const here = new Application({
          First_Name  :fname,
           Last_Name :lname,
            Email : email,
             Password : Password,
              Filename : req.file.filename,
               Job_title  : job_type
     })
    
 try{
      let appli  = await here.save();
      //  increate the number of applicant of that section 
       job_type.So_far_applied+=1;
        await job_type.save();
    // generate the cookie
    res.cookie("Applicant_ID",cookieToken(here._id),
    {httpOnly : true,maxAge : 24*60*60*1000});
// render the page
    res.redirect("/apply/status");
   //   here is for there other side 
    }catch(err){
       console.log(err);
         res.status(500).send("saving couldn't")
    }
     } 
  
   })
  
    
 application.get("/check-email",async(req,res)=>{
    const emailvalue = req.query.email
     const inther =  await Application.findOne({Email: emailvalue})
      if(inther){  
         res.json({isthere :true})
       }else{
        res.json({isthere :false})
   }
})

//   route for the status.ejs
 application.get("/status",requireAuthn,async(req,res)=>{
   //  here for 
    let appli = await Application.findOne({_id : req.auth_id})
   res.render("./Pages/Applicants/status.ejs",{user: appli,massage : "Please Check Email for Verication"}) 
 console.log(appli)
   })

 
// here is for the loging of the Applicant to check the status
 application.get("/l",async(req,res)=>{ 
   res.render("./Pages/Applicants/Applicant_login.ejs"); 
 })




 application.post("/l",async(req,res)=>{
    const bcrypt  = require("bcryptjs")
   const  emailContent= req.body.emailContent
   const  Password = req.body.Password
try {
  const outcomeofS = await Application.findOne({Email : emailContent})
  console.log(outcomeofS)
    if(outcomeofS){
       //  here is for the checking of the password
        const userHashPW = outcomeofS.Password;
         
bcrypt.compare(Password,userHashPW,(err,outcome)=>{
    if(outcome){
       res.cookie("Applicant_ID",cookieToken(outcomeofS._id),
       { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }).
       redirect("/apply/status")
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
    console.log(error)
   res.send("this man not a  user..")
}
})

//  for the logout
 application.get("/log_out",(req,res)=>{
 try{
    
    res.clearCookie("Applicant_ID");
     res.json({result :true});
 }catch{
   res.json({result :false});
}
      
 })


 module.exports = application;