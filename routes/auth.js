const express = require("express");
const router = express.Router();
const { Register, Login, getMe } = require("../controllers/auth");
const { protect } = require("../middleware/protect");
router.post("/register", Register);
router.post("/login", Login);
router.get("/me", protect, getMe);

module.exports = router;
