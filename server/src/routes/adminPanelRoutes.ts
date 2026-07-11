import { Router, type Request, type Response, type NextFunction } from "express";
import { updateUserRole, deleteUser } from "../controllers/adminPanelController";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth";
import User from "../models/User";

const router = Router();

async function verifySuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const user = await User.findById(req.userId);
        if (!user || user.email !== "superadmin@gmail.com") {
            res.status(403).json({ success: false, message: "Access Denied - Restricted to Super Admin only" });
            return;
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error during verification" });
    }
}

router.use(requireAuth);
router.use((req, res, next) => {
    void verifySuperAdmin(req as AuthenticatedRequest, res, next);
});

// PATCH /admin-panel/users/:id/role
router.patch("/users/:id/role", updateUserRole);

// DELETE /admin-panel/users/:id
router.delete("/users/:id", requireAuth, deleteUser);

// GET /admin-panel/users
router.get("/users", async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: {
                users: users.map(u => ({
                    _id: u._id.toString(),
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    createdAt: u.createdAt,
                }))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
});

export default router;
