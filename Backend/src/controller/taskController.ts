import Task from "../model/Task.js";
import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const getTasks = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "unAuthorized"
            })
        }

        const task = await Task.find({ user: req.userId });
        if (task.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Zero task found in database",
                data: []
            })
        }

        return res.status(200).json({
            success: true,
            message: "Task found",
            length: task.length,
            data: task,
        })

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while getting task from database " + err.message,
        })
    }
}

export const createTask = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { title, description, addedDate, dueDate, Status, taskAmount } = req.body;
        if (!title || !addedDate || !dueDate || !Status || !taskAmount) {
            return res.status(400).json({
                success: false,
                message: "Task title, addedDate, dueDate, Status and taskAmount are required for create new task",
            })
        }

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "unAuthorized"
            })
        }

        const task = new Task({ user: req.userId, title, description, addedDate, dueDate, Status, taskAmount });
        await task.save()

        return res.status(201).json({
            success: true,
            message: "Task added",
            data: task,
        })

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while add new task in database " + err.message,
        })
    }
}

export const updateTask = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { title, description, addedDate, dueDate, Status, taskAmount } = req.body;
        if (!title || !addedDate || !dueDate || !Status || !taskAmount) {
            return res.status(400).json({
                success: false,
                message: "Task title, addedDate, dueDate, Status and taskAmount are required for create new task",
            })
        }

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "unAuthorized"
            })
        }

        const task = await Task.findByIdAndUpdate({ user: req.userId, _id: req.params.id }, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Task updated",
            data: task
        })
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while updatetask " + err.message,
        })
    }
}

    export const searchTask = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            const keyword = req.params.keyword as any;
            if (!req.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'unAuthorized'
                })
            }

            if (!keyword || keyword.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Search keyword are required"
                })
            }

            const task = await Task.find({
                user: req.userId,
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { Status: { $regex: keyword, $options: "i" } }
                ]
            })

            if (task.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "Zero task found by search keyword",
                    data: []
                })
            }

            return res.status(200).json({
                success: true,
                message: "Task's founded",
                count:task.length,
                data: task
            })
        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: "Internal server error while search task " + err.message
            })
        }
    }


export const deleteTask = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "unAuthorized"
            })
        }

        const task = await Task.findByIdAndDelete({ _id: req.params.id, user: req.userId })
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted",
            data: task,
        })
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while delete task " + err.message,
        })
    }
}