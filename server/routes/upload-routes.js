import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadProfilePicture } from "../controllers/uploadControllers.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/profile-image",
  verifyToken,
  upload.single("file"),
  uploadProfilePicture
);
export default router;
