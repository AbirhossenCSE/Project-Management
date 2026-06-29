import { Router } from "express";

import {
    createTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateTask,
} from "../controllers/taskController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;