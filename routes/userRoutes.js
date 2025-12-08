import express from "express";
import User from "../models/User.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

//setup multer for image upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage })


//Get user by mobile
router.get('/:phone', async (req, res) => {
try {
    const user = await User.findOne({ phone: req.params.phone });
    //relative path to absolute path conversion to full URL
    const profileImageUrl= user && user.profileImage?`${req.protocol}://${req.get('host')}${user.profileImage}`:null;
   
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id:user._id,
      phone:user.phone,
      name:user.name,
      profileImage:profileImageUrl
    })
    res.json(user); // { _id, phone, name, __v }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//create User with Image upload API
router.post('/', upload.single("profileImage"), async (req, res) => {
  const { phone, name } = req.body;
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


//update Profile API
router.put('/:id', upload.single("profileImage"), async (req, res) => {
  const { name } = req.body

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (req.file) {
      if (user.profileImage) {
        //remove old image file
        const oldImagePath = path.join(process.cwd(), user.profileImage)
        if (fs.existsSync(path.join(oldImagePath))) {
          fs.unlinkSync(oldImagePath) // delete old image (path)
        }
      }
       user.profileImage = `/uploads/${req.file.filename}`
    }

   

    //update user name 
    if (name) {
      user.name = name // new name
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error : ", error: error.message });
  }
})
export default router;