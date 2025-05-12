const express = require('express');
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session"); // ✅ ADD THIS
const flash = require("connect-flash");

require("dotenv").config();

// ✅ MIDDLEWARE ORDER MATTERS

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files and view engine
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

// Cookies
app.use(cookieParser());

// ✅ SESSION SETUP (must be before flash)
app.use(session({
  secret: process.env.SESSION_SECRET, // use a strong key in production
  resave: false,
  saveUninitialized: false
}));

// ✅ FLASH SETUP (after session)
app.use(flash());

// ✅ OPTIONAL: make flash messages available to templates
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   next();
// });

// Routers
const indexRouter = require('./routes/indexRouter');
const hisaabRouter = require("./routes/hisaabRouter.js");

const dbConnect = require("./config/mongoose-connection");
dbConnect();

app.use("/", indexRouter);
app.use("/hisaab", hisaabRouter);

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});
