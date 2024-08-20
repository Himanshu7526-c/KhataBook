const mongoose = require("mongoose");

const hisaabSchema = mongoose.Schema({
  title: {
    type:String,
    required:[true,"title is required"],
    trim:true,
  },
  description:{
    type:String,
    required:[true,"description is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  encrypted:{
    type: Boolean,
    default:false,
  },
  shareable: {
    type:Boolean,
    default:false,
  },
  passcode: {
    type: String,
  },         
  editpermissions: {
    type:Boolean,
    default:true
  }

}, { 
  timestamps: true
 });

module.exports = mongoose.model("hisaab", hisaabSchema);
