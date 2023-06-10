const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //else
  if (!token) {
    next(new ErrorResponse("Not authorized", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    // console.log("decoded", decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    next(new ErrorResponse("Not authorized", 401));
  }
});
exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User with ${req.user.role} is not authorized to commit this action`,
          403
        )
      );
    }
    next();
  };
