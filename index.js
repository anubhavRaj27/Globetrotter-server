import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import cityRoutes from "./src/routes/cities.routes.js";
import userRoutes from "./src/routes/user.routes.js"
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.options(/.*/, cors());
app.use("/auth", authRoutes);
app.use("/cities", cityRoutes);
app.use("/user", userRoutes)

await mongoose.connect(process.env.MONGO_URI);

const PORT = process.env.PORT ?? 3002;
app.listen(PORT, () => console.log(`🚀  Server on http://localhost:${PORT}`));
