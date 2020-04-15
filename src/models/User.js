const mongoose = require('../libs/database')
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  name: String,
  isAdmin: Boolean
});

module.exports = mongoose.model('User', UserSchema);