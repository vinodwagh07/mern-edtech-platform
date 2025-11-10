const express = require("express");
const router = express.Router();

const {
  sendOtp,
  signup,
  login,
  changePassword,
} = require("../controllers/authController");
const {
  requestPasswordReset,
  resetPassword,
} = require("../controllers/resetPasswordController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/change-password", changePassword);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
