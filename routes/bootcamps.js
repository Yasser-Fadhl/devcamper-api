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
const { protect, authorize } = require("../middleware/protect");
const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), FetchBootCamps)
  .post(protect, authorize("publisher", "admin"), CreateBootCamps);
router
  .route("/:id")
  .get(FetchBootCamp)
  .put(protect, authorize("publisher", "admin"), UpdateBootCamp)
  .delete(protect, authorize("publisher", "admin"), DeleteBootCamp);
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), UploadBootCampPhoto);
module.exports = router;
