const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.Register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  const token = user.getSignedJwtToken();
  res.status(200).json({
    success: true,
    token,
  });
});
exports.Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  const isMatched = await user.isMatchedPassword(password);
  if (!isMatched) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  const token = user.getSignedJwtToken();
  res.status(200).json({
    success: true,
    token,
  });
});
