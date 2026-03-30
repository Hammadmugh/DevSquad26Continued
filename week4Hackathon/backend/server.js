const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();

const app = express();

// Load database connection asynchronously
const dbConnect = require("./src/config/dbConnect");
dbConnect().catch(err => console.error("❌ DB Connection Error:", err));

const authRoutes = require("./src/routes/authRoutes");
const movieRoutes = require("./src/routes/movieRoutes.js");
const adminRoutes = require("./src/routes/adminRoutes.js");
const uploadRoutes = require("./src/routes/uploadRoutes.js");
const errorHandler = require("./src/middlewares/errorHandler");

// ===== CORS Configuration =====
const corsOptions = {
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  optionsSuccessStatus: 200
};

// ===== Middleware - CRITICAL ORDER =====
// 1. CORS preflight handler FIRST
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 2. Apply cors middleware
app.use(cors(corsOptions));

// 3. Body parsing
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// ===== Health Check Route (NO DB DEPENDENCY) =====
app.get("/api/health", (req, res) => {
  res.json({
    status: "✅ Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production"
  });
});

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// ===== Error Handler =====
app.use(errorHandler);

// ===== Export for Vercel and Local Development =====
const PORT = process.env.PORT || 3000;

// Only start server locally, not on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;