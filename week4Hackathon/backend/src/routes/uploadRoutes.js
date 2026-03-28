const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { uploadMovie } = require("../controllers/uploadController");

// All routes require admin authentication
router.use(adminMiddleware);

// Upload movie/show with poster image, trailer and banner
router.post("/movie", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "trailer", maxCount: 1 },
  { name: "banner", maxCount: 1 }
]), uploadMovie);

module.exports = router;
