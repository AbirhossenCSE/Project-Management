import { Router } from "express";

import {
    createProject,
    deleteProject,
    getProjectById,
    getProjects,
    updateProject,
} from "../controllers/projectController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;