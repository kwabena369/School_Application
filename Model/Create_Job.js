


const mongoose = require("mongoose");

const Create_Jobs =  new mongoose.Schema({
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    //    for the title
      Job_title:{
          type : String,
          required :true
      },
    //    for the number of applicant what
    Number_Applicant:{
         type : Number,
           required : true
    }, 
    //  here is the numebr of checked
     Number_Check:{
       
     },
    //  here is the array of the checked
     _Array_checked:
     [{type : mongoose.SchemaTypes.ObjectId,
         ref :"Applicant"
}]
     
     ,
    //   for the so far applied
     So_far_applied : {
       type :Number,
        default : 0
     }
       
      })
//  here we seek to hash the password



module.exports = mongoose.model("Create_Jobs",Create_Jobs);
