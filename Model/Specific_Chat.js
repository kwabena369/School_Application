


const mongoose = require("mongoose");
 const bcrypt = require("bcryptjs");
const { encrypt_chat } = require("../util-staff/chat_encode_decoder");

const Chat_Content =  new mongoose.Schema({
        Chat_Real_Staff:{ 
         type :String,
          required  :true,
         default:""
       },
        Room_ID: {
           type : mongoose.SchemaTypes.ObjectId,
           required : true,
            ref : "Room_Name"
        },
         currentUser_id :{
             type : String,
         }
         ,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }

})
//  here we seek to hash the password

Chat_Content.pre('save', async function (next) {
    const user = this;
    if (user.isModified('Chat_Real_Staff')) {
      user.Chat_Real_Staff = await encrypt_chat(user.Chat_Real_Staff);
    }
    next();
  });

module.exports = mongoose.model("Chat_Content",Chat_Content);
