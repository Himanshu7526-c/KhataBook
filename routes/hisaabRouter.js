const express = require("express")
const router =express.Router();
const { 
    createHisaabController,
     hisaabPageController,
     readHisaabController,
     readVerifiedHisaabController,
     deleteController,
     editController,
     editPostController
} = require("../controllers/hisaabController");

const {isLoggedIn,redirectIfLoggedIn} = require("../middlewares/auth_middlewares");

router.get("/create", isLoggedIn , hisaabPageController)
router.post("/create",isLoggedIn,createHisaabController)

router.get('/delete/:id',isLoggedIn,deleteController)

router.get('/edit/:id', isLoggedIn, editController);
router.post('/edit/:id', isLoggedIn, editPostController);


router.get("/view/:id",isLoggedIn, readHisaabController)
router.get("/:id",readVerifiedHisaabController)


router.post('/verify/:id',isLoggedIn,readVerifiedHisaabController)

module.exports=router;