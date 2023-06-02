const express = require("express");
const router = express.Router();
const { Register } = require("../controllers/auth");

router.post("/register", Register);

module.exports = router;
