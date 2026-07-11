import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/User";
import type { AuthenticatedRequest } from "../middleware/auth";

type SafeUser = {
    id: string;
    name: string;
    email: string;
    role: "admin" | "member";
    avatar?: string;
    createdAt: Date;
};

function formatUser(user: {
    _id: { toString(): string };
    name: string;
    email: string;
    role: "admin" | "member";
    avatar?: string;
    createdAt: Date;
}): SafeUser {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
    };
}

function signToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
}

export async function register(req: Request, res: Response): Promise<void> {
    try {
        const { name, email, password, role, avatar } = req.body as {
            name?: string;
            email?: string;
            password?: string;
            role?: "admin" | "member";
            avatar?: string;
        };

        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: "name, email, and password are required" });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail }).lean();

        if (existingUser) {
            res.status(409).json({ success: false, message: "Email is already registered" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        let finalRole: "admin" | "member" = "member";
        const superAdminSecret = process.env.SUPER_ADMIN_SECRET;
        const secretHeader = req.header("super-admin-secret") || req.header("super_admin_secret") || req.header("SUPER_ADMIN_SECRET");

        if (role === "admin" && superAdminSecret && secretHeader === superAdminSecret) {
            finalRole = "admin";
        }

        const createdUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: finalRole,
            avatar: avatar ?? "",
        });

        const token = signToken(createdUser._id.toString());
        res.status(201).json({
            success: true,
            data: {
                token,
                user: formatUser(createdUser),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to register user" });
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body as {
            email?: string;
            password?: string;
        };

        if (!email || !password) {
            res.status(400).json({ success: false, message: "email and password are required" });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail }).select("+password");

        if (!user || !user.password) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }

        const token = signToken(user._id.toString());
        res.status(200).json({
            success: true,
            data: {
                token,
                user: formatUser(user),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to login" });
    }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                user: formatUser(user),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch current user" });
    }
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
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

export async function deleteUser(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

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