export const uploadProfilePicture = (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  return res.status(200).json({
    success: true,
    message: "Profile picture uploaded successfully",
    fileUrl: req.file.path, // Cloudinary URL
    publicId: req.file.filename,
  });
};
