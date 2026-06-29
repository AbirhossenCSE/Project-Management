import type { Response } from "express";
import { isValidObjectId } from "mongoose";

import type { AuthenticatedRequest } from "../middleware/auth";
import Project from "../models/Project";
import Sprint from "../models/Sprint";

async function canAccessProject(projectId: string, userId: string): Promise<boolean> {
    const project = await Project.findOne({
        _id: projectId,
        $or: [{ owner: userId }, { members: userId }],
    }).select("_id");
    return !!project;
}

export async function createSprint(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { name, project, startDate, endDate, status, tasks } = req.body as {
            name?: string;
            project?: string;
            startDate?: string;
            endDate?: string;
            status?: "planning" | "active" | "completed";
            tasks?: string[];
        };

        if (!name || !project || !startDate || !endDate) {
            res.status(400).json({ success: false, message: "name, project, startDate, and endDate are required" });
            return;
        }

        if (!isValidObjectId(project)) {
            res.status(400).json({ success: false, message: "Invalid project id" });
            return;
        }

        const accessible = await canAccessProject(project, userId);
        if (!accessible) {
            res.status(403).json({ success: false, message: "Forbidden" });
            return;
        }

        const validatedTasks = Array.isArray(tasks)
            ? tasks.filter((id) => typeof id === "string" && isValidObjectId(id))
            : [];

        const sprint = await Sprint.create({
            name: name.trim(),
            project,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: status ?? "planning",
            tasks: validatedTasks,
        });

        res.status(201).json({ success: true, data: { sprint } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create sprint" });
    }
}

export async function getSprints(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { project } = req.query as { project?: string };

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!project) {
            res.status(400).json({ success: false, message: "project query parameter is required" });
            return;
        }

        if (!isValidObjectId(project)) {
            res.status(400).json({ success: false, message: "Invalid project id" });
            return;
        }

        const accessible = await canAccessProject(project, userId);
        if (!accessible) {
            res.status(403).json({ success: false, message: "Forbidden" });
            return;
        }

        const sprints = await Sprint.find({ project }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: { sprints } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch sprints" });
    }
}

export async function getSprintById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid sprint id" });
            return;
        }

        const sprint = await Sprint.findById(id).populate("tasks").populate("project", "name owner members");
        if (!sprint) {
            res.status(404).json({ success: false, message: "Sprint not found" });
            return;
        }

        const projectDoc = sprint.project as unknown as {
            owner?: { toString(): string };
            members?: Array<{ toString(): string }>;
        };
        const isOwner = projectDoc.owner?.toString() === userId;
        const isMember = Array.isArray(projectDoc.members)
            && projectDoc.members.some((member) => member.toString() === userId);
        if (!isOwner && !isMember) {
            res.status(403).json({ success: false, message: "Forbidden" });
            return;
        }

        res.status(200).json({ success: true, data: { sprint } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch sprint" });
    }
}

export async function updateSprint(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid sprint id" });
            return;
        }

        const sprint = await Sprint.findById(id);
        if (!sprint) {
            res.status(404).json({ success: false, message: "Sprint not found" });
            return;
        }

        const accessible = await canAccessProject(sprint.project.toString(), userId);
        if (!accessible) {
            res.status(403).json({ success: false, message: "Forbidden" });
            return;
        }

        const { name, project, startDate, endDate, status, tasks } = req.body as {
            name?: string;
            project?: string;
            startDate?: string;
            endDate?: string;
            status?: "planning" | "active" | "completed";
            tasks?: string[];
        };

        if (project !== undefined) {
            if (!isValidObjectId(project)) {
                res.status(400).json({ success: false, message: "Invalid project id" });
                return;
            }
            const accessibleNewProject = await canAccessProject(project, userId);
            if (!accessibleNewProject) {
                res.status(403).json({ success: false, message: "Forbidden" });
                return;
            }
            sprint.project = project as never;
        }

        if (name !== undefined) sprint.name = name.trim();
        if (startDate !== undefined) sprint.startDate = new Date(startDate);
        if (endDate !== undefined) sprint.endDate = new Date(endDate);
        if (status !== undefined) sprint.status = status;
        if (tasks !== undefined) {
            sprint.tasks = tasks.filter((taskId) => isValidObjectId(taskId)) as never;
        }

        await sprint.save();
        res.status(200).json({ success: true, data: { sprint } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update sprint" });
    }
}

export async function deleteSprint(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid sprint id" });
            return;
        }

        const sprint = await Sprint.findById(id);
        if (!sprint) {
            res.status(404).json({ success: false, message: "Sprint not found" });
            return;
        }

        const accessible = await canAccessProject(sprint.project.toString(), userId);
        if (!accessible) {
            res.status(403).json({ success: false, message: "Forbidden" });
            return;
        }

        await sprint.deleteOne();
        res.status(200).json({ success: true, data: { message: "Sprint deleted" } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete sprint" });
    }
}