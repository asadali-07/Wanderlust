const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync")
const{validateReview,userLogin,reviewOwned}=require("../middleware.js")
const ReviewController=require("../controllers/review.js")

router.post("/",userLogin,validateReview,wrapAsync(ReviewController.create))
router.delete("/:reviewId",userLogin,reviewOwned,wrapAsync(ReviewController.delete))

module.exports=router;