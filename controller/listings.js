const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) =>{
    let {id} = req.params;
  const listing =  await Listing.findById(id)
  .populate({
    path: "reviews",
    populate:{
      path:"author",
    }
  })
  .populate("owner");
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show.ejs", {listing});
 }

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();
    //console.log(response.body.features[0].geometry);
    //res.send("Done");

    const { listing } = req.body;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id; 
    newListing.image = { url: req.file.path, filename: req.file.filename };  

     newListing.geometry = response.body.features[0].geometry
    let saveListing = await newListing.save();
    console.log(saveListing);
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
};


 module.exports.renderEditForm = async (req, res) =>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    if(!listing){
     req.flash("error", "Listing you requested for does not exist!");
     res.redirect("/listings");
   }

   let orignalUrl= listing.image.url;
   orignalUrl = orignalUrl.replace("/upload", "/upload/h_100,w_100");
    res.render("listings/edit.ejs",{listing, orignalUrl});
 };

 module.exports.renderUpdateForm = async(req,res) =>{
  
    let {id} = req.params;
  let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});

  if(typeof req.file !== "undefined"){
let url = req.file.path;
let filename = req.file.filename;
listing.image = {url , filename};
await listing.save();
  }

   req.flash("success", " Listing Updated!");
   res.redirect(`/listings/${id}`);
 };

 module.exports.destroyListing = async(req,res) =>{
    
    let {id} = req.params;
   let deleteListing = await Listing.findByIdAndDelete(id);
  //  console.log(deleteListing);
   req.flash("success", "Listing Deleted!");
   res.redirect("/listings");
 };


// const Listing = require("../models/listing");


// module.exports.index = async (req,res) =>{
//     const allListings = await Listing.find({})
//     res.render("listings/index.ejs",{allListings});
// }

// module.exports.renderNewForm = (req, res) =>{
//     res.render("listings/new.ejs");
// }

// module.exports.showListing = async (req, res) =>{
//     let {id} = req.params;
//   const listing =  await Listing.findById(id)
//   .populate({
//     path: "reviews",
//     populate:{
//       path:"author",
//     }
//   })
//   .populate("owner");
//   if(!listing){
//     req.flash("error", "Listing you requested for does not exist!");
//     res.redirect("/listings");
//   }
//   // console.log(listing);
//   res.render("listings/show.ejs", {listing});
//  }

//  module.exports.createListing =async(req,res,next)=>{
//     //    console.log(req.body);
//   let url = req.file.path;
//   let filename = req.file.filename;
//    console.log(url, "..", filename);
//     const newlisting= new Listing(req.body.listing);
//     //console.log(req.user);
//     newlisting.owner = req.user._id;
//    newlisting.image= (url, filename);
//     await newlisting.save();
//     req.flash("success", "New Listing Created!");
//    res.redirect("/listings");
//  };

//  module.exports.renderEditForm = async (req, res) =>{
//     let {id} = req.params;
//     const listing =  await Listing.findById(id);
//     if(!listing){
//      req.flash("error", "Listing you requested for does not exist!");
//      res.redirect("/listings");
//    }
//     res.render("listings/edit.ejs",{listing});
//  };

//  module.exports.renderUpdateForm = async(req,res) =>{
  
//     let {id} = req.params;
//    await Listing.findByIdAndUpdate(id,{...req.body.listing});
//    req.flash("success", " Listing Updated!");
//    res.redirect(`/listings/${id}`);
//  };

//  module.exports.destroyListing = async(req,res) =>{
    
//     let {id} = req.params;
//    let deleteListing = await Listing.findByIdAndDelete(id);
//   //  console.log(deleteListing);
//    req.flash("success", "Listing Deleted!");
//    res.redirect("/listings");
//  };