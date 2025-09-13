const Category = require("../models/Category");

// Controller : Create a new category in the database
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
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
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

module.exports = { createCategory, getAllCategories };
