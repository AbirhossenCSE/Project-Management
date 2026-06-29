import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    userId?: string;
    user?: string | jwt.JwtPayload;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "Missing or invalid authorization header" });
        return;
    }

    const token = authHeader.slice(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500).json({ success: false, message: "JWT_SECRET is not configured" });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;

        if (typeof decoded === "object" && decoded && typeof decoded.id === "string") {
            req.userId = decoded.id;
            next();
            return;
        }

        res.status(401).json({ success: false, message: "Invalid token payload" });
        return;
    } catch {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
        return;
    }
}
