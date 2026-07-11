import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth";
import User from "../models/User";

export async function updateUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { role } = req.body as { role?: string };

        if (role !== "admin" && role !== "member") {
            res.status(400).json({ success: false, message: "Role must be 'admin' or 'member' only" });
            return;
        }

        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        if (user.email === "superadmin@gmail.com") {
            res.status(400).json({ success: false, message: "Cannot change Super Admin role" });
            return;
        }

        user.role = role as "admin" | "member";
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    createdAt: user.createdAt,
                },
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update user role" });
    }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const loggedInUserId = req.userId || (typeof req.user === "object" ? (req.user as any)?.id : null);

        if (id === loggedInUserId) {
            res.status(400).json({ success: false, message: "Cannot delete yourself" });
            return;
        }

        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        if (user.email === "superadmin@gmail.com") {
            res.status(400).json({ success: false, message: "Cannot delete Super Admin account" });
            return;
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete user" });
    }
}

