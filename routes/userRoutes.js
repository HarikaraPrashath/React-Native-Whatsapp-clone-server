import express from "express";
import User from "../models/user.js";
import multer from "multer";


const router = express.Router();

//setup multer for image upload
const storage = multer.diskStorage({
  destination:"uploads/",
  filename:(req,file,cb)=>{
    cb(null,`${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({storage})


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

//create User with Image upload API
router.post('/',upload.single("profileImage"), async (req, res) => {
  const {phone, name} = req.body;
  try {
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(200).json({ message: "User already exists" });
    }

    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
    user = new User({ phone, name, profileImage })
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error : ", error: error.message });
  }
})


export default router;