import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("File upload request body:", req.query.userId);
    console.log("File upload request file:", file);
    // const userId = req.body.userId || "unknown_user";
    const userId = req.query.userId || "unknown_user";
    return {
      folder: `chatApp/users/${userId}`,
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: "auto",
    };
  },
});

export default storage;
