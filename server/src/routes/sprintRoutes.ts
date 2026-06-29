import { Router } from "express";

import {
    createSprint,
    deleteSprint,
    getSprintById,
    getSprints,
    updateSprint,
} from "../controllers/sprintController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/", createSprint);
router.get("/", getSprints);
router.get("/:id", getSprintById);
router.put("/:id", updateSprint);
router.patch("/:id", updateSprint);
router.delete("/:id", deleteSprint);

export default router;