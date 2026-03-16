import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import errorHandler from "../src/middlewares/errorHandler";
import "dotenv/config";
import authRoutes from "../src/routes/authRoutes";
import taskRoutes from "../src/routes/taskRoutes";
import dbConnect from "../src/config/dbConnect";
const app = express();

dbConnect();

// Middleware
app.use(cors());
app.use(express.json());

// CORS Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Task Manager API Docs",
    swaggerOptions: { persistAuthorization: true },
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-standalone-preset.js",
    ],
  }),
);

// Serve Swagger JSON
app.get("/swagger-json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Error Handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});