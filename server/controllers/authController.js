const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const { generateOTP } = require("../utils/otpGenerator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ms = require("ms");

// Controller: Send OTP for user registration
const sentOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Prevent sending OTP if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        messsage: "User already exist",
      });
    }

    // Remove old OTPs so only the latest OTP is valid for this user
    await OTP.deleteMany({ email });

    // Generate and store new OTP (email sending handled in OTP model)
    const otp = generateOTP();
    await OTP.create({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Error in sendOtp controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Controller: Handles new user registration with OTP verification
const signup = async (req, res) => {
  try {
    // -------------------- Input Validation --------------------
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Ensure password and confirmPassword match
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords doesn't match. Please try again!!!",
      });
    }

    // -------------------- Existing User Check --------------------
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    // -------------------- OTP Verification --------------------
    // Get the most recent OTP for this email
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new one.",
      });
    }

    // Validate provided OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // -------------------- Password Hashing --------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // -------------------- Profile Creation --------------------
    // Create a profile with optional details
    const ProfileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber || null,
    });

    // -------------------- User Creation --------------------
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: ProfileDetails._id,
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}${lastName}`,
    });

    // -------------------- Success Response --------------------
    res.status(200).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again!",
    });
  }
};

// Controller: Handles user login, JWT generation, and secure cookie setup
const login = async (req, res) => {
  try {
    //Extract and validate user input
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    //Check if user exists in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Verify password (hashed with bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    //Generate JWT (short-lived)
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "2h",
    });

    user.token = token;
    user.password = undefined;

    //Configure secure cookie options
    const options = {
      expires: new Date(Date.now() + ms(process.env.COOKIE_EXPIRY)),
      httpOnly: true, // prevents XSS — cookie can’t be accessed via JS
    };

    //Send response with cookie + token
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again!",
    });
  }
};

module.exports = { sendOtp, signup, login };
