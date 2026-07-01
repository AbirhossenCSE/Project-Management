import type { Response } from "express";
import { isValidObjectId } from "mongoose";

import type { AuthenticatedRequest } from "../middleware/auth";
import Project from "../models/Project";

export async function createProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { name, description, status, members } = req.body as {
            name?: string;
            description?: string;
            status?: "active" | "completed" | "on-hold";
            members?: string[];
        };

        if (!name || !description) {
            res.status(400).json({ success: false, message: "name and description are required" });
            return;
        }

        const validatedMembers = Array.isArray(members)
            ? [...new Set(members.filter((id) => typeof id === "string" && isValidObjectId(id)))]
            : [];

        if (!validatedMembers.includes(userId)) {
            validatedMembers.push(userId);
        }

        const project = await Project.create({
            name: name.trim(),
            description: description.trim(),
            status: status ?? "active",
            owner: userId,
            members: validatedMembers,
        });

        res.status(201).json({ success: true, data: { project } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create project" });
    }
}

export async function getProjects(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const projects = await Project.find({
            $or: [{ owner: userId }, { members: userId }],
        })
            .sort({ createdAt: -1 })
            .populate("owner", "name email role avatar")
            .populate("members", "name email role avatar");

        res.status(200).json({ success: true, data: { projects } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch projects" });
    }
}

export async function getProjectById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid project id" });
            return;
        }

        const project = await Project.findById(id)
            .populate("owner", "name email role avatar")
            .populate("members", "name email role avatar");

        if (!project) {
            res.status(404).json({ success: false, message: "Project not found" });
            return;
        }

        const isOwner = project.owner && project.owner._id?.toString() === userId;
        const isMember = project.members.some((member: unknown) => {
            if (typeof member === "object" && member && "_id" in member) {
                const value = member as { _id: { toString(): string } };
                return value._id.toString() === userId;
            }
            return member?.toString() === userId;
        });

        if (!isOwner && !isMember) {
            res.status(403).json({ success: false, message: "Forbidden" });
            return;
        }

        res.status(200).json({ success: true, data: { project } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch project" });
    }
}

export async function updateProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid project id" });
            return;
        }

        const project = await Project.findById(id);
        if (!project) {
            res.status(404).json({ success: false, message: "Project not found" });
            return;
        }

        if (project.owner.toString() !== userId) {
            res.status(403).json({ success: false, message: "Only the project owner can update this project" });
            return;
        }

        const { name, description, status, members } = req.body as {
            name?: string;
            description?: string;
            status?: "active" | "completed" | "on-hold";
            members?: string[];
        };

        if (name !== undefined) project.name = name.trim();
        if (description !== undefined) project.description = description.trim();
        if (status !== undefined) project.status = status;
        if (members !== undefined) {
            const validatedMembers = [...new Set(members.filter((memberId) => isValidObjectId(memberId)))];
            if (!validatedMembers.includes(userId)) {
                validatedMembers.push(userId);
            }
            project.members = validatedMembers as never;
        }

        await project.save();
        res.status(200).json({ success: true, data: { project } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update project" });
    }
}

export async function deleteProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid project id" });
            return;
        }

        const project = await Project.findById(id);
        if (!project) {
            res.status(404).json({ success: false, message: "Project not found" });
            return;
        }

        if (project.owner.toString() !== userId) {
            res.status(403).json({ success: false, message: "Only the project owner can delete this project" });
            return;
        }

        await project.deleteOne();
        res.status(200).json({ success: true, data: { message: "Project deleted" } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete project" });
    }
}