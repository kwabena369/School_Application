
const mongoose = require("mongoose");
 const bcrypt = require("bcryptjs")

const adminSchema  =  new mongoose.Schema({
      Email: {
        type: String,
        required: true,
        trim: true,
      },
      userProfile:{
        type :String,
        default:""
      },
      Password: {
        type: String,
        required: false,
        // minlength: 8,
        trim: true,
      },
      
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }
})
//  here we seek to hash the password

adminSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('Password')) {
      user.Password = await bcrypt.hash(user.Password, 4);
    }
    next();
  });

module.exports = mongoose.model("adminIdentity",adminSchema);
