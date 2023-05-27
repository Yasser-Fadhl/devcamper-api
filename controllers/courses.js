const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    //show all bootcamp data for a course
    // query = Course.find().populate("bootcamp");

    // Show selected  bootcamp data for a course
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    courses,
  });
});
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    next(new ErrorResponse(`Course with ID ${req.params.id} not found`, 404));
  }

  res.status(200).json({
    success: true,
    course,
  });
});
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    next(new ErrorResponse(`Course with ID ${req.params.id} not found`, 404));
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    success: true,
    course,
  });
});
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    next(new ErrorResponse(`Course with ID ${req.params.id} not found`, 404));
  }
  // course = await Course.findByIdAndDelete(req.params.id);
  course.remove();
  res.status(200).json({
    success: true,
  });
});
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    next(
      new ErrorResponse(
        `Bootcamp with ID ${req.params.bootcampId} not found`,
        404
      )
    );
  }
  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});