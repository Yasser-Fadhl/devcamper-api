const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.Register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  await User.create({ name, email, password, role });
  res.status(200).json({
    success: true,
    message: "Authent",
  });
});
