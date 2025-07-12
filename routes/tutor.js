const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const TutorRequest = require("../models/TutorRequest");
const { ensureAuth } = require("../middleware/auth");

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  }
});

// Tutor Apply Form
router.get("/apply", ensureAuth, async (req, res) => {
  const existing = await TutorRequest.findOne({ user: req.user._id });
  if (existing && existing.status === "approved") return res.redirect("/dashboard");
  res.render("tutor-apply", { user: req.user, error: null });
});

// Handle Tutor Request Submission
router.post("/apply", ensureAuth, upload.single("certificationFile"), async (req, res) => {
  try {
    const { name, location, skillsOffered, availability } = req.body;

    const existing = await TutorRequest.findOne({ user: req.user._id });
    if (existing) await TutorRequest.findByIdAndDelete(existing._id); // Replace old if re-applying

    await TutorRequest.create({
      user: req.user._id,
      name,
      location,
      skillsOffered,
      availability,
      certificationFile: `/uploads/${req.file.filename}`,
      status: "pending"
    });

    res.send("Successfully submitted. Wait for approval from SkillSwap.");
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).send("Error submitting tutor request");
  }
});

module.exports = router;
