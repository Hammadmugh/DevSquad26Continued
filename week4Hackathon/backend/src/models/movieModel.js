const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a movie title"],
      trim: true,
    },
    description: {
      type: String,
      default: "A captivating story filled with drama, action, and emotions.",
    },
    image: {
      type: String,
      required: [true, "Please provide a movie image URL"],
    },
    bannerUrl: {
      type: String,
      default: null,
    },
    trailerUrl: {
      type: String,
      default: null,
    },
    duration: {
      type: String,
      default: "2h 30min",
    },
    views: {
      type: String,
      default: "1K",
    },
    seasons: {
      type: String,
      default: null,
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: String,
      default: "4.5",
    },
    genres: {
      type: [String],
      default: ["Drama"],
    },
    director: {
      type: String,
      default: "Unknown",
    },
    cast: {
      type: [String],
      default: [],
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    languages: {
      type: [String],
      default: ["English"],
    },
    contentType: {
      type: String,
      enum: ["movie", "show"],
      default: "movie",
    },
    pillType: {
      type: String,
      enum: ["views", "seasons"],
      default: "views",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views_count: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", movieSchema);
