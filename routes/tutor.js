const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const TutorRequest = require("../models/TutorRequest");
const Tutor = require("../models/Tutor");
const { ensureAuth } = require("../middleware/auth");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  file.mimetype === "application/pdf" ? cb(null, true) : cb(new Error("Only PDFs allowed"));
}});

// Tutor apply form
router.get("/apply", ensureAuth, (req, res) => {
  res.render("tutor-form");
});

// Submit tutor request
router.post("/apply", ensureAuth, upload.single("certificationFile"), async (req, res) => {
  const { name, location, skillsOffered, availability } = req.body;

  await TutorRequest.findOneAndUpdate(
    { user: req.user._id },
    {
      user: req.user._id,
      name,
      location,
      skillsOffered: skillsOffered.split(",").map(skill => skill.trim()),
      availability,
      certificationFile: req.file.filename,
      status: "pending",
      rejectionReason: null,
    },
    { upsert: true }
  );

  res.send("Successfully submitted. Please wait for approval from SkillSwap.");
});

// Rejection view
router.get("/rejected", ensureAuth, async (req, res) => {
  const request = await TutorRequest.findOne({ user: req.user._id });
  if (!request || request.status !== "rejected") return res.redirect("/dashboard");

  res.send(`<h2>Rejected</h2><p>Reason: ${request.rejectionReason}</p><br><a href="/tutor/apply">Reapply</a>`);
});

module.exports = router;
