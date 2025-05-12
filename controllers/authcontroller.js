const userModel=require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt= require("jsonwebtoken")
const hisaabModel = require("../models/hisaabModel")
const { isLoggedIn } = require("../middlewares/auth_middlewares")
const generatetoken=require('../utils/token')

module.exports.landingPageController=function(req,res){
    res.render("index",{loggedIn : false})
}
module.exports.registerPageController=function(req,res){
    res.render("register")
}
module.exports.registerController = async function (req, res) {
  let { username, name, email, password } = req.body;

  // 1. Validate required fields
  if (!username || !email || !password) {
    req.flash("error", "All fields are required");
    return res.redirect('/register');
  }

  try {
    // 2. Check if user already exists by email
    let user = await userModel.findOne({ email });
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect('/register');
    }

    // 3. Check if username is taken
    let userNameExists = await userModel.findOne({ username });
    if (userNameExists) {
      req.flash("error", "Username already exists");
      return res.redirect('/register');
    }

    // 4. Hash password
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    // 5. Create user
    user = await userModel.create({
      username,
      name,
      email,
      password: hash
    });

    // 6. Generate token
    const token = generatetoken({ id: user._id, email: user.email });

    // 7. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Use 'secure: process.env.NODE_ENV === "production"' in real apps
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // 8. Redirect or send success
    res.redirect('/profile'); // Or wherever you want to take the user after registration

  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again.");
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
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.redirect("/profile");
};

     


module.exports.logoutController= function(req,res){
    res.cookie("token","")
    return res.redirect("/")
}

// module.exports.profileController= async function(req,res){
  
//   let byDate = Number(req.query.byDate);
//   let { startDate, endDate } = req.query;

//   byDate = byDate ? byDate : -1;
//   startDate=startDate ? startDate : new Date("1970-01-01");
//   endDate=endDate ? endDate : new Date();

//     let user =  await userModel
//    .findOne({email:req.user.email})
//    .populate({
//     path: "hisaab",
//     match: {createdAt:{ $gte: startDate, $lte: endDate}},
//     options: {sort: {createdAt: byDate}},
//    });
//     res.render("profile",{user}); 
// }

module.exports.profileController=async function(req,res,next){
    const id=req.user.id;
    const user=await userModel.findOne({
        _id:id
    })
    const hisaabs = await hisaabModel.find({
        user:user._id
    })
    res.render("profile",{isLoggedIn:true,user,hisaabs})
}
