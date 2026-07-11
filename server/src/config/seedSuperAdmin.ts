import bcrypt from "bcryptjs";
import User from "../models/User";

export async function seedSuperAdmin(): Promise<void> {
    try {
        const email = "superadmin@gmail.com";
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            const hashedPassword = await bcrypt.hash("Superadmin@123", 12);
            await User.create({
                name: "Super Admin",
                email,
                password: hashedPassword,
                role: "admin",
            });
        }
        console.log("Super Admin account ready");
    } catch (error) {
        console.error("Failed to seed Super Admin account:", error);
    }
}

export default seedSuperAdmin;
