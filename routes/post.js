const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  imageText: {
   type: String,
   required: true,
},
image: {
  type: String,
},
  createdAt:{
    type: Date,
    default: Date.now,
  },
  likes: {
    type:Array,
    default: [],
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
  },

})
module.exports = mongoose.model('post',postSchema);

