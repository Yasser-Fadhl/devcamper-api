const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
exports.FetchBootCamps = asyncHandler(async (req, res, next) => {
  let query;
  // Copy req.query
  const reqQuery = { ...req.query };
  // Fields to exclude
  const removeFields = ["select", "sort"];
  // Loop over removed fields and delete them from reqQuery
  removeFields.forEach((field) => delete reqQuery[field]);
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
  query = Bootcamp.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const selectedFields = req.query.select.split(",").join(" ");
    query = query.select(selectedFields);
  }
  // Sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  const bootcamps = await query;

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
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
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
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
exports.DeleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Boocamp with ID ${req.params.id} is not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
  });
});

exports.CreateBootCamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});
