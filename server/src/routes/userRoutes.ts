import { Router } from "express";

import { getUsers } from "../controllers/userController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", getUsers);

export default router;