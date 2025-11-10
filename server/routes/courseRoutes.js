const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  deleteCourse,
  getInstructorCourses,
} = require("../controllers/courseController");
const {
  createCategory,
  getAllCategories,
  categoryPageDetails,
} = require("../controllers/categoryController");
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/subSectionController");
const {
  createRating,
  getAverageRating,
  getAllRatings,
} = require("../controllers/ratingAndReviewController");

const {
  updateCourseProgress,
} = require("../controllers/courseProgressController");

const { auth, authorizeRole } = require("../middlewares/authMiddleware");

router.post("/createCourse", auth, authorizeRole("Instructor"), createCourse);

router.put("/editCourse", auth, authorizeRole("Instructor"), editCourse);

router.post("/addSection", auth, authorizeRole("Instructor"), createSection);

router.put("/updateSection", auth, authorizeRole("Instructor"), updateSection);

router.delete("/deleteSection", auth, authorizeRole("Instructor"), deleteSection);

router.put(
  "/updateSubSection",
  auth,
  authorizeRole("Instructor"),
  updateSubSection
);

router.delete(
  "/deleteSubSection",
  auth,
  authorizeRole("Instructor"),
  deleteSubSection
);

router.post(
  "/addSubSection",
  auth,
  authorizeRole("Instructor"),
  createSubSection
);

router.get(
  "/getInstructorCourses",
  auth,
  authorizeRole("Instructor"),
  getInstructorCourses
);

router.get("/getAllCourses", getAllCourses);
router.get("/getCourseDetails", getCourseDetails);
router.get("/getFullCourseDetails", auth, getFullCourseDetails);
router.put("/updateCourseProgress", auth, authorizeRole, updateCourseProgress);
router.delete("/deleteCourse", deleteCourse);

router.post("/createCategory", auth, authorizeRole("Admin"), createCategory);
router.get("/showAllCategories", getAllCategories);
router.get("/getCategoryPageDetails", categoryPageDetails);

router.post("/createRating", auth, authorizeRole("Student"), createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatings);

module.exports = router;
