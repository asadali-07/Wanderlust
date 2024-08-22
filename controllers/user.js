const User=require("../models/user");
module.exports.signup=(req,res)=>{
    res.render("./auth/signup.ejs");
}
module.exports.create=async(req,res,next)=>{
    try{
    let {username,email,password}=req.body;
    const user=new User({email,username});
    await User.register(user,password);
    req.login(user,(err)=>{
        if(err){
        next(err)
        }
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
    })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if (err){
           return next(err)
        }
        req.flash("success","Logout successfully!");
        res.redirect("/listings")
    })
}
module.exports.loginUser=(req,res)=>{
    req.flash("success","You are now logged in!");
    let result=res.locals.currentUrl||"/listings";
    res.redirect(result);
}

module.exports.login=(req,res)=>{
    res.render("./auth/login.ejs");
}
