


const mongoose = require("mongoose");

const Room_Name_shcema =  new mongoose.Schema({
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      // here each user id having Room
      
      User_Room : { 
         type  : mongoose.SchemaTypes.ObjectId,
         required : true,
          ref :  "UserIdentity"
      },

       Some_New : { 
         type :Boolean,
         required : false,
          default : false
       },
        Read : { 
            type : String,
            default : "No"
        }
        
      })
//  here we seek to hash the password



module.exports = mongoose.model("Room_Name",Room_Name_shcema);
