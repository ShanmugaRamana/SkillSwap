const express = require("express");
const router = express.Router();
const { ensureAdmin } = require("../middleware/auth");
const TutorRequest = require("../models/TutorRequest");
const Tutor = require("../models/Tutor");

// GET: List all tutor requests
router.get("/tutor-requests", async (req, res) => {
  try {
    const requests = await TutorRequest.find({}).populate("user");
    res.render("admin-tutor-requests", { requests });
  } catch (err) {
    console.error("Error fetching tutor requests:", err);
    res.status(500).send("Server error");
  }
});

// POST: Approve a tutor
router.post("/approve-tutor/:id", async (req, res) => {
  try {
    const request = await TutorRequest.findById(req.params.id);
    if (!request) return res.status(404).send("Request not found");

    await Tutor.create({
      user: request.user,
      name: request.name,
      location: request.location,
      skillsOffered: request.skillsOffered,
      availability: request.availability,
      certificationFile: request.certificationFile,
    });

    await TutorRequest.findByIdAndDelete(req.params.id); // Optional: delete request after approval
    res.redirect("/admin/tutor-requests");
  } catch (err) {
    console.error("Error approving tutor:", err);
    res.status(500).send("Server error");
  }
        request.status = "approved";
    res.redirect("/admin/tutor-requests");

});

// POST: Reject a tutor with reason
router.post("/reject-tutor/:id", async (req, res) => {
  try {
    const { reason } = req.body;
    await TutorRequest.findByIdAndUpdate(req.params.id, {
      status: "rejected",
      rejectionReason: reason,
    });
    res.redirect("/admin/tutor-requests");
  } catch (err) {
    console.error("Error rejecting tutor:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
