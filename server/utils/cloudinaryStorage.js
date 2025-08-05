import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const userId = req.body.userId || "unknown_user";
    return {
      folder: `chatApp/users/${userId}`,
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: "auto",
    };
  },
});

export default storage;
