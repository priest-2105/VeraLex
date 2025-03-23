import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";


// Routes Import 
import uploadRoutes from "./routes/upload.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Sample Route
app.get("/", (req, res) => {
  res.send("Welcome to the Court Case Platform!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.use("/api/upload", uploadRoutes);