import express from "express";
import { searchUserByPhoneNumber } from "../controllers/userControllers.js";
const router = express.Router();
router.get("/search", searchUserByPhoneNumber);
export default router;
