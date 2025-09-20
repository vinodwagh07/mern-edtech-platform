const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadToCloudinary } = require("../utils/mediaUploader");

//Create a new SubSection and add its reference(ObjectId) to the Section
const createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description, timeDuration } = req.body;
    const videoFile = req.files?.videoFile;

    if (!title || !description || !timeDuration || !videoFile || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Ensure section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Upload video to cloudinary
    const uploadedVideo = await uploadToCloudinary(
      videoFile,
      process.env.COURSE_LECTURES_FOLDER,
      { resource_type: "video" }
    );

    // Create sub-section
    const newSubSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadedVideo.secure_url,
    });

    //Update section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subSections: newSubSection._id },
      },
      { new: true }
    ).populate("subSections");

    return res.status(201).json({
      success: true,
      message: "SubSection created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error creating sub section:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Update an existing SubSection
const updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, description, timeDuration } = req.body;
    const videoFile = req.files?.videoFile;

    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "SubSectionId is required",
      });
    }

    // Ensure section exists
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (timeDuration) updateData.timeDuration = timeDuration;

    // if video given - Upload video to cloudinary
    if (videoFile) {
      const uploadedVideo = await uploadToCloudinary(
        videoFile,
        process.env.COURSE_LECTURES_FOLDER,
        { resource_type: "video" }
      );
      updateData.videoUrl = uploadedVideo.secure_url;
    }

    // Update SubSection and return updated document
    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: updatedSubSection,
    });
  } catch (error) {
    console.error("Error updating sub section:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Delete a SubSection and remove its reference from the Section
const deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId and sectionId are required",
      });
    }

    // Ensure sub-section exists
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Remove SubSection reference from the section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: {
          subSections: subSectionId,
        },
      },
      { new: true }
    ).populate("subSections");

    // Delete the SubSection
    await SubSection.findByIdAndDelete(subSectionId);

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error deleting sub section:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { createSubSection, updateSubSection, deleteSubSection };
