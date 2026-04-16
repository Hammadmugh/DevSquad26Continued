import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "A RESTful API for managing tasks with user authentication using JWT",
      contact: {
        name: "DevSquad",
      },
    },
    servers: [
      {
        url: "https://dev-squad26-week4day1-backend.vercel.app",
        description: "Production server",
      },
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            email: {
              type: "string",
              example: "john_doe@example.com",
            },
            password: {
              type: "string",
              example: "hashedPassword123",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Task: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439012",
            },
            title: {
              type: "string",
              example: "Learn Node.js",
            },
            completed: {
              type: "boolean",
              example: false,
            },
            user: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
            },
            message: {
              type: "string",
            },
          },
        },
        Stats: {
          type: "object",
          properties: {
            totalTasks: {
              type: "number",
              example: 10,
            },
            completedTasks: {
              type: "number",
              example: 7,
            },
            pendingTasks: {
              type: "number",
              example: 3,
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.ts")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;