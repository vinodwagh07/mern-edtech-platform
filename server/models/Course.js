const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    trim: true,
    required: true,
  },
  courseDescription: {
    type: String,
    trim: true,
    default: "",
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillLearn: {
    type: String,
    default: "",
  },
  courseContent: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
    default: [],
  },
  ratingsAndReviews: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "RatingAndReview" }],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  studentsEnrolled: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
});

module.exports = mongoose.model("Course", CourseSchema);
