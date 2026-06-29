import { model, models, Schema, type Document, type Types } from "mongoose";

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends Document {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: Types.ObjectId;
    project: Types.ObjectId;
    dueDate?: Date;
    createdAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 4000,
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "done"],
            default: "todo",
            required: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
            required: true,
        },
        assignee: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        dueDate: {
            type: Date,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

const Task = models.Task || model<ITask>("Task", taskSchema);

export default Task;