const mongoose = require('mongoose');




const boxsSchema = new mongoose.Schema({
  number : {type : Number, required: true},
  status : {type:String, required: true},
  pw : {type:Number, required: true}
},{collection:'boxs'});



module.exports= mongoose.model('boxs',boxsSchema);
