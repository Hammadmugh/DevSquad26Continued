import express from "express";
import verifyToken from "../middlewares/authMiddleware";
import {
  getTask,
  createTaskController,
  getTasks,
  updateTask,
  deleteTask,
  getStats,
} from "../controllers/taskController";

const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for authenticated user (with optional search by title)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search tasks by title (case-insensitive)
 *         example: "learn"
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *             examples:
 *               success:
 *                 summary: Tasks retrieved successfully
 *                 value:
 *                   success: true
 *                   data:
 *                     - _id: "65a0fe789f8c01234567890a"
 *                       title: "Learn Node.js"
 *                       completed: false
 *                       user: "65a0fe789f8c01234567890b"
 *                     - _id: "65a0fe789f8c01234567890c"
 *                       title: "Learn Express"
 *                       completed: true
 *                       user: "65a0fe789f8c01234567890b"
 *                   message: "Tasks retrieved successfully"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             examples:
 *               noToken:
 *                 summary: Missing token
 *                 value:
 *                   message: "No token, autherization denied"
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - completed
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *           examples:
 *             success:
 *               summary: Valid task creation request
 *               value:
 *                 title: "Learn Node.js"
 *                 completed: false
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *             examples:
 *               success:
 *                 summary: Task created successfully
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "65a0fe789f8c01234567890a"
 *                     title: "Learn Node.js"
 *                     completed: false
 *                     user: "65a0fe789f8c01234567890b"
 *                   message: "Task created successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               validation:
 *                 summary: Missing required fields
 *                 value:
 *                   message: "Task name and status is required"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.route("/").get(verifyToken, getTasks).post(verifyToken, createTaskController);

/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: Get task statistics (total, completed, pending)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Stats'
 *                 message:
 *                   type: string
 *             examples:
 *               success:
 *                 summary: Stats retrieved successfully
 *                 value:
 *                   success: true
 *                   data:
 *                     totalTasks: 10
 *                     completedTasks: 7
 *                     pendingTasks: 3
 *                   message: "Stats retrieved successfully"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */
router.route("/stats").get(verifyToken, getStats);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *             examples:
 *               success:
 *                 summary: Task retrieved successfully
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "65a0fe789f8c01234567890a"
 *                     title: "Learn Node.js"
 *                     completed: false
 *                     user: "65a0fe789f8c01234567890b"
 *                   message: "Task retrieved successfully"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             examples:
 *               notFound:
 *                 summary: Task not found
 *                 value:
 *                   message: "Task not found"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - completed
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *           examples:
 *             success:
 *               summary: Valid task update request
 *               value:
 *                 title: "Learn Node.js & Express"
 *                 completed: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *             examples:
 *               success:
 *                 summary: Task updated successfully
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "65a0fe789f8c01234567890a"
 *                     title: "Learn Node.js & Express"
 *                     completed: true
 *                     user: "65a0fe789f8c01234567890b"
 *                   message: "Task updated successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               validation:
 *                 summary: Missing required fields
 *                 value:
 *                   message: "Task name and status is required for update"
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *             examples:
 *               success:
 *                 summary: Task deleted successfully
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "65a0fe789f8c01234567890a"
 *                     title: "Learn Node.js"
 *                     completed: false
 *                     user: "65a0fe789f8c01234567890b"
 *                   message: "Task deleted successfully"
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router
  .route("/:id")
  .get(verifyToken, getTask)
  .put(verifyToken, updateTask)
  .delete(verifyToken, deleteTask);

export default router;