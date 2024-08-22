const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync")
const{validateListing,userLogin,isOwned}=require("../middleware.js")
const ListingController=require("../controllers/listing.js")
const multer=require("multer")
const {cloudinary,storage}=require('../cloudConfig.js')
const upload = multer({ storage })

router
.route("/")
.get(wrapAsync(ListingController.index))
.post(userLogin,upload.single('listingImage'),validateListing,wrapAsync(ListingController.create))

router.get("/new",userLogin,ListingController.new)
router.get("/search",wrapAsync(ListingController.search))
router.get("/trending",ListingController.trending)
router.get("/iconic",ListingController.iconic)
router.get("/mountains",ListingController.mountains)
router.get("/castles",ListingController.castles)
router.get("/amazingpools",ListingController.amgpools)
router.get("/artics",ListingController.artics)
router.get("/island",ListingController.island)

router
.route("/:id")
.get(wrapAsync(ListingController.show))
.put(userLogin,isOwned,upload.single('listingImage'),validateListing,wrapAsync(ListingController.update))
.delete(wrapAsync(ListingController.delete))

router.get("/:id/edit",userLogin,isOwned,wrapAsync(ListingController.edit))
module.exports=router;