const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware: Validates JWT to protect routes
const auth = (req, res, next) => {
  try {
    //Extract token (supports cookies for web, headers for API, body as fallback)
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token is missing",
      });
    }

    try {
      //Verify token and attach decoded user payload to request
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedData;
    } catch (error) {
      // Invalid/expired token → block access
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again!",
    });
  }
};

//Middleware: to authorize a user based on role.
const authorizeRole = (role) => {
  return (req, res, next) => {
    try {
      // Check if user's role matches the required role
      if (req.user.accountType !== role) {
        return res.status(403).json({
          success: false,
          message: `This route is protected for ${role}`,
        });
      }
      // Role is valid, proceed to next middleware/controller
      next();
    } catch (error) {
      console.error("Authorization middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error. Please try again!",
      });
    }
  };
};

module.exports = { auth, authorizeRole };
