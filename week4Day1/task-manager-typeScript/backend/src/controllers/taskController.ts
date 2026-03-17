import {
  findTaskById,
  getAllTasks,
  findTasksByTitle,
  createTask,
  updateTaskById,
  deleteTaskById,
  getTaskStats,
} from "../utils/fileStorage";
import { constants } from "../middlewares/constants";
import { Request, Response, NextFunction } from "express";

const createTaskController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, completed } = req.body;
    if (!title || typeof completed !== "boolean") {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Task name and status is required");
    }
    const task = createTask(title, completed);
    res.status(201).json({ success: true, data: task, message: "Task created successfully" });
  } catch (err) {
    next(err);
  }
};

const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const task = findTaskById(taskId);

    if (!task) {
      res.status(constants.NOT_FOUND);
      throw new Error("Task not found");
    }

    res.status(200).json({ success: true, data: task, message: "Task retrieved successfully" });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, completed } = req.body;

    // Allow partial updates - at least one field must be provided
    if (!title && typeof completed !== "boolean") {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("At least title or status is required for update");
    }

    const updateData: { title?: string; completed?: boolean } = {};
    if (title) updateData.title = title;
    if (typeof completed === "boolean") updateData.completed = completed;

    const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const task = updateTaskById(taskId, updateData);

    if (!task) {
      res.status(constants.NOT_FOUND);
      throw new Error("Task not found");
    }

    res.status(200).json({ success: true, data: task, message: "Task updated successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const task = deleteTaskById(taskId);

    if (!task) {
      res.status(constants.NOT_FOUND);
      throw new Error("Task not found");
    }

    res.status(200).json({ success: true, data: task, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title } = req.query;
    let tasks: any[];
    
    if (title) {
      const titleStr = typeof title === 'string' ? title : String(title);
      tasks = findTasksByTitle(titleStr);
    } else {
      tasks = getAllTasks();
    }
    
    res.status(200).json({ success: true, data: tasks, message: "Tasks retrieved successfully" });
  } catch (err) {
    next(err);
  }
};

const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = getTaskStats();
    res.status(200).json({
      success: true,
      data: stats,
      message: "Stats retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { getTask, createTaskController, getTasks, updateTask, deleteTask, getStats };

export { getTask, createTaskController, getTasks, updateTask, deleteTask, getStats };