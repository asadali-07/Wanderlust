const joi=require("joi");
module.exports.listingSchema=joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),
        image:{url:joi.string().required()},
        category:joi.string().required(),
}).required();

module.exports.reviewSchema=joi.object({
    rating:joi.number().min(1).max(5).required(),
    comment:joi.string().required(),
}).required();

module.exports.userSchema=joi.object({
  email:joi.string().required(),
  password:joi.string().required(),
  username:joi.string().required(),
}).required();
