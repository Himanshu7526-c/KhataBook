const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports.isLoggedIn = async function (req, res, next) {
  if (req.cookies.token) {
    try {
      let decoded = await jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);  // Corrected `Jwt` to `jwt`
      let user = await userModel.findOne({ email: decoded.email });
           // .select("-password")   ye tab krna pdhta jb usermodel mai password select true hota kyuki agr nhi krenge to user ki details ke sth sth password bhi show ho jata

      req.user = user;
      next();
    } catch (err) {
      return res.redirect("/");
    }
  } else {
    return res.redirect("/");
  }
};
 
module.exports.redirectIfLoggedIn = function(req, res, next) {
  if (req.cookies.token) {
    try {
      let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
      return res.redirect("/profile");
    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
};