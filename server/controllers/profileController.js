const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
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

    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

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

    // Update profile document with new fields
    const updatedProfile = await Profile.findByIdAndUpdate(
      profileId,
      {
        dateOfBirth,
        about,
        contactNumber,
        gender,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
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

    const profileImage = await uploadToCloudinary(
      profilePicture,
      process.env.PROFILE_PICTURES_FOLDER
    );

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: profileImage.secure_url },
      { new: true }
    );
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

    const userDetails = await User.findById(userId).populate(
      "additionalDetails"
    );

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

module.exports = {
  updateProfile,
  updateProfilePicture,
  deleteAccount,
  getUserDetails,
};
