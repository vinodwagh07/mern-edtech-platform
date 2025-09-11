const Tag = require("../models/Tag");

// Controller : Create a new tag in the database
const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate inputs
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    // Prevent duplicate tag names
    const existingTag = await Tag.findOne({ name: name.trim() });
    if (existingTag) {
      return res.status(409).json({
        success: false,
        message: "Tag with this name already exists",
      });
    }

    // Create new tag
    const tag = await Tag.create({
      name: name.trim(),
      description: description.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Tag created successfully",
      tag,
    });
  } catch (error) {
    console.error("Error creating tag:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Controller: Fetch all tags from the database
const getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: 1, description: 1, _id: 0 });
    res.status(200).json({
      success: true,
      allTags: allTags,
      message:
        allTags.length > 0 ? "Tags fetched successfully" : "No tags found",
    });
  } catch (error) {
    console.error("Error fetching tags:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { createTag, getAllTags };
