const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema =  new Schema({
  name:{type:String},
  email:{type:String, unique:true},
  password:{type:String}
});

const Users = mongoose.model('users', UserSchema);
// console.log(Users)
module.exports = Users;
