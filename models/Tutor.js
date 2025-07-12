const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  location: String,
  skillsOffered: String,
  availability: String,
  certificationFile: String,
});

module.exports = mongoose.model("Tutor", tutorSchema);
