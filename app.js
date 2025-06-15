const express = require('express');
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session"); // ✅ Added
const flash = require("connect-flash");
const rateLimit = require('express-rate-limit');

const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
require("dotenv").config();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛡️ Security Middleware
app.use(mongoSanitize());
app.use(xss());

// Static files and view engine
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

// Cookie Parser
app.use(cookieParser());

// 🔐 Session middleware (✅ MUST be before flash)
app.use(session({
  secret: process.env.SESSION_SECRET, // Replace with a secure key in production
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 10 * 60 * 1000 // 10 minutes
  }
}));

// 💬 Flash middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
});

// 🚫 Rate Limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: "Too many requests, please try again later."
});
app.use(limiter);

// 🐢 Slow Down After Excessive Requests


// 🔌 DB Connection
const dbConnect = require("./config/mongoose-connection");
dbConnect();

// 🛣️ Routers
const indexRouter = require('./routes/indexRouter');
const hisaabRouter = require('./routes/hisaabRouter');

app.use("/", indexRouter);
app.use("/hisaab", hisaabRouter);

// 🚀 Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
