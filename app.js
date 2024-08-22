if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
const express=require("express");
const app=express();
const wrapAsync=require("./utils/wrapAsync")
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const User=require("./models/user");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
const listings=require("./routes/listing")
const reviews=require("./routes/review")
const users=require("./routes/user")
const flash=require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport=require("passport");
const LocalStrategy=require("passport-local");

const dbUrl=process.env.ATLAS_URL;
main().then(()=>{
    console.log("Connected to MongoDB");
 }).catch(error=>{
    console.error("Error connecting to MongoDB",error);
   
 });
async function main(){
    await mongoose.connect(dbUrl)
}

const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
        algorithm: "aes-256-ctr"
    },
    touchAfterLogin:24*3600,
})
store.on("error",(err)=>{
    console.error("Error connecting to MongoDB Store",err);
 });
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false,
        maxAge:1000*60*60*24*7 ,// 7 days
        expries:Date.now()+1000*60*60*24*7,
        httpOnly:true, // client side script can't access cookie
        //secure:true means cookie will only send over https
    } 
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.session());
app.use(passport.initialize());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUrl=req.session.currentUrl;
    res.locals.currentUser=req.user;
    next();
})
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);
app.use((err,req,res,next)=>{
   let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("./listing/error.ejs",{message});
})
app.get("/privacy-policy",(req,res)=>{
    res.render("./listing/privacy-policy.ejs")
})
app.get("/about",(req,res)=>{
    res.render("./listing/about.ejs")
})
app.use("/",(eq,res)=>{
    res.status(404).render("./listing/404.ejs")
})
app.listen(8080,()=>{
    console.log("server is running");
})