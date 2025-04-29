import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getUser } from '../controllers/user.js';

const router = Router();

router.get('/:userId', verifyToken, getUser);

export default router;