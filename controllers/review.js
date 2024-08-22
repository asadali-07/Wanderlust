const Listing=require("../models/listing");
const Review=require("../models/review");
module.exports.create=async(req,res)=>{
    const listing=await Listing.findById(req.params.id)
    const newReview=new Review(req.body)
    newReview.user=req.user;
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success","Review is created");
    res.redirect(`/listings/${listing._id}`)
}

module.exports.delete=async(req,res)=>{
    let reviewId=req.params.reviewId;
    let listingId=req.params.id;
    await Listing.findByIdAndUpdate(listingId,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is deleted");
    res.redirect(`/listings/${listingId}`)
 }