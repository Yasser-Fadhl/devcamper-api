const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateDetails,
} = require("../controllers/auth");
const { protect } = require("../middleware/protect");
router.post("/register", Register);
router.post("/login", Login);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
