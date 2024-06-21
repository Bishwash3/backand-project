const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/DataAssociation");

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true,

  },
  fullname: String,
  email: String,

  password:{ 
  type:  String
  },

  Posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
  }],
  dp: {
   type: String, //assuming pp is stored in url or file path
},
})
userSchema.plugin(plm);
module.exports = mongoose.model('user',userSchema);

