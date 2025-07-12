const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");


// Signup with error handling
router.post("/signup", async (req, res) => {
  
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.render("signup", { error: "Email already registered." });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hash });
  await user.save();
  res.redirect("/login");
});

// Login with wrong password feedback
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.render("login", { error: "No user found." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.render("login", { error: "Incorrect password." });

  req.login(user, err => {
    if (err) return next(err);
    return res.redirect("/dashboard");
  });
});
// Google OAuth route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/login",
}), (req, res) => {
  res.redirect("/dashboard");
});

router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

module.exports = router;
