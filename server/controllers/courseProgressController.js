const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

const updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.id;

  try {
    //  1- Verify subsection exists
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        error: "Invalid subsection",
      });
    }

    // 2️ - Find course progress for this user & course
    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    // 3️ - Add subsection to completedSubSections if not already
    if (courseProgress.completedSubSections.includes(subSectionId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Subsection already completed" 
      });
    }
    courseProgress.completedSubSections.push(subSectionId);

    await courseProgress.save();
    return res.status(200).json({
      message: "Course progress updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = { updateCourseProgress };
