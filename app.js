const express = require('express');
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const rateLimit = require('express-rate-limit');
const slowDown = require("express-slow-down");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
require("dotenv").config();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛡️ Security Middleware
app.use(mongoSanitize()); // NoSQL injection protection
app.use(xss());           // XSS protection

// Static files and view engine
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

// Cookie Parser
app.use(cookieParser());

// 🚫 Rate Limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50,                  // limit each IP to 50 requests per windowMs
  message: "Too many requests, please try again later."
});
app.use(limiter);

// 🐢 Slow Down After Excessive Requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  delayAfter: 20,           // Allow 20 requests per IP before slowing down
  delayMs: () => 500        // Add 500ms delay to each request after that
});
app.use(speedLimiter);

// 🔐 Session and Flash
app.use(session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
});

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
