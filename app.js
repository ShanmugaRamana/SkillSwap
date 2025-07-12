require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const connectDB = require("./config/db");
const app = express();

// DB connection
connectDB();

// View engine
app.set("view engine", "ejs");

// Static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("public"));

// Body parser
app.use(express.urlencoded({ extended: false }));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/tutor", require("./routes/tutor"));
app.use("/admin", require("./routes/admin"));
app.use("/", require("./routes/index"));

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
