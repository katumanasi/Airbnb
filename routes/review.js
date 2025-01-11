const express= require("express");
const router = express.Router({mergeParams: true});
const { route } = require("./listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review= require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js")


//Reviews
//Post route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));


//Delete Review Route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));
module.exports = router;