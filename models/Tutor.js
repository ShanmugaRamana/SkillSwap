const mongoose = require("mongoose");
const TutorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  location: String,
  skillsOffered: [String],
  availability: String,
  certificationFile: String,
  status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
},
  approvedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Tutor", TutorSchema);
