import mongoose, { Document, Schema } from "mongoose";

interface ITASK extends Document {
    user: mongoose.Types.ObjectId,
    title: string,
    description?: string,
    addedDate: string,
    dueDate: string,
    Status: "Pending" | "Completed" | "inCompleted"
    taskAmount: number,
}

const taskSchema = new mongoose.Schema<ITASK>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: [true, "Task title are required"],
        minlength: [3, "Task title length must be at least 3 character's"],
        trim: true
    },
    description: {
        type: String,
    },
    addedDate: {
        type: String,
        required: [true, "Task addedDate are required"],
    },
    dueDate: {
        type: String,
        required: [true, "Task dueDate are required"],
    },
    Status: {
        type: String,
        enum: ["Pending", "Completed", "inCompleted"],
        required: [true, "Task status are required"],
    },
    taskAmount: {
        type: Number,
        required: [true, "Task amount are required"],
    }
}, { timestamps: true })

const Task = mongoose.model<ITASK>("Task", taskSchema)
export default Task;