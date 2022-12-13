const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;


const PostSchema =  new Schema({
  title : {type: String, require:true},
  body : {type: String},
  image :{type: String},
  user : {type : String, ref:"users"}
});

const Posts = mongoose.model('blogs', PostSchema);

module.exports = Posts;
