const express = require("express");
const router = express.Router();
const {
  FetchBootCamps,
  CreateBootCamps,
  FetchBootCamp,
  UpdateBootCamp,
  DeleteBootCamp,
} = require("../controllers/bootcamps");

router.route("/").get(FetchBootCamps).post(CreateBootCamps);
router
  .route("/:id")
  .get(FetchBootCamp)
  .put(UpdateBootCamp)
  .delete(DeleteBootCamp);
module.exports = router;
