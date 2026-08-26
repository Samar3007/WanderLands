const Campground = require('../models/campgrounds');
const {cloudinary} = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    // console.log(geoData);
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect('/listings/new');
    }
    
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;
    //campground.geometry = geoData.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new listing!');
    res.redirect(`/listings/${campground._id}`)
}

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    
    if(!campground){
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('campgrounds/show', {campground})
}

module.exports.editCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('campgrounds/edit', {campground})
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;

    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect(`/listings/${id}/edit`);
    }

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;

    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the listing!');
    res.redirect('/listings')
}