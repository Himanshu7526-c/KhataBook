const express = require("express")
const router =express.Router();
const flash = require("connect-flash");
const session = require("express-session");

router.use(flash());

const {
    isLoggedIn,
    redirectIfLoggedIn,
} = require("../middlewares/auth_middlewares")

const {
    landingPageController,
    registerPageController,
    registerController,
    loginController,
    logoutController,
    profileController
}=require("../controllers/authcontroller")

router.get("/",redirectIfLoggedIn,landingPageController)
router.get("/register",redirectIfLoggedIn,registerPageController)
router.get("/logout",logoutController)
router.get("/profile",isLoggedIn, profileController)

router.post("/register",registerController)
router.post("/login",loginController)
 
module.exports=router;