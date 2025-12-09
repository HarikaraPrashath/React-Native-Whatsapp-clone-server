import express from "express";
import Conversation from "../models/Conversation.js";

const router = express.Router();

// GET ALL conversation 
router.get("/:userId", async (req, res) => {
  try {
    let conversations = await Conversation.find({
      participants: req.params.userId,
    })
      .populate("participants")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .lean(); // ⬅️ very important: get plain JS objects

    conversations = conversations.map((conv) => {
      return {
        ...conv,
        participants: conv.participants.map((user) => {
          // make sure we have a leading slash
          const imagePath = user.profileImage?.startsWith("/")
            ? user.profileImage
            : user.profileImage
            ? `/${user.profileImage}`
            : null;

          const profileImageUrl = imagePath
            ? `${req.protocol}://${req.get("host")}${imagePath}`
            : null;

          return {
            ...user,
            profileImageUrl,
          };
        }),
      };
    });

    res.json(conversations);
  } catch (error) {
    console.error("Error loading conversations:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
