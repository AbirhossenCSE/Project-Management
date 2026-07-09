import { Router } from "express";
import authRoutes from "./authRoutes";
import projectRoutes from "./projectRoutes";
import userRoutes from "./userRoutes";
import sprintRoutes from "./sprintRoutes";
import taskRoutes from "./taskRoutes";
import adminPanelRoutes from "./adminPanelRoutes";

const router = Router();

router.get("/health", (_req, res) => {
    res.status(200).json({ success: true, data: { message: "Server is healthy" } });
});

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/sprints", sprintRoutes);
router.use("/admin-panel", adminPanelRoutes);
router.use("/admin", adminPanelRoutes);

export default router;
