const mongoose = require("mongoose");
const SIngle_Vote = require("./SIngle_Vote");

let poll_schema = new mongoose.Schema({
  title: {
    type: String
  },
  will_end_At: {
    type: Date,
   required : true
   },
  Options: {
    type: Array,
    required: true,
    trim: true
  },
  voted_users: [{ type: mongoose.SchemaTypes.ObjectId, ref: "UserIdentity" }]
});

module.exports = mongoose.model("Poll_Kind", poll_schema);
