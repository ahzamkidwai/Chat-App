import express from "express";
import {
  getUserProfileDetails,
  searchUserByPhoneNumber,
  updateUserProfile,
} from "../controllers/userControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/search", verifyToken, searchUserByPhoneNumber);
router.get("/user-profile", verifyToken, getUserProfileDetails);
router.patch("/user-profile", verifyToken, updateUserProfile);

export default router;
