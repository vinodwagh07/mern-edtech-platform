const Course = require("../models/Course");

// Recalculate totalDuration and totalLectures for a course
async function updateCourseTotals(courseId) {
  const course = await Course.findById(courseId).populate({
    path: "courseContent",
    populate: { path: "subSections" },
  });

  if (!course) return;

  let totalDuration = 0;
  let totalLectures = 0;

  if (course.courseContent && course.courseContent.length > 0) {
    course.courseContent.forEach((section) => {
      if (section.subSections && section.subSections.length > 0) {
        section.subSections.forEach((sub) => {
          totalDuration += sub.timeDuration || 0;
          totalLectures += 1;
        });
      }
    });
  }

  course.totalDuration = totalDuration; // seconds
  course.totalLectures = totalLectures;
  await course.save();
}
module.exports = { updateCourseTotals };
