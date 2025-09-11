const cloudinary = require("../config/cloudinary");

const uploadImageToCloudinary = async (file, folder, options = {}) => {
    
  if (!file) throw new Error("No file provided for upload");
  if (!folder) folder = "default";

  // Ensure resource_type is always set
  options.resource_type = options.resource_type || "auto";

  // Add folder to options
  options.folder = folder;

  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error; // throw error for controller to handle
  }
};

module.exports = { uploadImageToCloudinary };
