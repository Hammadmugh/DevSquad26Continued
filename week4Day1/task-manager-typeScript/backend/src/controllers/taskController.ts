import TaskModel from "../models/taskModel";
import { constants } from "../middlewares/constants";
import { Request, Response, NextFunction } from "express";

const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, completed } = req.body;
    if (!title || typeof completed !== "boolean") {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Task name and status is required");
    }
    const model = new TaskModel({ title, completed, user: (req as any).user.id });
    await model.save();
    res.status(201).json({ success: true, data: model, message: "Task created successfully" });
  } catch (err) {
    next(err);
  }
};
const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await TaskModel.findOne({
      _id: req.params.id,
      user: (req as any).user.id,
    });

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

    const task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, user: (req as any).user.id },
      updateData,
      { new: true }
    );

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
    const task = await TaskModel.findOneAndDelete({
      _id: req.params.id,
      user: (req as any).user.id,
    });

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
    let query: any = { user: (req as any).user.id };
    
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    
    const tasks = await TaskModel.find(query);
     if (tasks.length === 0) {
      res.status(constants.NOT_FOUND);
      throw new Error("Tasks not found");
    }
    res.status(200).json({ success: true, data: tasks, message: "Tasks retrieved successfully" });
  } catch (err) {
    next(err);
  }
};
const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalTasks = await TaskModel.countDocuments({ user: (req as any).user.id });
    const completedTasks = await TaskModel.countDocuments({
      user: (req as any).user.id,
      completed: true,
    });
    const pendingTasks = totalTasks - completedTasks;

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
      },
      message: "Stats retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { getTask, createTask, getTasks, updateTask, deleteTask, getStats };

export { getTask, createTask, getTasks, updateTask, deleteTask, getStats };