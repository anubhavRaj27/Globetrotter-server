import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getAnswer, getCity, getRandomCity } from '../controllers/cities.js';

const router = Router();

router.get('/city/random', verifyToken, getRandomCity);
router.get('/city/:cityId', verifyToken, getCity);
router.get('/answer/:cityId',verifyToken, getAnswer);

export default router;