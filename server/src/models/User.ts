import { model, models, Schema, type Document } from "mongoose";

export type UserRole = "admin" | "member";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    avatar?: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member",
            required: true,
        },
        avatar: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

const User = models.User || model<IUser>("User", userSchema);

export default User;