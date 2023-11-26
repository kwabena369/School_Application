const express = require('express');
const ejslayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app =  express();
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
// Set view engine and layouts
app.set('view engine', 'ejs');
app.set("views" , __dirname + "/views");
app.set("layout","layouts/layout");
app.use(ejslayout);
app.use(express.static("public"))
 const fs = require("fs")

//  implementing the socket thing 
const http = require("http");
const { Server } = require("socket.io");

//  for the chat 
 const chat_DB  = require("./Model/Specific_Chat");
  



//  for constant master
 const master  = "M_ROOM"


const server = http.createServer(app);
const io = new Server(server);

// Add event handlers for socket connections
io.on("connection", (socket) => {
  console.log("New client connected");
 

   
  socket.on("start_chat",(data)=>{
    socket.join(data); 
     console.log(data)
  })


// -------- for a chat ----------------
  socket.on("single_chat",async(data)=>{
     socket.to(data.roomID).emit("chat_from_above",data)

      let room_Now = await Room.findOne({User_Room : data.roomID })
      
       if(room_Now){
        // then we are a setting the something new to ther
    let done  = new chat_DB({
       Chat_Real_Staff  : data.content,
        Room_ID : room_Now._id,
        currentUser_id  : data.from
    })

     try{
      room_Now.Some_New = true
      // then we set that the admin has not read the thing
       room_Now.Read = "No";
          room_Now.save();
      await done.save(); 
     
       console.log("it saved in the db")
     } catch(err){
  console.log(err)
     }  
       
    }

     
  })


//  here is for ending to other people




  // Event handler for disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });


});



  
  // Router for the authen 
   const GoogleAuth = require("./Routers/AuthenGoogle");
    app.use("/auth",GoogleAuth);
 


  const filedirectory  = "public/userProfile/";

  
    

   

    
  
 


// All routers  and setting thier use thing
const UserRouter = require("./Routers/User");
const UserIdentity = require("./Model/Useridentity");
app.use("/user",UserRouter);
//  for the store Routerr
  const SchStore = require("./Routers/Sch-Store");




//  for the teacher application 
 const Teacher = require("./Routers/Application");
  app.use("/apply/",Teacher);
 
  //  for the admin Router
   const admin = require("./Routers/admin");
    app.use("/admin",admin);


  //  for the prototype
const multer = require('multer');
const path = require('path');
const { render } = require('ejs');
const Useridentity = require('./Model/Useridentity');
const Chat_Router = require('./Routers/User_Chats');
const Room = require('./Model/Room');




app.use("/user_chat/",Chat_Router);
// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(
"mongodb+srv://boampongbismarck079:iU6yebL9V5J4VoUv@cluster0.vi6onxf.mongodb.net/?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true });
const donedb  = mongoose.connection.useDb("Texasdb")
// here we watching any chnage in the db witht the polling

   

donedb.on("error",()=>{
  console.log("Could not Connect")
});

donedb.on("open",()=>{
  console.log("Database Connected ")
});



//  creating the middleware
 function requireAuth(req,res,next){
  const jwt = require("jsonwebtoken");

   
  const userToken  = req.cookies.UserToken;
    // const Applicant_ID = req.cookies.Applicant_ID;
   
    
    if(!userToken){
      // here is for the case where there is 
      // there which is showing that the 
      // use there is in the system

       if(req.url ==="/apply/"){
         next();
       }else{
        res.render('StartingP.ejs', {user:null});
        return;
       }
      
    }else{
try{
          let Goldenlock = jwt.verify(userToken,"pickthecup");
  // here is for the use who is really there is the system 
  console.log(Goldenlock._id)
            req.auth_id = Goldenlock._id
            next()

           }catch (err) {
                  res.redirect('/user/logIn');
                // next()
           }
    }
         
    


    }
   
 



    

    module.exports = requireAuth;


   const storageProfile = new multer.diskStorage({
     destination : (req,file,cb)=>{
       cb(null,path.join(__dirname,"public/userProfile"))
     },
      filename  : (req,file,cb)=>{
        let filename  = req.params.userid+"."+file.mimetype.split("/")[1];
        fs.readdir(`${filedirectory}`,(err,files)=>{
            if(err)throw err
//  so where is the main idea here the 1 Pater 4 : 16  which is say that christain should be

//  and the other once for the old testiment to be use is that it is in the part 
//  of the roman call the roman 15 :4 for h those thing there were for example there
             
                
              if(files.length !== 0){  
  
                files.forEach((file)=>{
                  //  console.log("file")
                  //  console.log(file);
                     if(file.startsWith(`${req.params.userid}`)){
                           fs.unlinkSync(`${filedirectory}${file}`,(err)=>{
                               if(err)throw err
                                 console.log("it was deleted");
                               
                           })
                      cb(null,filename)
                     }else{
                      cb(null,filename)
                     }
                })
   
             }else{
              cb(null,filename)
             }
           
         }
        
        )


       
      }
   })

    const uploaded  = multer({storage : storageProfile});
 
 
    app.post("/userProfile/:userid",
    uploaded.single("user-Profile"),
    async(req,res)=>{
//  here the url of the person is been going to be display in the app
 const useridNow  = req.params.userid;
   const userHere   = await UserIdentity.findOne({_id : useridNow});
      userHere.userProfile = req.file.filename
       userHere.save();
    res.send(" the profile changed")

 })
//  here should be the first stage where the person login
app.get('/',requireAuth,async(req,res) => {
const user = await UserIdentity.findOne({_id : req.auth_id});
 if(user){
  res.render('StartingP.ejs', {user});
 }else{
   res.redirect("/user/logIn")
 }
})
app.get('/MTN',(req,res) => {
  res.render('MTN.ejs');
   console.log("MTN spoke to me ")
  })


  //  here is an optional part for theb testing of the graph functionality
   app.get("/graph_now",(req,res)=>{
    //  for the page
     res.render("./Graph_plot/Polling_result.ejs")
   })



// for the profile 
 app.get("userprofile/:userid",requireAuth,async(req,res)=>{
         let realuser =  await UserIdentity.findOne({_id : req.params.userid.split(".")[0]})
           
          if(realuser){
            res.sendFile(req.params.userid, { root: 'public/userProfile' });
          }
          
 })
//  for the store
 app.use("/sch-store",SchStore);

  
  

//  Chating the sch
 
 app.get("/chat/sch",requireAuth,async(req,res)=>{
  //  redirection to the real page 
// if there is no  room for the user create one 
  let check_room = await Room.findOne({User_Room : req.auth_id})
   if(check_room){ 
    res.redirect(`/user_chat/room`);
   }else{
    //  we are cresting one for the user
     let Now_user_Room = new Room({
       User_Room  : req.auth_id
     })
      
     try{
      //  save the room
       Now_user_Room.save()
       res.redirect(`/user_chat/room`);
     }catch{
        res.status(400).send("there is alot of bad thing")
     }
   }
 
  
 }) 


  
server.listen(3000, () => {
  console.log("Working in the back bro")
})
