import { Router } from "express";
import authRoutes from "./authRoutes";
import projectRoutes from "./projectRoutes";
import sprintRoutes from "./sprintRoutes";
import taskRoutes from "./taskRoutes";

const router = Router();

router.get("/health", (_req, res) => {
    res.status(200).json({ success: true, data: { message: "Server is healthy" } });
});

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/sprints", sprintRoutes);

export default router;
