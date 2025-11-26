const express = require("express");
const router = express.Router();

const {
  updateProfile,
  updateProfilePicture,
  deleteAccount,
  getUserDetails,
  getEnrolledCourses
} = require("../controllers/profileController");

const { auth } = require("../middlewares/authMiddleware");

router.put("/updateProfile", auth, updateProfile);
router.put("/updateProfilePicture", auth, updateProfilePicture);
router.delete("/deleteAccount", auth, deleteAccount);
router.get("/getUserDetails", auth, getUserDetails);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

module.exports = router;
