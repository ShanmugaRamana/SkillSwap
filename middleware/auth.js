function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function ensureAdmin(req, res, next) {
  // Assuming you use hardcoded email or a role system
  if (req.isAuthenticated() && req.user.email === "admin@skillswap.com") {
    return next();
  }
  res.redirect("/login");
}

module.exports = { ensureAuth, ensureAdmin };
