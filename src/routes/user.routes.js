import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getUser, updateUser } from '../controllers/user.js';

const router = Router();

router.get('/:userId', verifyToken, getUser);
router.patch("/update/:userId", verifyToken, updateUser);

export default router;