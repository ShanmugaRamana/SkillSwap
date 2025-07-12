require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");

const app = express();
connectDB();

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(session({
  secret: process.env.SESSION_SECRET || "somefallbacksecret",
  resave: false,
  saveUninitialized: false,
}));

require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/tutor", require("./routes/tutor"));
app.use("/admin", require("./routes/admin"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
