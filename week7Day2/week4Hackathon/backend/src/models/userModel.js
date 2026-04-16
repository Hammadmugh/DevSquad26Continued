const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Subscription fields
    subscriptionPlanId: {
      type: String,
      default: null,
    },
    subscriptionPlanName: {
      type: String,
      enum: ["Basic", "Standard", "Premium"],
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: null,
    },
    subscriptionStartDate: {
      type: Date,
      default: null,
    },
    trialEndDate: {
      type: Date,
      default: null, // 7 days from subscription start date
    },
    cardLastFour: {
      type: String,
      default: null, // Store only last 4 digits for security
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);