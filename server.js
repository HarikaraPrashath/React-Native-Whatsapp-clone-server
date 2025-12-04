import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"

dotenv.config();
const app = express();
app.use(express.json());



//Database connection
mongoose.connect(process.env.REACT_NATIVE_APP_MONGO_URL)
.then(() => { console.log("Connected to MongoDB") })
.catch((err) => { console.log("Error connecting to MongoDB: ", err.message) });


app.get('/', (req, res) => {
    res.send("Hello World");
})

app.use('/api//users',userRoutes)

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})