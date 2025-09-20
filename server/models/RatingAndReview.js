const mongoose = require("mongoose");

const RatingAndReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
      default: "",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RatingAndReview", RatingAndReviewSchema);
