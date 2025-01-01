const express= require("express");
const router = express.Router();


//Index Route
router.get("/listings", wrapAsync (async (req,res) =>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings});
 
 }));
//New Route
router.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});

 //Show Route
 router.get("/listings/:id", wrapAsync (async (req, res) =>{
    let {id} = req.params;
  const listing =  await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", {listing});
 }));

 //Create Route
router.post("/listings", 
    validateListing,
   wrapAsync(async(req,res,next)=>{
   //    console.log(req.body);
 
   const newlisting= new Listing(req.body.listing);
   await newlisting.save();
  res.redirect("/listings");
})

);

//Edit Route
router.get("/listings/:id/edit", wrapAsync(async (req, res) =>{
   let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/listings/:id", 
  validateListing,
   wrapAsync(async(req,res) =>{
  
   let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/listings/:id",wrapAsync(async(req,res) =>{
   
   let {id} = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  res.redirect("/listings");
}));

module.exports = router;
