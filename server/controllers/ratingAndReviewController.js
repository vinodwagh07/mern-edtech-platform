const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

//Creates a rating and review for a course
const createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, rating, review } = req.body;
    if (!userId || !courseId || !rating) {
      return res.status(400).json({
        success: false,
        message: "userId , courseId and rating are required",
      });
    }

    // Check if the user is enrolled in the course
    // Only enrolled users can create ratings
    const course = await Course.findOne({
      _id: courseId,
      studentsEnrolled: userId,
    });

    if (!course) {
      return res.status(403).json({
        success: false,
        message: "User is not enrolled in the course",
      });
    }

    // Prevent duplicate reviews by the same user for the same course
    const existingReview = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }

    // Create a new rating and review document
    const newReview = await RatingAndReview.create({
      user: userId,
      rating,
      review,
      course: courseId,
    });

    // Update course's ratings array with new review's id
    course.ratingsAndReviews.push(newReview._id);
    await course.save();

    res.status(201).json({
      success: true,
      message: "Course reviewed successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Error creating ratingAndReview", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Fetches the average rating and total number of ratings for a given course.
const getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    // Aggregate pipeline: filter by courseId → group by null (all docs)
    // $avg to compute average rating
    // $sum to count total ratings
    const result = await RatingAndReview.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    // If ratings exist → return aggregated result
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Average rating fetched successfully",
        data: {
          averageRating: result[0].averageRating,
          totalRatings: result[0].totalRatings,
        },
      });
    }

    //No ratings found → return defaults
    return res.status(204).json({
      success: true,
      message: "No ratings found",
      data: {
        averageRating: 0,
        totalRatings: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching averageRating", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Controller: to fetch ratings & reviews (all or by courseId)
const getAllRatings = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Build query dynamically (empty = all reviews)
    const query = courseId ? { course: courseId } : {};

    // Fetch reviews, sorted by rating (highest first)
    const ratings = await RatingAndReview.find(query)
      .sort({ rating: -1 })
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "course", select: "courseName" });

    // If courseId given but no reviews found
    if (courseId && ratings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No ratings and reviews found for this course",
      });
    }

    return res.status(200).json({
      success: true,
      message: courseId
        ? "Ratings and reviews for the course fetched successfully"
        : "All ratings and reviews fetched successfully",
      data: ratings,
    });
  } catch (error) {
    console.error("Error fetching ratings", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { createRating, getAverageRating, getAllRatings };
