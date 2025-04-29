import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { getUser, updateUser, resetUser } from "../controllers/user.js";

const router = Router();

router.get("/:userId", verifyToken, getUser);
router.patch("/update/:userId", verifyToken, updateUser);
router.patch("/reset/:userId", verifyToken, resetUser);

export default router;