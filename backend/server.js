import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());


mongoose.set("strictQuery", true);


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" Connected to MongoDB");
  } catch (err) {
    console.error(" MongoDB connection error:", err);
    console.log(" Retrying in 5 seconds...");
    setTimeout(connectDB, 5000); 
  }
};
connectDB();


app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);


app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
