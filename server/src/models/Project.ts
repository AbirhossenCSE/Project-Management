import { model, models, Schema, type Document, type Types } from "mongoose";

export type ProjectStatus = "active" | "completed" | "on-hold";

export interface IProject extends Document {
    name: string;
    description: string;
    status: ProjectStatus;
    owner: Types.ObjectId;
    members: Types.ObjectId[];
    createdAt: Date;
}

const projectSchema = new Schema<IProject>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        status: {
            type: String,
            enum: ["active", "completed", "on-hold"],
            default: "active",
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

const Project = models.Project || model<IProject>("Project", projectSchema);

export default Project;