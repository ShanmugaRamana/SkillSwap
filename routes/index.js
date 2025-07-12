const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const TutorRequest = require("../models/TutorRequest");
const Tutor = require("../models/Tutor");

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// Homepage
router.get("/", (req, res) => res.sendFile("index.html", { root: "views" }));

router.get("/login", (req, res) => res.render("login", { error: null }));
router.get("/signup", (req, res) => res.render("signup", { error: null }));

// Admin login page (GET form)
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
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const tutorRequest = await TutorRequest.findOne({ user: req.user._id });
    const isTutorApproved = tutorRequest && tutorRequest.status === "approved";

    return res.render("dashboard", {
      user: req.user,
      tutorRequest,
      isTutorApproved,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    return res.status(500).send("Something went wrong");
  }
});
// Admin login (POST)
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin email/password
  const adminEmail = "admin@skillswap.com";
  const adminPassword = "admin123"; // you can hash this for security

  if (email === adminEmail && password === adminPassword) {
    const users = await User.find();
    return res.render("admin", { users });
  } else {
    return res.send("<p>Invalid admin credentials</p><a href='/admin-login'>Back</a>");
  }
});

router.get("/create-password", ensureAuth, (req, res) => {
  if (req.user.password) return res.redirect("/dashboard");
  res.render("create-password");
});

router.post("/create-password", ensureAuth, async (req, res) => {
  const { password } = req.body;

  if (!password) return res.redirect("/create-password");

  const hashed = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(req.user.id, { password: hashed });

  res.redirect("/dashboard");
});





router.get("/edit-name", ensureAuth, (req, res) => {
  res.render("edit-name", { user: req.user });
});

router.post("/edit-name", ensureAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { name: req.body.name });
  res.redirect("/dashboard");
});

// Change Password
router.get("/edit-password", ensureAuth, (req, res) => {
  if (!req.user.password) return res.redirect("/dashboard"); // Prevent access if password doesn't exist
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

// Terms page
router.get("/terms", (req, res) => {
  res.render("terms");
});
module.exports = router;
