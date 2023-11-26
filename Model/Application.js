
const mongoose = require("mongoose");
 const bcrypt = require("bcryptjs")

const Appplicant =  new mongoose.Schema({
       First_Name:{
        type: String,
        required: false,
        trim: true,
      },
      Last_Name:{
        type: String,
        required: false,
        trim: true,
      },
      Email: {
        type: String,
        required: true,
        trim: true,
      },
      checked : { 
         type : String,
          default : "Not Checked"
      },
      status :{
         type : String,
          default : "Pending"
      }
       ,
      Password: {
        type: String,
        required: false,
        // minlength: 8,
        trim: true,
      },
       Filename:{ 
         type :String,
          required  :true,
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
         },
         userProfile:{
          type :String,
          default:""
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
      , 
      StageName: {
        type: String,
        trim: true,
        default : this.First_Name
      },
      //  here is a section for the info on the job time
       Job_title : {
        type : mongoose.SchemaTypes.ObjectId,
         ref : "Create_Jobs"
       }
       
})


//  here we seek to hash the password

Appplicant.pre('save', async function (next) {
    const user = this;
    if (user.isModified('Password')) {
      user.Password = await bcrypt.hash(user.Password, 4);
    }
    next();
  });

module.exports = mongoose.model("Applicant",Appplicant);
