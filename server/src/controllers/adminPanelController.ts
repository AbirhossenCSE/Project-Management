import type { Request, Response } from "express";
import User from "../models/User";

export async function updateUserRole(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { role } = req.body as { role?: string };

        if (role !== "admin" && role !== "member") {
            res.status(400).json({ success: false, message: "Role must be 'admin' or 'member' only" });
            return;
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

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
