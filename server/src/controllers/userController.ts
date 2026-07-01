import type { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth";
import User from "../models/User";

function formatUser(user: {
    _id: { toString(): string };
    name: string;
    email: string;
    role: "admin" | "member";
    avatar?: string;
    createdAt: Date;
}) {
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
    };
}

export async function getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const currentUserId = req.userId;
        if (!currentUserId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const currentUser = await User.findById(currentUserId).select("role");
        if (!currentUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        if (currentUser.role !== "admin") {
            res.status(403).json({ success: false, message: "Forbidden" });
            return;
        }

        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                users: users.map(formatUser),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
}