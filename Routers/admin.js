              //  here is for the router for the admin only

  const express = require('express');
    const  adminRouter = express.Router();
      adminRouter.use(express.static("public"));



      adminRouter.use("/one_applicant",express.static("public"));


    //   for the admin db
     const adminDB = require("../Model/Admin");
    //  for the teachers Applicant
     const teacher = require("../Model/Application");

    //  for the password thing 
     const bcrypt = require("bcryptjs")

     const {decrypt_chat,encrypt_chat} =  require("../util-staff/chat_encode_decoder")
 
      //   the other util function 
      // db for the various chat room
      const chat_Room  = require("../Model/Room")

       
      const Specific_Chat = require('../Model/Specific_Chat');
           //  for the create_
         const job_db = require("../Model/Create_Job");

    //  util
     const {cookieToken}  = require("../util-staff/Token-staff");
      const {adminAuth} = require("../util-staff/Authen_Admin");
const Useridentity = require('../Model/Useridentity');
const Admin = require('../Model/Admin');
       

adminRouter.get("userprofile/:userid",async(req,res)=>{
  let realuser =  await Useridentity.findOne({_id : req.params.userid.split(".")[0]})
   if(realuser){
     res.sendFile(req.params.userid, { root: 'public/userProfile' });
   }
   
})
      //  here is for the home 
 adminRouter.get("/",adminAuth,async(req,res)=>{
// numbere of  room chat with the value of Read set to no
  let unread = await chat_Room.count({"Read":"No"});
   res.render("./Pages/admin/My_space.ejs",{Number_Unread : unread});
 })
//  admin_login
adminRouter.get("/l",(req,res)=>{
  res.render("./Pages/admin/admin_login.ejs");
 })
adminRouter.post("/l",async(req,res)=>{
  let {email,password} = req.body.info_now;
  //   cheking the db 
    let admin_Now = await adminDB.findOne({Email : email});
    if(admin_Now){
          // for the password
        let donecompare = await bcrypt.compare(password,admin_Now.Password);
         if(donecompare){
          //   setting the cokies
          res.cookie("adminToken",cookieToken(admin_Now),
          { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
              console.log("this is a real person");
           res.redirect("/admin")
           }else{
             res.send("there is password fault");
              console.log("not passw")
           }

       
    }else{
       res.send("you are not admin ")
       console.log("you are not admin ")
    }
   
 })


// for the one time creation of abmin 
 adminRouter.get("/j",(req,res)=>{
  res.render("./Pages/admin/Apply.ejs");
 })
 adminRouter.post("/j",async(req,res)=>{
  let email = req.query.email;
  let pw = req.query.pw;

        let onehere = new adminDB({
             Email : email,
           Password  : pw
             })
    // saving it
    
     try{
    let done =  await onehere.save();
            //  creating the token 
res.cookie("adminToken",cookieToken(onehere._id),
{ httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }).redirect("/admin")
} catch{
         res.status(400).send("there is alot of bad thing");
     }
      

       
 })



 adminRouter.get("/speci/output.css",(req,res)=>{
  res.sendFile("output.css",{root : "./public"})
})


//  /apply/job/?job_id=<%=element._id %>
  adminRouter.get("/speci",adminAuth,async(req,res)=>{
     let ghost_id = req.query.job_id;
  //   Bring out all the people who apply for the job
  let job_now =  await job_db.findOne({_id: ghost_id})
  // req.query.job_id;     
       
     let listT=   await teacher.find({Job_title:{$in:job_now}});
      res.render("./Pages/admin/Applicants.ejs",{listT,job_now})
  })

// for the reviewing 
  adminRouter.get("/one_applicant",adminAuth,async(req,res)=>{
      // find applicant
       let userid = req.query.applicant_id
     
         try{
          let applicantNow = await teacher.findOne({_id :userid})
          if(applicantNow){
             res.render("./Pages/admin/Reviewing_Page.ejs",{applicantNow})
          }
      
         }catch{
res.status(400).send("bad thing")
         }
      })

      adminRouter.get("/file/:file_name",(req,res)=>{
        res.sendFile(`${req.params.file_name}`,{root : "./public/Application/Teacher"})
      })
     
      // adminRouter.get("/one_applicant/output.css",(req,res)=>{
      //   res.sendFile("output.css",{root : "./public"})
      // })

  adminRouter.post("/tea",async(req,res)=>{ 
    let action  = req.query.action_Now;
    let id = req.query.id
   

       if(action !== null){
         try{
         let applicantNow = await teacher.findOne({_id :id})
         .populate("Job_title");
            applicantNow.status = action;
            applicantNow.checked ="Checked"

//   then push the applicant inti the array and then do the
// thing of increamenting the value of check 
let _people_checked =applicantNow.Job_title._Array_checked
 if(_people_checked.length !== 0){

   if(applicantNow.Job_title._Array_checked.contains(applicantNow._id)){
     console.log("person already checked")
   }else{
    console.log("person not already checked")
    _people_checked.push(applicantNow._id);
    applicantNow.Number_Check+=1;
   }
 }else{
   _people_checked.push(applicantNow._id);
 applicantNow.Number_Check+=1;
 }
             await applicantNow.save()
              //  here we are sending mail to the applicant about the acito
               
               const {sendMail} = require("../util-staff/sendEmail")
               
               await sendMail(`Hello ${applicantNow.First_Name} your applcantion
                 has been reviewed plese here your profile .`,"Applicantion",applicantNow.Email);


                 
          res.redirect(`/admin/created_jobs`);
             }catch(err){
              console.log(err)
           res.redirect('/');
         }
       }
     
  })




  // for the serving to the auth about thing we got
   
   adminRouter.get("/people_chat",
   adminAuth,async(req,res)=>{
    

    // Some_New is set to true then it 
    // mean there is something new
try{
   
    let all_staff = await chat_Room.
    find({Some_New :true}).populate("User_Room")
  
         
 if(all_staff){
  //  console.log(all_staff);
   res.render("./Pages/admin/admin_Chat_room.ejs",{all_staff})
 }else{
  res.send("there is none new here");
 }
}catch(err){
   console.log(err);
}
     
   })

 
   
 adminRouter.get("/the_chat",adminAuth,async(req,res)=>{

 


  //  base on the userid sen
   let user_id =req.query.user_id
    
let user = await Useridentity.findOne({_id : user_id})

//  here it is the admin who is in charge
     let user_2 = await Admin.findOne({_id : req.auth_id});

    
    //   the room user is associated with
  let room_user = await chat_Room.findOne({User_Room : user.id});
  
       //  if this route is hit itt mean the admin has read 
    //  it so we set the value of the read to yes

      //  using the socket to may be check if the user is there 
        room_user.Read = "Yes"
         room_user.save()
  // finding all the chat associated with that rromm
    let _room_chats = await
    Specific_Chat.find({Room_ID  :{$in  : room_user}})
  
_room_chats = _room_chats.map(element =>{
// once upon a time for one 
 let decrypted_chat  = decrypt_chat(element.Chat_Real_Staff);
  return {...element,Chat_Real_Content: decrypted_chat}
 })

 console.log(_room_chats)

res.render("./Pages/admin/admin_single_chat.ejs",
{user:user_2,_room_chats,userNow:user});    



   })

  
   adminRouter.get("/the_chat/output.css",(req,res)=>{
    res.sendFile("output.css",{root : "./public"})
  })
      

  
  adminRouter.get("/the_chat/socket.io-client.js",(req,res)=>{
    res.sendFile("socket.io-client.js",{root : "./public"})
  })



// here is the router--
//  for-- the otherone 
// 
 
 adminRouter.get("/create_jobs",(req,res)=>{


   // user get to enter the name 
res.render("./Pages/admin/make_job_postion.ejs")
 })


  // here is the router for handling the form 
  adminRouter.post("/create_job",(req,res)=>{
//  there is going to be three  section 
  const {Job_Title,Number_Applicant} = req.body
   let job  = new job_db({
     Job_title : Job_Title,
      Number_Applicant :Number_Applicant
   })

    try{
       job.save();
res.redirect("/admin/created_jobs")       
    }catch(err){
       console.err(err)
    }
   })
 

  //   here is for the displaying of the created jobs
  adminRouter.get("/created_jobs",async(req,res)=>{
    //  here we display all the set
     
     let all_jobs = await job_db.find();
      // here for finding the number of check 
     res.render("./Pages/admin/created_jobs.ejs",{all_jobs})
     
  })
// for the creating of the polling 
 adminRouter.get("/create_polls",(req,res)=>{
  //  here is the get for the polling creation fomr
  res.render("./Pages/admin/create_pollings.ejs");
    
})
  
//  router for  handling the post 
// thing for the creation of the polling
  
 let  golden_poll_schema = require("../Model/Polling");
const SIngle_Vote = require('../Model/SIngle_Vote');
const Application = require('../Model/Application');
 
adminRouter.post("/create_poll",async(req,res)=>{
  //  here is for the outcome
   let {pol_title,array_p,pol_date} = req.body
    // here is the thing which is going to be cheking the date passed
         let real_number = parseInt(pol_date)
    let now_poll = new golden_poll_schema({
          title  : pol_title,
          // real_number*24*60*60*1000
            Options  :array_p,
            will_end_At : new Date(Date.now()+(real_number*24*60*60*1000))
    })

   try{
      now_poll.save();
       res.redirect("/admin/all_current_poll")
        console.log(now_poll)
     }catch{
      res.status(400).send("could no save it")
     }
})
 
//  here is the router for seeing all the poll in there
 
 adminRouter.get("/all_current_poll",async(req,res)=>{
   
   
  let  current_polling = await golden_poll_schema.find();
    
    let modified_set = await Promise.all(current_polling.map(async element =>{
        return  {
           ...element,
           number_of_votors :  await SIngle_Vote.count({of_poll_kind : element})
       }
     
    })
    )
  res.render("./Pages/admin/Current_Polling.ejs",{all: modified_set});
 })
  
  
  // here is the router for handling the visual 
  //  represnetation of the resutlt of the polling
 
  adminRouter.get("/result_poll/now/output.css",(req,res)=>{
    res.sendFile("output.css",{root : "./public"})
  })
   
   adminRouter.get("/result_poll/now",async(req,res)=>{
  let poll_here = req.query.id_poll;
    let one_here_now = await golden_poll_schema.findOne({_id : poll_here})
   console.log(one_here_now);
// here going tobe getting the possible choose there
 let posi_chooses_there  = one_here_now.Options;
//  here we are going to creating array of objecter
  let done_cooling = await Promise.all( posi_chooses_there.map(async element =>{
   
    //  go there into the db 
    //   find there those with 
    //  coute them 
     let Number_of_Poeple_there = await SIngle_Vote.count({of_poll_kind : one_here_now,
      choose_Selected:element});
       return  Number_of_Poeple_there;
  })
  )
   
   console.log(posi_chooses_there);
  res.render("./Pages/admin/Polling_result.ejs",
   {option_there:posi_chooses_there, done_cooling,title : one_here_now.title})
  
  })
  //  here is the mega router for handling of the linalization of thing
     
  const sendMail = require("../util-staff/sendEmail")
  adminRouter.use("/C_N_F",express.static("public"))
   
  //   for the delteing function 
   let {delete_file} = require("../util-staff/delete_file")
   adminRouter.get("/C_N_F/:job_title",async(req,res)=>{
    //  here is for the action 
    let the_one_job = req.params.job_title;
     let of_kind =  await job_db.findOne({Job_title : the_one_job});
      
      //  getting all the apllicant there
       let aplied_applicant_there = await Application.find({Job_title : {$in : of_kind}})
        //  here we are going to be doing the grouping of thing 
 
   let those_with_accepted_there =[]; 
       those_with_accepted_there = aplied_applicant_there.filter(element =>{
                  //   those with checked
                      return element.status === "Accept";
                  })
// here we are going to be getting those without decline in them 
 let _those_without_the_accpet_thing_there = [];
    _those_without_the_accpet_thing_there = aplied_applicant_there.filter(element=>{
         return element.status !== 'Accept';
    })
     



    //   here is the sending of the email to those with Accepted
     let subject = 'Application _Result'
  
     those_with_accepted_there.forEach(element=>{
          let content = `Congratulation ${element.First_Name}_${element.Last_Name} have been accepted as ${the_one_job} and blah come and do the Job`
       
           try{
          //   sending the email
          // sendMail(content,subject,element.Email); 
           console.log(`email sent to _ ${element.Email}` )     
           }catch(err){
             console.log(err)
              res.status(400).send("could not send email")
           }
       

     }) 
    //  for those not accepted     
    
    _those_without_the_accpet_thing_there.forEach(element=>{
      let content = `Soory ${element.First_Name}_${element.Last_Name}
       have not been  granted the Job position ${the_one_job}
        and blah   do not  for  the Job`
   
       try{
      //   sending the email
      // sendMail(content,subject,element.Email); 
      console.log(`email sent to _ ${element.Email}` )     
     
       }catch(err){
         console.log(err)
          res.status(400).send("could not send email")
       }
   

 }) 

     
    //  getting only tthier names
     let _accepted_names = those_with_accepted_there.map(element=>{
       return  `${element.First_Name}-${element.Last_Name}`
     })

     let NOT_accepted_names = _those_without_the_accpet_thing_there.map(element=>{
      return  `${element.First_Name}-${element.Last_Name}`
    })

    //  here is the thign we cold be doing 
    //  before the thing are eben sent to the other side we are going to be
    //  deleting the thing here 
     
    //  here am going to be picking the files and 
    // then delteing themone by one
     
    aplied_applicant_there.forEach(element=>{
      delete_file("./public/Application/Teacher",element.Filename)
     })
     
      
     try {
      
     //  for each of the apllicant
       await Application.deleteMany({Job_title : {$in : of_kind}})
       //  for the job_db
        await job_db.deleteOne({Job_title : the_one_job});
console.log("all deleting done")        
     } catch (error) {
      console.lo(error)
     }


     
                   res.render("./Pages/admin/Finalization_Page.ejs",
                   {NOT_accepted_names,_accepted_names});
                })
  
 module.exports = adminRouter