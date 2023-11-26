const express = require('express');
const Useridentity = require('../Model/Useridentity');
 const bcrypt = require("bcryptjs")
 
 const requireAuth = require("../util-staff/userAuthen"); 
const Specific_Chat = require('../Model/Specific_Chat');
const Room = require('../Model/Room');
const { encrypt_chat, decrypt_chat } = require('../util-staff/chat_encode_decoder');

const Chat_Router = express.Router();
 Chat_Router.use(express.static("public"))

  // let en = encrypt_chat("hope")
  //  console.log(en)
  //  console.log(de)

 
 Chat_Router.get("/room",requireAuth,async(req,res)=>{
//  base on the userid sen
  let user = await Useridentity.findOne({_id : req.auth_id})
  
  //   the room user is associated with
   let room_user = await Room.findOne({User_Room : user.id});

// finding all the chat associated with that rromm
  let _room_chats = await
   Specific_Chat.find({Room_ID  :{$in  : room_user}})
    // here is the case here each of the chat there are been hash
     


 _room_chats = _room_chats.map(element =>{
  // once upon a time for one 
   let decrypted_chat  = decrypt_chat(element.Chat_Real_Staff);
    return {...element,Chat_Real_Content: decrypted_chat}
   })
// console.log(_room_chats[0].currentUser_id)

     res.render("./Pages/Chat/user.ejs",{user,_room_chats});    
 })
  
  Chat_Router.get("/room/output.css",(req,res)=>{
    res.sendFile("output.css",{root : "./public"})
  })


 

  Chat_Router.get("/room/socket.io-client.js",(req,res)=>{
    res.sendFile("socket.io-client.js",{root : "./public"})
  })

   
  // sorry but the polling sytetm need to come here
   //  here is available poll
//   bd for the pooll 
 let polling_db = require("../Model/Polling");
 Chat_Router.get("/available_poll",requireAuth,async(req,res)=>{
      //  showing all the polling in a n
       let avai_pol = await polling_db.find();
        let user_now_here = await Useridentity.findOne({_id : req.auth_id});
        //  here we are going to be attaching the once which the 
        // user has already filled ther
       
          // here we are going to be cheking the thing
          //   to be seeing which of the the them is the use there
           
          let new_set_of_them  =  await Promise.all(avai_pol.map( async element =>{
            let he_voted=null;
            //   chionf to find if there si a thing there for the user 
              if(element.voted_users.includes(user_now_here.id)){
                // find the person there
              let one_her = await vote_instance.findOne({of_poll_kind : element.id,currentUser:user_now_here })
                  he_voted   =one_her.choose_Selected;
             }
               return  {
                  ...element,
                 he_voted :  he_voted
               }
           }) 
          )
      
          console.log(new_set_of_them);
           res.render("./Pages/Chat/user_polling_now.ejs",{new_set_of_them,user: user_now_here});    
 })
 
  

 let vote_instance  = require("../Model/SIngle_Vote");
Chat_Router.post("/pollings_result",requireAuth,async(req,res)=>{


 //  getting the id value of the othere person 
  let poll_id =  req.body.selection_polling.split("_")[1]
  let poll_choose=  req.body.selection_polling.split("_")[0]

   
let now_poll = await polling_db.findOne({_id : poll_id});
 
//  here we are going to be preving the infor about the number of user who voted ther
  let Number_voted = now_poll.voted_users.length;
 
 
//  in there in the array of voted user we are going to put it ther
//   checking if the user is in the arrow of voted
// await vote_instance.deleteMany()
//   here is a check for finding the people in the db with the thing 
//   of the  current polling 
 


let user_here  = await Useridentity.findOne({_id : req.auth_id});

 try{ 
  //  checking if the user has already voted
 if(now_poll.voted_users.includes(user_here.id)){
  //   then we are just going to be finding that voted and theen updating
  //  the value there in the system 
let done_here_now = await vote_instance.findOne({currentUser  : user_here,
 of_poll_kind : now_poll});
 done_here_now.choose_Selected = poll_choose;
  await done_here_now.save();

  //  here we are going to be
  res.render("./Pages/Chat/done_voting.ejs",{Number_voted})
   
 
}
 else{
  //   then if this is a new instace of the vote
  let now_vote_here  = new vote_instance({
    of_poll_kind  : now_poll,
    currentUser  : user_here,
    choose_Selected : poll_choose
})
 //  saving it 
  await now_vote_here.save();
   console.log(now_vote_here);
   now_poll.voted_users.push(user_here.id)
    await now_poll.save();
    res.render("./Pages/Chat/done_voting.ejs",{Number_voted})
  }

   
 }catch(err){
console.log(err)
 }


       
 })

  module.exports = Chat_Router;