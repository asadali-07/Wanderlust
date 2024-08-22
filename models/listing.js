const mongoose= require("mongoose");
const Review=require("./review");
const wrapAsync = require("../utils/wrapAsync");
const listingSchema=new mongoose.Schema({
 title:String,
 description:String,
 image:{ 
    filename:String,
    url:String,
   },
 price:Number,
 location:String,
 country:String,
 reviews:[
   {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review",
   }
 ],
   owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
   },
   geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    category:{
      type:String,
      required:true,
      enum:["Amazing Pools","Iconic Cities","Mountains","Castles","Artics","Island","Trending"]
    }
 });

 listingSchema.post("findOneAndDelete",wrapAsync(async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
 }))
 const Listing=mongoose.model("Listing",listingSchema);
 // Export the model for use in other parts of your application. For example, in a route file.
module.exports=Listing; 