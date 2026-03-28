const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file at the root of backend folder
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");
const Movie = require("../models/movieModel");
const seedData = require("./seedData.json");

const seed = async () => {
  try {
    const connectionString = process.env.CONNECTION_STRING;
    
    if (!connectionString) {
      console.log("❌ CONNECTION_STRING not found in environment variables");
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(connectionString);
    console.log("✅ Connected to MongoDB");

    // Clear existing movies
    await Movie.deleteMany({});
    console.log("🗑️  Cleared existing movie data");

    // Insert seed data
    const insertedMovies = await Movie.insertMany(seedData.movies);
    console.log(`✅ Successfully seeded ${insertedMovies.length} movies to database`);

    // Disconnect
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
