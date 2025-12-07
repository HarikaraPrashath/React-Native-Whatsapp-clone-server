import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"
import path from "path";
import {Server} from 'socket.io'
import registerSocketHandlers from "./socket.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use('/uploads',express.static(path.join(process.cwd(),"uploads"))); //make this as a static folder


const PORT = process.env.PORT || 5000;

//Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => { console.log("Connected to MongoDB") })
  .catch((err) => { console.log("Error connecting to MongoDB: ", err.message) });


app.get('/', (req, res) => {
  res.send("Hello World");
})

app.use('/api/users', userRoutes)



const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"]
  }
})

registerSocketHandlers(io);