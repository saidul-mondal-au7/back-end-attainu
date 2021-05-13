const mongoose = require("mongoose");
const validator = require('validator')

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {
    type: String, 
    validate(value){
      if(value.length>=255){
          throw new Error('descriptions must be less than 255 char!')
      }
   },
    required: true,}
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;
