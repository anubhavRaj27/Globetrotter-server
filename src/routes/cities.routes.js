import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getCity, getRandomCity } from '../controllers/cities.js';

const router = Router();

router.get('/city/random', verifyToken, getRandomCity);
router.get('/city/:cityId', verifyToken, getCity);

export default router;