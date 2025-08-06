import User from "../models/user-model.js";

export const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  console.log("User in uploadProfilePicture:", req.query.userId);
  const userId = req.query.userId || req.userId;
  await User.findByIdAndUpdate(
    userId,
    { $set: { profilePhoto: req.file.path } },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Profile picture uploaded successfully",
    fileUrl: req.file.path,
    publicId: req.file.filename,
  });
};
