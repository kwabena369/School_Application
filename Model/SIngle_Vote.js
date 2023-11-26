const  mongoose = require("mongoose");
 
//  for real deal 
 let vote_schema = new mongoose.Schema({
     of_poll_kind  : {
          type : mongoose.SchemaTypes.ObjectId,
           ref : "poll_schema"
     },
      currentUser:{
          type : mongoose.SchemaTypes.ObjectId,
          ref :"UserIdentity"
         },
      choose_Selected : {
         type :String,  
          required : true,
          trim : true
      }
       
 })
  
//  making it available
  module.exports =  mongoose.model("vote_schema",vote_schema);