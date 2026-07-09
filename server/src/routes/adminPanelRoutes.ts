import { Router, type Request, type Response, type NextFunction } from "express";
import { updateUserRole } from "../controllers/adminPanelController";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth";
import User from "../models/User";

const router = Router();

function verifySuperAdmin(req: Request, res: Response, next: NextFunction): void {
    const superAdminSecret = process.env.SUPER_ADMIN_SECRET;
    const headerVal = req.header("X-Super-Admin");

    if (!superAdminSecret || headerVal !== superAdminSecret) {
        res.status(403).json({ success: false, message: "Unauthorized" });
        return;
    }
    next();
}

router.use(verifySuperAdmin);

// PATCH /admin-panel/users/:id/role
router.patch("/users/:id/role", updateUserRole);

// DELETE /admin-panel/users/:id
router.delete("/users/:id", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const loggedInUserId = req.userId || (typeof req.user === "object" ? (req.user as any)?.id : null);

        if (id === loggedInUserId) {
            res.status(400).json({ success: false, message: "Cannot delete yourself" });
            return;
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete user" });
    }
});

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
