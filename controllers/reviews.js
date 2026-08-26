const Campground = require('../models/campgrounds');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created a new review!');
    res.redirect(`/listings/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/listings/${id}`);
}