import type { Response } from "express";
import { isValidObjectId } from "mongoose";

import type { AuthenticatedRequest } from "../middleware/auth";
import Project from "../models/Project";
import Task from "../models/Task";
import User from "../models/User";

async function canAccessProject(projectId: string, userId: string): Promise<boolean> {
    const project = await Project.findOne({
        _id: projectId,
        $or: [{ owner: userId }, { members: userId }],
    }).select("_id");
    return !!project;
}

export async function createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { title, description, status, priority, assignee, project, dueDate } = req.body as {
            title?: string;
            description?: string;
            status?: "todo" | "in-progress" | "done";
            priority?: "low" | "medium" | "high";
            assignee?: string;
            project?: string;
            dueDate?: string;
        };

        if (!title || !description || !assignee || !project) {
            res.status(400).json({ success: false, message: "title, description, assignee, and project are required" });
            return;
        }

        if (!isValidObjectId(project) || !isValidObjectId(assignee)) {
            res.status(400).json({ success: false, message: "Invalid assignee or project id" });
            return;
        }

        const accessible = await canAccessProject(project, userId);
        if (!accessible) {
            res.status(403).json({ success: false, message: "Forbidden" });
            return;
        }

        const task = await Task.create({
            title: title.trim(),
            description: description.trim(),
            status: status ?? "todo",
            priority: priority ?? "medium",
            assignee,
            project,
            dueDate: dueDate ? new Date(dueDate) : undefined,
        });

        res.status(201).json({ success: true, data: { task } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create task" });
    }
}

export async function getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        console.log(req.user);

        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const jwtUser = req.user && typeof req.user === "object" ? req.user : null;
        const jwtUserId = jwtUser && typeof jwtUser.id === "string" ? jwtUser.id : userId;

        const currentUser = await User.findById(userId).select("role");
        if (!currentUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const { project, status, assignee } = req.query as {
            project?: string;
            status?: "todo" | "in-progress" | "done";
            assignee?: string;
        };

        const query: {
            project?: { $in: unknown[] } | string;
            status?: string;
            assignee?: string;
        } = {};

        if (currentUser.role === "member") {
            query.assignee = jwtUserId;
        } else {
            const accessibleProjects = await Project.find({
                $or: [{ owner: userId }, { members: userId }],
            }).select("_id");

            const accessibleProjectIds = accessibleProjects.map((p) => p._id);
            if (accessibleProjectIds.length === 0) {
                res.status(200).json({ success: true, data: { tasks: [] } });
                return;
            }

            query.project = { $in: accessibleProjectIds };
        }

        if (project) {
            if (!isValidObjectId(project)) {
                res.status(400).json({ success: false, message: "Invalid project id" });
                return;
            }
            if (currentUser.role === "admin") {
                const accessibleProjects = await Project.find({
                    $or: [{ owner: userId }, { members: userId }],
                }).select("_id");

                const accessibleProjectIds = accessibleProjects.map((id) => id._id.toString());
                if (!accessibleProjectIds.includes(project)) {
                    res.status(403).json({ success: false, message: "Forbidden" });
                    return;
                }
            } else {
                const allowed = await Project.findOne({ _id: project, $or: [{ owner: userId }, { members: userId }] }).select("_id");
                if (!allowed) {
                    res.status(403).json({ success: false, message: "Forbidden" });
                    return;
                }
            }
            query.project = project;
        }

        if (status) query.status = status;
        if (currentUser.role === "admin" && assignee) query.assignee = assignee;
        if (currentUser.role === "member") query.assignee = jwtUserId;

        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .populate("assignee", "name email role avatar")
            .populate("project", "name status");

        res.status(200).json({ success: true, data: { tasks } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch tasks" });
    }
}

export async function getTaskById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid task id" });
            return;
        }

        const task = await Task.findById(id)
            .populate("assignee", "name email role avatar")
            .populate("project", "name owner members status");

        if (!task) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }

        const projectDoc = task.project as unknown as {
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

        res.status(200).json({ success: true, data: { task } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch task" });
    }
}

export async function updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid task id" });
            return;
        }

        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }

        const projectAllowed = await canAccessProject(task.project.toString(), userId);
        if (!projectAllowed) {
            res.status(403).json({ success: false, message: "Forbidden" });
            return;
        }

        const { title, description, status, priority, assignee, dueDate, project } = req.body as {
            title?: string;
            description?: string;
            status?: "todo" | "in-progress" | "done";
            priority?: "low" | "medium" | "high";
            assignee?: string;
            dueDate?: string | null;
            project?: string;
        };

        if (project !== undefined) {
            if (!isValidObjectId(project)) {
                res.status(400).json({ success: false, message: "Invalid project id" });
                return;
            }
            const newProjectAllowed = await canAccessProject(project, userId);
            if (!newProjectAllowed) {
                res.status(403).json({ success: false, message: "Forbidden" });
                return;
            }
            task.project = project as never;
        }

        if (title !== undefined) task.title = title.trim();
        if (description !== undefined) task.description = description.trim();
        if (status !== undefined) task.status = status;
        if (priority !== undefined) task.priority = priority;
        if (assignee !== undefined) {
            if (!isValidObjectId(assignee)) {
                res.status(400).json({ success: false, message: "Invalid assignee id" });
                return;
            }
            task.assignee = assignee as never;
        }
        if (dueDate !== undefined) {
            task.dueDate = dueDate ? new Date(dueDate) : undefined;
        }

        await task.save();
        res.status(200).json({ success: true, data: { task } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update task" });
    }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid task id" });
            return;
        }

        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }

        const projectAllowed = await canAccessProject(task.project.toString(), userId);
        if (!projectAllowed) {
            res.status(403).json({ success: false, message: "Forbidden" });
            return;
        }

        await task.deleteOne();
        res.status(200).json({ success: true, data: { message: "Task deleted" } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete task" });
    }
}