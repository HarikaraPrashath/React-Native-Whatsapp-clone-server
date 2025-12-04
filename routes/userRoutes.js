import express from "express";
import User from "../models/user.js";

const router = express.Router();

//Get user by mobile
router.get('/:phone', async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server Error : ", error: error.message });
  }
});



export default router;