import dotenv from "dotenv";
import express  from 'express';
import mongoose from 'mongoose';
import cors     from 'cors';
import authRoutes from './src/routes/auth.routes'

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log('✅  Mongo connected');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀  Server on http://localhost:${PORT}`));
