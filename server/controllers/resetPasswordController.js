const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const ResetPasswordToken = require("../models/ResetPasswordToken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

//Controller : Sends password reset email with secure token
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

     // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ success: true, message: "If email exists, reset link sent" });
    }

    // Invalidate all previous unused tokens for this user
    await ResetPasswordToken.updateMany(
      { userId: user._id, used: false },
      { used: true }
    );

    // Generate a new secure random token and hash it for storage
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + Number(process.env.RESET_TOKEN_EXPIRY));

    // Store hashed token in DB
    await ResetPasswordToken.create({
      userId: user._id,
      token: hashedToken,
      expiresAt,
    });

    // Construct reset URL and send via email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
    await mailSender(
      user.email,
      "Password reset request",
      `Click here to reset: ${resetUrl}`
    );

    res.status(200).json({
      success: true,
      message: "If email exists, reset link sent",
    });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Controller : Resets user password using valid token
const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // Validate input
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Both password fields are required",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Hash incoming token to match stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the token in DB that is valid and unused
    const resetTokenRecord = await ResetPasswordToken.findOne({
      token: hashedToken,
      used: false,
    });
    if (!resetTokenRecord || resetTokenRecord.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Find the user associated with the token
    const user = await User.findById(resetTokenRecord.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Mark token as used
    resetTokenRecord.used = true;
    await resetTokenRecord.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { requestPasswordReset, resetPassword };
