const mongoose = require("mongoose");

const CourseProgressSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completedSubSections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],
    default: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourseProgress", CourseProgressSchema);
