import express from "express";
import Conversation from "../models/Conversation.js";


const router = express.Router();

//GET ALL conversation 
router.get("/:userId", async (req,res) => {
    try {
        const conversation = await Conversation.find({
            participants: req.params.userId
        })
        .populate("participants")
        .populate("lastMessage")
        .sort({ updatedAt: -1 })


        res.json(conversation)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


export default router