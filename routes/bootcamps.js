const express = require("express");
const router = express.Router();
const courseRouter = require("./courses");
const {
  FetchBootCamps,
  CreateBootCamps,
  FetchBootCamp,
  UpdateBootCamp,
  DeleteBootCamp,
  UploadBootCampPhoto,
} = require("../controllers/bootcamps");
const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), FetchBootCamps)
  .post(CreateBootCamps);
router
  .route("/:id")
  .get(FetchBootCamp)
  .put(UpdateBootCamp)
  .delete(DeleteBootCamp);
router.put("/:id/photo", UploadBootCampPhoto);
module.exports = router;
