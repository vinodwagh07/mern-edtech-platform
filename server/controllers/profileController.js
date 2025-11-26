const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const { uploadToCloudinary } = require("../utils/mediaUploader");

//Updates the authenticated user's profile information.
const updateProfile = async (req, res) => {
  try {
    //auth check
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not authenticated",
      });
    }

    const { firstName = "", lastName = "", dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    // Validate required fields
    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "contactNumber and gender are required",
      });
    }

    // Validate contact number format (example: 10-digit for India)
    if (!/^\d{10}$/.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact number format",
      });
    }

    // Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileId = user.additionalDetails;
    
    await Profile.findByIdAndUpdate(profileId, {
      gender: gender,
      dateOfBirth: dateOfBirth,
      about: about,
      contactNumber: contactNumber,
    });

    const updatedProfileDetails = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
    })
      .populate("additionalDetails")
      .exec();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfileDetails,
    });
  } catch (error) {
    console.error("error updating profile", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const profilePicture = req.files.profilePicture;
    const userId = req.user?.id;

    const profileImage = await uploadToCloudinary(profilePicture, process.env.PROFILE_PICTURES_FOLDER);

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: profileImage.secure_url },
      { new: true }
    ).populate("additionalDetails");;
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Deletes the authenticated user's account and associated data.
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not authenticated",
      });
    }

    // Fetch user details to confirm existence
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileId = userDetails.additionalDetails;

    //Remove profile details
    await Profile.findByIdAndDelete(profileId);

    //Unenroll user from all courses (remove from studentsEnrolled array)
    await Course.updateMany(
      { studentsEnrolled: userId },
      {
        $pull: { studentsEnrolled: userId },
      }
    );

    //Delete user account
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("error deleting account", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User id not found",
      });
    }

    const userDetails = await User.findById(userId).populate("additionalDetails");

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("error fetching user details", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Fetch all courses of a user is enrolled in along with progress
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user?.id;

    // 1️⃣ Fetch user with enrolled courses
    const user = await User.findById(userId).populate("courses").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`,
      });
    }

    //Fetch all course progress for this user
    const progressData = await CourseProgress.find({ userId }).lean();

    // Map courses to frontend-friendly format
    // - Uses stored totalLectures and totalDuration for performance
    // - Calculates progressPercentage based on completed subsections
    // - Adds 'Completed' status if progress is 100%
    const enrolledCourses = user.courses.map((course) => {
      const courseProgress = progressData.find((p) => p.courseId.toString() === course._id.toString());
      const completedCount = courseProgress?.completedSubSections.length || 0;

      const progressPercentage =
        course.totalLectures === 0 ? 100 : Math.round((completedCount / course.totalLectures) * 100);

      return {
        _id: course._id,
        courseData: course,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        totalDuration: course.totalDuration, // stored in Course
        totalLectures: course.totalLectures, // stored in Course
        progressPercentage,
        status: progressPercentage === 100 ? "Completed" : undefined,
      };
    });

    // 4️⃣ Respond with consistent API format
    return res.status(200).json({
      success: true,
      data: enrolledCourses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching enrolled courses",
    });
  }
};

module.exports = {
  updateProfile,
  updateProfilePicture,
  deleteAccount,
  getUserDetails,
  getEnrolledCourses,
};
