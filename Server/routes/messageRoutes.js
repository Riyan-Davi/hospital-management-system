import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getMessages,
  getContacts,
  sendMessage,
  markAsRead,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/", protect, getMessages);

router.get("/contacts", protect, getContacts);

router.post("/", protect, sendMessage);

router.put("/:id/read", protect, markAsRead);

export default router;