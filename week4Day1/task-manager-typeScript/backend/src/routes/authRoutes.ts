import express from "express";
import { register, login } from "../controllers/authController";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           examples:
 *             success:
 *               summary: Valid registration request
 *               value:
 *                 email: john_doe@example.com
 *                 password: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Successful registration
 *                 value:
 *                   success: true
 *                   data:
 *                     email: john_doe@example.com
 *                   message: "User registered with email john_doe@example.com"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               validation:
 *                 summary: Missing fields
 *                 value:
 *                   success: false
 *                   data: null
 *                   message: "Email and password are required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Server error
 *                 value:
 *                   success: false
 *                   data: null
 *                   message: "An error occurred"
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           examples:
 *             success:
 *               summary: Valid login request
 *               value:
 *                 email: john_doe@example.com
 *                 password: password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Successful login
 *                 value:
 *                   success: true
 *                   data:
 *                     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTBmZTc4OWY4YzAxMjM0NTY3ODkwYSIsImlhdCI6MTcwNTEwODUyMCwiZXhwIjoxNzA1MTEyMTIwfQ.xyz123abc"
 *                   message: "Login successful"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             examples:
 *               notFound:
 *                 summary: User not found
 *                 value:
 *                   success: false
 *                   data: null
 *                   message: "john_doe@example.com not found"
 *       400:
 *         description: Validation error or Invalid credentials
 *         content:
 *           application/json:
 *             examples:
 *               invalidCredentials:
 *                 summary: Invalid password
 *                 value:
 *                   success: false
 *                   data: null
 *                   message: "Invalid Credentials"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Server error
 *                 value:
 *                   success: false
 *                   data: null
 *                   message: "An error occurred"
 */
router.post("/login", login);

export default router;