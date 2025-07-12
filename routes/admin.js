const express = require("express");
const router = express.Router();
const TutorRequest = require("../models/TutorRequest");
const Tutor = require("../models/Tutor");
const User = require("../models/User");

// Middleware for admin protection


// View tutor requests
router.get("/tutor-requests", async (req, res) => {
  const requests = await TutorRequest.find({}).populate("user");
  res.render("admin-tutor-requests", { requests });
});

// Approve tutor request
router.post("/approve-tutor/:id", async (req, res) => {
  const request = await TutorRequest.findById(req.params.id);
  if (!request) return res.send("Not found");

  await Tutor.create({
    user: request.user,
    name: request.name,
    location: request.location,
    skillsOffered: request.skillsOffered,
    availability: request.availability,
    certificationFile: request.certificationFile,
  });

  request.status = "approved";
  await request.save();
  res.redirect("/admin/tutor-requests");
});

// Reject tutor request
router.post("/reject-tutor/:id", async (req, res) => {
  const { reason } = req.body;
  await TutorRequest.findByIdAndUpdate(req.params.id, {
    status: "rejected",
    rejectionReason: reason,
  });

  res.redirect("/admin/tutor-requests");
});

module.exports = router;
