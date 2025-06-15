const userModel=require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt= require("jsonwebtoken")
const hisaabModel = require("../models/hisaabModel")
const { isLoggedIn } = require("../middlewares/auth_middlewares")
const generatetoken=require('../utils/token')

module.exports.landingPageController=function(req,res){
    res.render("index",{isloggedIn : false})
}
module.exports.registerPageController=function(req,res){
    res.render("register",{isloggedIn : false})
}


const generateToken = require('../utils/token');

module.exports.registerController = async function (req, res) {
  const { username, name, email, password } = req.body;

  // Simple field validation
  if (!username || !email || !password) {
    req.flash("error", "All fields are required");
    return res.redirect('/register');
  }

  try {
    // Check if email or username already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash("error", "User already exists");
      return res.redirect('/register');
    }

    const usernameTaken = await userModel.findOne({ username });
    if (usernameTaken) {
      req.flash("error", "Username already taken");
      return res.redirect('/register');
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      name,
      email,
      password: hashedPassword
    });

    // Generate token and set cookie
    const token = generateToken({ id: user._id, email: user.email });
    res.cookie("token", token, {
      httpOnly: true,
     maxAge: 20 * 60 * 1000,
    });

    req.flash("success", "Registration successful! Welcome!");
    res.redirect('/profile');

  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect('/register');
  }
};


module.exports.loginController = async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash("error", "All fields are required");
    return res.redirect("/");
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/");
  }

  const token = generatetoken({ id: user._id, email: user.email });
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 20 * 60 * 1000 ,
  });

  res.redirect("/profile");
};

     


module.exports.logoutController= function(req,res){
    res.cookie("token","")
    return res.redirect("/")
}



module.exports.profileController = async function(req, res, next) {
    const id = req.user.id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const order = req.query.byDate ? Number(req.query.byDate) : -1;

    const user = await userModel.findById(id);

    // Build the date filter only if startDate or endDate is present
    const dateFilter = {};
    if (startDate || endDate) {
        dateFilter.createdAt = {
            ...(startDate && { $gte: new Date(startDate) }),
            ...(endDate && { $lt: new Date(endDate) })
        };
    }

    // Full filter object
    const filter = {
        user: user._id,
        ...dateFilter
    };

    const hisaab = await hisaabModel.find(filter).sort({ createdAt: order }).exec();

    res.render("profile", { isLoggedIn: true, user, hisaab });
};
