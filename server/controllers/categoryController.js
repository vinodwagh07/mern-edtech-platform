const Category = require("../models/Category");
const Course = require("../models/Course");
const mongoose = require("mongoose");


// Controller : Create a new category in the database

// Helper: Escape regex special characters safely
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate inputs
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // Prevent duplicate category names
    const safeName = escapeRegex(name.trim());
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${safeName}$`, "i") },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    // Create new category
    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : "",
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating Category:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Controller: Fetch all categories from the database
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, { name: 1, description: 1 });

    res.status(200).json({
      success: true,
      data: categories,
      message:
        categories.length > 0
          ? "Categories fetched successfully"
          : "No category found",
    });
  } catch (error) {
    console.error("Error fetching Category:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


//Controller: Fetch all details for category page
const categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    //Validate categoryId
    if (!categoryId) {
      return res.status(400).json({ success: false, message: "categoryId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "Invalid categoryId format" });
    }

    //Fetch current category
    const currentCategory = await Category.findById(categoryId)
      .populate("courses", "courseName instructor") // only needed fields
      .lean();

    if (!currentCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    //Fetch other categories
    const otherCategories = await Category.find({ _id: { $ne: categoryId } })
      .populate("courses", "courseName instructor")
      .lean();

    //Fetch top courses
    const topCourses = await Course.aggregate([
      {
        $project: {
          courseName: 1,
          instructor: 1,
          studentsCount: { $size: { $ifNull: ["$studentsEnrolled", []] } },
        },
      },
      { $sort: { studentsCount: -1 } },
      { $limit: 10 },
    ]);


    return res.status(200).json({
      success: true,
      message: "Category page details fetched successfully",
      data: {
        currentCategory,
        otherCategories,
        topCourses,
      },
    });
  } catch (error) {
    console.error("Error fetching category page details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = { createCategory, getAllCategories, categoryPageDetails };
