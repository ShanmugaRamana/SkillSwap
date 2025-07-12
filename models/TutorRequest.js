const mongoose = require("mongoose");

const TutorRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: String,
  location: String,
  skillsOffered: [String],
  availability: String,
  certificationFile: {
    type: String, // ✅ THIS is correct
    required: true
  },
  status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
},
  rejectionReason: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("TutorRequest", TutorRequestSchema);
