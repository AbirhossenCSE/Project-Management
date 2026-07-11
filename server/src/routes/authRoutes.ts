import { Router } from "express";

import { getMe, login, register, updateMe, changePassword } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateMe);
router.patch("/change-password", requireAuth, changePassword);

export default router;