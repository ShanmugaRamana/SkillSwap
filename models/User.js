const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  googleId: String,
  photo: String,
});
module.exports = mongoose.model("User", UserSchema);