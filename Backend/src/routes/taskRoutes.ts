import express from 'express'
import { createTask, deleteTask, getTasks, searchTask, updateTask } from '../controller/taskController.js'

const taskRoutes = express.Router()

taskRoutes.post("/createtask",createTask)
taskRoutes.get("/gettasks",getTasks)
taskRoutes.put("/updatetask/:id",updateTask)
taskRoutes.get("/searchtask/:keyword",searchTask)
taskRoutes.delete("/deletetask/:id",deleteTask)

export default taskRoutes