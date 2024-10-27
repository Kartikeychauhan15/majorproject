const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    if (!listing) {
        return res.status(404).send("Listing not found"); // Handle the case where the listing does not exist
    }
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
    req.flash("success","New Review  Created");                      
   // res.send("new review saved");
    console.log("new review saved");
 
 //    const status = err.status || 500;
 //    res.status(status);
 
    res.redirect(`/listings/${listing._id}`);//only redirect no send
 };

 module.exports.destroyReview = async(req,res)=>{
    let{id,reviewId}= req.params;
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted");
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    res.redirect(`/listings/${id}`);
};