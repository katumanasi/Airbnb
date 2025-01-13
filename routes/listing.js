const express= require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner} = require("../middleware.js"); 

const listingController = require("../controller/listings.js");
const multer  = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage });

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){

        let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400, errMsg);
    }else{
        next();
    } 
};

router.route("/")
.get( wrapAsync(listingController.index))
.post(
    isLoggedIn, 
    upload.single("listing[image]"),
    validateListing,
   wrapAsync(listingController.createListing));

// .post(upload.single,("[listing[image]"), (req,res) =>{
//     res.send(req.file);
// });


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync (listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
   wrapAsync(listingController.renderUpdateForm))
  .delete(
    isLoggedIn,
    wrapAsync(listingController.destroyListing));


//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
   wrapAsync(listingController.renderEditForm));


module.exports = router;
