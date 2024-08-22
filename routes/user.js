const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const {validateUser}=require("../middleware.js")
const UserController=require("../controllers/user.js")
const passport=require("passport");

router
.route("/signup")
.get(UserController.signup)
.post(validateUser,wrapAsync(UserController.create))
// router.get("/signup",UserController.signup)
// router.post("/signup",validateUser,wrapAsync(UserController.create))

router
.route("/login")
.get(UserController.login)
.post(passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),UserController.loginUser)
// router.get("/login",UserController.login)
// router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),UserController.loginUser)

router.get("/logout",UserController.logout)

module.exports=router;