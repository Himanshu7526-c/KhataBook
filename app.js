const express = require('express');
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
require("dotenv").config();

// DB Connection
const dbConnect = require("./config/mongoose-connection");
dbConnect();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Middleware
app.use(mongoSanitize());
app.use(xss());

// Static and view engine
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

// Cookie Parser
app.use(cookieParser());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
  
  }
}));

// Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
});

// Rate Limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later."
});
app.use(limiter);

// Routers
const indexRouter = require('./routes/indexRouter');
const hisaabRouter = require('./routes/hisaabRouter');

app.use("/", indexRouter);
app.use("/hisaab", hisaabRouter);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
