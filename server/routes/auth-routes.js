import express from "express";
import {
  getAllUsers,
  loginUser,
  registerUser,
  updateUserDetails,
  verifyOTP,
} from "../controllers/authControllers.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("API is running...");
});

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/verify-otp", verifyOTP);
router.put("/update-user/:id", updateUserDetails);
router.get("/get-all-users", getAllUsers);
export default router;
