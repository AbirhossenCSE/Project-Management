import { model, models, Schema, type Document, type Types } from "mongoose";

export type SprintStatus = "planning" | "active" | "completed";

export interface ISprint extends Document {
    name: string;
    project: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    status: SprintStatus;
    tasks: Types.ObjectId[];
    createdAt: Date;
}

const sprintSchema = new Schema<ISprint>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 120,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["planning", "active", "completed"],
            default: "planning",
            required: true,
        },
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

const Sprint = models.Sprint || model<ISprint>("Sprint", sprintSchema);

export default Sprint;