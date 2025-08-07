import express from "express";
import {
  getMessagesBetweenUsers,
  getMessagesByChat,
  getUserChats,
  markMessageAsRead,
  sendMessage,
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// POST: Send a new message
router.post("/sendMessage", verifyToken, sendMessage);

// GET: Get messages for a specific chat
// router.get("/chat/:chatId", getMessagesByChat);

// GET: Get all chats for a user
router.get("/user/:userId", verifyToken, getUserChats);

// PATCH: Mark a message as read
router.patch("/:messageId/read", verifyToken, markMessageAsRead);

// GET: Get messages between two users
router.get("/between/:userA/:userB", verifyToken, getMessagesBetweenUsers);

export default router;
