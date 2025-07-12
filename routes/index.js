const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const TutorRequest = require("../models/TutorRequest");
const Tutor = require("../models/Tutor");
const { ensureAuth } = require("../middleware/auth");

// Homepage
router.get("/", (req, res) => res.sendFile("index.html", { root: "views" }));

router.get("/login", (req, res) => res.render("login", { error: null }));
router.get("/signup", (req, res) => res.render("signup", { error: null }));

router.get("/create-password", ensureAuth, (req, res) => {
  if (req.user.password) return res.redirect("/dashboard");
  res.render("create-password");
});

router.post("/create-password", ensureAuth, async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.findByIdAndUpdate(req.user.id, { password: hashed });
  res.redirect("/dashboard");
});

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const tutorRequest = await TutorRequest.findOne({ user: req.user._id });
    const isTutorApproved = tutorRequest && tutorRequest.status === "approved";

    // 🔍 Fetch all tutors
    let tutors = await Tutor.find().populate("user");

    // 🔍 Exclude self if the user is a tutor
    tutors = tutors.filter(t => !t.user._id.equals(req.user._id));

    // 🔍 Apply search
    const search = req.query.search;
    if (search) {
      tutors = tutors.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.skillsOffered.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🔃 Sort by availability
    const sort = req.query.sort;
    if (sort === "asc") {
      tutors.sort((a, b) => a.availability.localeCompare(b.availability));
    } else if (sort === "desc") {
      tutors.sort((a, b) => b.availability.localeCompare(a.availability));
    }

    res.render("dashboard", {
      user: req.user,
      tutorRequest,
      isTutorApproved,
      tutors
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).send("Something went wrong");
  }
});

router.get("/edit-name", ensureAuth, (req, res) => {
  res.render("edit-name", { user: req.user });
});

router.post("/edit-name", ensureAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { name: req.body.name });
  res.redirect("/dashboard");
});

router.get("/edit-password", ensureAuth, (req, res) => {
  if (!req.user.password) return res.redirect("/dashboard");
  res.render("edit-password", { user: req.user, error: null });
});

router.post("/edit-password", ensureAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.render("edit-password", { user: req.user, error: "Incorrect old password" });
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
  res.redirect("/dashboard");
});

router.get("/terms", (req, res) => res.render("terms"));

// Admin login
router.get("/admin-login", (req, res) => {
  res.send(`
    <h2>Admin Login</h2>
    <form action="/admin-login" method="POST">
      <input name="email" placeholder="Admin Email" required><br>
      <input name="password" type="password" placeholder="Password" required><br>
      <button type="submit">Login</button>
    </form>
    <br><a href="/">← Back to Home</a>
  `);
});

router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@skillswap.com" && password === "admin123") {
    const users = await User.find();
    return res.render("admin", { users });
  } else {
    return res.send("<p>Invalid admin credentials</p><a href='/admin-login'>Back</a>");
  }
});

module.exports = router;
