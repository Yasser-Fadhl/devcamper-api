const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const path = require("path");
require("mongoose");
const asyncHandler = require("../middleware/async");
exports.FetchBootCamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
exports.FetchBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Boocamp with ID ${req.params.id} is not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});
exports.UpdateBootCamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Boocamp with ID ${req.params.id} is not found`, 404)
    );
  }
  // make sure user is bootcamp owner
  if (req.user.role !== "admin" && req.user.id !== bootcamp.user.toString()) {
    return next(
      new ErrorResponse(
        `User with ID ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});
exports.DeleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Boocamp with ID ${req.params.id} is not found`, 404)
    );
  }
  // make sure user is bootcamp owner
  if (req.user.role !== "admin" && req.user.id !== bootcamp.user.toString()) {
    return next(
      new ErrorResponse(
        `User with ID ${req.params.id} is not authorized to delete this bootcamp`,
        401
      )
    );
  }
  await bootcamp.remove();

  res.status(200).json({
    success: true,
  });
});

exports.CreateBootCamps = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  // check for published bootcamps
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  // if user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootCamp`,
        400
      )
    );
  }
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

exports.UploadBootCampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Boocamp with ID ${req.params.id} is not found`, 404)
    );
  }
  // make sure user is bootcamp owner
  if (req.user.role !== "admin" && req.user.id !== bootcamp.user.toString()) {
    return next(
      new ErrorResponse(
        `User with ID ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }
  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }
  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload an image file", 400));
  }
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // Create a custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // Upload the image file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
