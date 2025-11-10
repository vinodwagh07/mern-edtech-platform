const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");
const { uploadToCloudinary } = require("../utils/mediaUploader");

// Controller: Handles new course creation
const createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn, // UI: "Benefits of the course" → Backend: whatYouWillLearn
      price,
      category,
    } = req.body;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //Validate price is a positive number
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    //Validate thumbnail image exists
    const thumbnail = req.files?.thumbnailImage;
    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    //Get instructor user ID from authenticated request (authMiddleware)
    const userId = req.user.id;

    //Optional safety: check if instructor exists in DB
    const instructorDetails = await User.findById(userId);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    //Upload thumbnail to Cloudinary
    const thumbnailImage = await uploadToCloudinary(
      thumbnail,
      process.env.COURSE_THUMBNAILS_FOLDER
    );

    //Create new course document
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      thumbnail: thumbnailImage.secure_url,
      category: categoryDetails._id,
    });

    //Update instructor's course list
    await User.findByIdAndUpdate(
      instructorDetails._id,
      {
        $push: { courses: newCourse._id },
      },
      { new: true }
    );

    //Update category's course list
    await Category.findByIdAndUpdate(categoryDetails._id, {
      $push: { courses: newCourse._id },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Controller: Handles fetching all courses
const getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find()
      .select(
        "courseName instructor ratingsAndReviews price thumbnail studentsEnrolled"
      )
      .populate("instructor", "_id firstName lastName"); // only necessary fields

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.error("Error fetching all courses:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Controller : Get all details of a single course
const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    // Find course and populate sections and subSections
    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .populate("category")
      .populate("ratingsAndReviews")
      .populate("studentsEnrolled")
      .lean(); // makes the object plain JS for faster read-only operations

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.error("Error fetching course details:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getFullCourseDetails = async (req, res) => {};

const editCourse = async (req, res) => {};

const getInstructorCourses = async (req, res) => {};

const deleteCourse = async (req, res) => {};

module.exports = {
  createCourse,
  editCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  getInstructorCourses,
  deleteCourse,
};
