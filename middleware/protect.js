const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Set the token from Barear token in the authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Set the token from Cookie
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    // console.log("decoded", decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized", 401));
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
