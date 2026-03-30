const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { uploadMovie, getCloudinarySignature, saveMovieWithUrls } = require("../controllers/uploadController");

// NEW: Get Cloudinary signature for direct frontend uploads (requires admin)
router.post("/signature", adminMiddleware, getCloudinarySignature);

// NEW: Save movie with pre-uploaded URLs (requires admin)
router.post("/save", adminMiddleware, saveMovieWithUrls);

// LEGACY: Upload movie/show with files (requires admin)
router.post("/movie", adminMiddleware, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "trailer", maxCount: 1 },
  { name: "banner", maxCount: 1 }
]), uploadMovie);

module.exports = router;
