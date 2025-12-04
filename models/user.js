import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    name: { type: String },
    profileImage: { type: String }
})

export default mongoose.model("User", userSchema)