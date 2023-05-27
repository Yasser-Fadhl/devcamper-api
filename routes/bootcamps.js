const express = require("express");
const router = express.Router();
const courseRouter = require("./courses");
const {
  FetchBootCamps,
  CreateBootCamps,
  FetchBootCamp,
  UpdateBootCamp,
  DeleteBootCamp,
} = require("../controllers/bootcamps");
const Course = require("../models/Course");
router.use("/:bootcampId/courses", courseRouter);
router.route("/").get(FetchBootCamps).post(CreateBootCamps);
router
  .route("/:id")
  .get(FetchBootCamp)
  .put(UpdateBootCamp)
  .delete(DeleteBootCamp);
module.exports = router;
