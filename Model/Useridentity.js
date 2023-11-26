
const mongoose = require("mongoose");
 const bcrypt = require("bcryptjs")

const UserSchema  =  new mongoose.Schema({
    StageName: {
        type: String,
        required: true,
        trim: true,
      },
      Email: {
        type: String,
        required: true,
        trim: true,
      },
      Password: {
        type: String,
        required: false,
        // minlength: 8,
        trim: true,
      },
       userProfile:{
         type :String,
         default:""
       },
        verificationToken:{
            type : Number,
            required :false,
              default:""
        },
         verifiedUser : {
              type:Boolean,
               default : false
         }
         
        ,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }

      //   user's using the google authe thing 
       ,
       GoogleUserID : { 
         type : String,
          required : false
       }
})
//  here we seek to hash the password

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('Password')) {
      user.Password = await bcrypt.hash(user.Password, 4);
    }
    next();
  });

module.exports = mongoose.model("UserIdentity",UserSchema);
