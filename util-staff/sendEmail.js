const nodemailer = require("nodemailer")
   
//  Transporter 
 

     
function sendEmail(content,subject,to){
 
 
const Transportor = nodemailer.createTransport({
    service: 'gmail',
       host: 'smtp.gmail.com',
       port: 465,
           secure :true,
           auth:{
              user :"boampongbismarck079@gmail.com",
              pass : "zchjoleucidsxlns"
             }
})


const mailOption = {
    from : "bpampongbismarck079@gmail.com",
    to : to,
     subject: subject,
    html  : content
}


Transportor.sendMail(mailOption,(err,done)=>{
    if(err){
          console.log("Email not send")
         return "email not sent"

    }else{
         console.log("email sent")
         return "email sent"
    }
 })

}

 module.exports = { 
     sendMail  : sendEmail
 }