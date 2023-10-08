const mongoose = require('mongoose');




const bookInfoSchema = new mongoose.Schema({
  name : {type : String, required: true},
  phoneNumber : {type:String,required: true},
  status : {type:String,required: true},
  content : {type:String},
  boxNumber:{type:Number,required:true}
},{timestamps:true},{collection:'bookInfo'});



module.exports= mongoose.model('bookinfos',bookInfoSchema);
