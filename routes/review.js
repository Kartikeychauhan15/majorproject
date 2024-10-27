const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// const validateReview = (req,res,next,err) =>{
//     const {error} = reviewSchema.validate(req.body);
//     console.log(err);
//      if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//          throw new ExpressError(400,errMsg);
//      }else{
//         next();
//      }
// }

//Review 
//post Review route
router.post("/",isLoggedin, validateReview,wrapAsync(reviewController.createReview));
 
 
 //Delete Review Route
 router.delete("/:reviewId", isLoggedin,isReviewAuthor, wrapAsync(reviewController.destroyReview))
 
 module.exports = router;
 