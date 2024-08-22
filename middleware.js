const {reviewSchema}=require("./schema.js")
const Review=require("./models/review");
const Listing=require("./models/listing");
const ExpressError=require("./utils/ExpressError");
const {listingSchema}=require("./schema.js")
const {userSchema}=require("./schema.js")
// reviews middlewares
module.exports.validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
     let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
module.exports.userLogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.currentUrl=req.originalUrl;
        req.flash("error","You are not login!")
        return res.redirect("/login");
       }
        next()
}
module.exports.reviewOwned=async(req,res,next)=>{
    const {id}=req.params;
    const review=await Review.findById(req.params.reviewId)
    if(!review.user.equals(req.user._id)){
       req.flash("error","You are not authorized to delete this review!");
       return res.redirect(`/listings/${id}`);
    }
    next()
}
//listing middleware 
module.exports.validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
     let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
module.exports.isOwned=async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(listing.owner._id.toString()!==req.user._id.toString()){
        req.flash("error","You are not authorized to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next()
}
module.exports.validateUser=(req,res,next)=>{
    let {error}= userSchema.validate(req.body);
    if(error){
     let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}