const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});
module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({})
    res.render("./listing/index.ejs",{allListings});
}
 module.exports.trending=async(req,res)=>{
    const allListings= await Listing.find({category:"Trending"})
    res.render("./listing/index.ejs",{allListings});
}
module.exports.iconic=async(req,res)=>{
    const allListings= await Listing.find({category:"Iconic Cities"})
    res.render("./listing/index.ejs",{allListings});
}
module.exports.mountains=async(req,res)=>{
    const allListings= await Listing.find({category:"Mountains"})
    res.render("./listing/index.ejs",{allListings});
}
module.exports.castles=async(req,res)=>{
    const allListings= await Listing.find({category:"Castles"})
    res.render("./listing/index.ejs",{allListings});
}
 module.exports.amgpools=async(req,res)=>{
    const allListings= await Listing.find({category:"Amazing Pools"})
    res.render("./listing/index.ejs",{allListings});
}
 module.exports.artics=async(req,res)=>{
    const allListings= await Listing.find({category:"Artics"})
    res.render("./listing/index.ejs",{allListings});
}
 module.exports.island=async(req,res)=>{
    const allListings= await Listing.find({category:"Island"})
    res.render("./listing/index.ejs",{allListings});
}
module.exports.search=async(req,res)=>{
    const searchQuery=req.query.q;
    const allListings=await Listing.find({ $or: [ {title:searchQuery },{country:searchQuery },{location:searchQuery} ] })
    res.render("./listing/index.ejs",{allListings})
}

module.exports.create=async(req,res,next)=>{
  let response= await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    let coordinates=response.body.features[0].geometry;
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body);
    newListing.image={filename,url};
    newListing.owner=req.user;
    newListing.geometry=coordinates;
    await newListing.save();
    req.flash("success","Listing is created");
    res.redirect("/listings")
}
 module.exports.new=async(req,res)=>{
    res.render("./listing/new.ejs");
}
 module.exports.show=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"user"}}).populate("owner")
    if(!listing){
        req.flash("error","Listing you request does not exits!");
       return res.redirect("/listings");
    }
    res.render("./listing/show.ejs",{listing})
}
module.exports.update=async(req,res)=>{
    const updatedListing=await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true})
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
       updatedListing.image={filename,url};
       await updatedListing.save();
    }
    // for converting location to coordinates
    let response= await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    let coordinates=response.body.features[0].geometry;
    updatedListing.geometry=coordinates;
    await updatedListing.save();
    if(!updatedListing){
        req.flash("error","Listing you request does not exits!");
       return res.redirect(`/listings`);
    }
    req.flash("success","Listing is updated!");
    res.redirect(`/listings/${updatedListing._id}`)
}
 module.exports.delete=async(req,res,)=>{
    let id=req.params.id;
        await Listing.findByIdAndDelete(id)
        req.flash("success","Listing is deleted!");
        res.redirect("/listings")
}
 module.exports.edit=async (req,res)=>{
    let {id}=req.params;
        const listing=await Listing.findById(id)
        let originalUrl=listing.image.url;
        originalUrl=originalUrl.replace("/upload","/upload/w_250");
        res.render("./listing/edit.ejs",{listing,originalUrl}) 
}