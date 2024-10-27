const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listings.js");

router.route("/")
.get(
    wrapAsync(listingController.index)
  )
.post(
    isLoggedin,
   upload.single("image"), validateListing,
    wrapAsync(listingController.createListing)
  );

// .post(upload.single("listing[image"), (req,res) =>{
//     res.send(req.file);
// })

//NEW ROUTE
router.get("/new", isLoggedin,listingController.renderNewform);


router.route("/:id")
.get(
    wrapAsync(listingController.showListing)
  )
  .put(
    isLoggedin,
    isOwner,
    upload.single("listing[Image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedin,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );


//INDEX ROUTE
// router.get(
//   "/",
//   wrapAsync(listingController.index)
// );



// //SHOW ROUTE
// router.get(
//   "/:id",
//   wrapAsync(listingController.showListing)
// );

//CREATE ROUTE
// router.post(
//   "/",
//   isLoggedin,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );

//EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// //UPDATE ROUTE
// router.put(
//   "/:id",
//   isLoggedin,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

//DELETE ROUTE
// router.delete(
//   "/:id",
//   isLoggedin,
//   isOwner,
//   wrapAsync(listingController.destroyListing)
// );

module.exports = router;
