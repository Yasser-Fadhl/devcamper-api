const Review = require("../models/Review");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");

// GET /api/v1/bootcamps/:bootcampId/reviews

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorResponse(`Review with ID ${req.params.id} is not found`)
    );
  }
  return res.status(200).json({
    success: true,
    data: review,
  });
});

// POST /api/v1/bootcamps/:bootcampId/reviews
exports.addReview = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with ID ${req.params.bootcamp} is not found`,
        404
      )
    );
  }
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const review = await Review.create(req.body);
  res.status(201).json({
    success: true,
    data: review,
  });
});

// PUT /api/v1/reviews/:id
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`Review with ID ${req.params.id} is not found`, 404)
    );
  }
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`You are not allowed to modify this review`, 401)
    );
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});
// Delete /api/v1/reviews/:id
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`Review with ID ${req.params.id} is not found`, 404)
    );
  }
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`You are not allowed to delete this review`, 401)
    );
  }
  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
