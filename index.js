// index.js
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './src/routes/auth.routes.js';

dotenv.config();

const app = express();
app.use((req, _res, next) => {
    console.log(req.method, req.path);
    next();
  });
app.use(express.json());
app.use(cors());
app.options(/.*/, cors());
app.use('/auth', authRoutes);

await mongoose.connect(process.env.MONGO_URI);
console.log('✅  Mongo connected');

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => console.log(`🚀  Server on http://localhost:${PORT}`));
