const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
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

  // make sure user is course owner
  if (req.user.role !== "admin" && req.user.id !== course.user.toString()) {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to update a course ${course._id}`,
        401
      )
    );
  }
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
  // make sure user is course owner
  if (req.user.role !== "admin" && req.user.id !== course.user.toString()) {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to delete a course ${course._id}`,
        401
      )
    );
  }
  course.remove();
  res.status(200).json({
    success: true,
  });
});
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    next(
      new ErrorResponse(
        `Bootcamp with ID ${req.params.bootcampId} not found`,
        404
      )
    );
  }
  // make sure user is bootcamp owner
  if (req.user.role !== "admin" && req.user.id !== bootcamp.user.toString()) {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        401
      )
    );
  }
  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});
