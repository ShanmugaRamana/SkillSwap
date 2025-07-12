const mongoose = require("mongoose");

const tutorRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  location: String,
  skillsOffered: String,
  availability: String,
  certificationFile: String, // PDF file path
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: String,
});

module.exports = mongoose.model("TutorRequest", tutorRequestSchema);
