const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/userModel");
const { constants } = require("../middlewares/constants");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Email and password are required");
    }
    
    if (!validator.isEmail(email)) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Invalid email format");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ 
      success: true, 
      data: { email: newUser.email },
      message: `User registered with email ${email}` 
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Email and password are required");
    }
    
    if (!validator.isEmail(email)) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Invalid email format");
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(constants.NOT_FOUND);
      throw new Error(`${email} not found`);
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Invalid Credentials");
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ 
      success: true, 
      data: { token, user: { id: user._id, email: user.email, role: user.role } }, 
      message: "Login successful" 
    });
  } catch (err) {
    next(err);
  }
};

const subscribe = async (req, res, next) => {
  try {
    const { planId, planName, cardDetails } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate input
    if (!planId || !planName || !cardDetails) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Plan information and card details are required");
    }

    if (!cardDetails.cardholderName || !cardDetails.cardNumber || !cardDetails.expiryDate) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Complete card details are required");
    }

    // Find user and update subscription
    const user = await User.findById(userId);
    if (!user) {
      res.status(constants.NOT_FOUND);
      throw new Error("User not found");
    }

    // Set subscription fields
    const startDate = new Date();
    const trialEndDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    user.subscriptionPlanId = planId;
    user.subscriptionPlanName = planName;
    user.subscriptionStatus = "active";
    user.subscriptionStartDate = startDate;
    user.trialEndDate = trialEndDate;
    user.cardLastFour = cardDetails.cardNumber; // Already last 4 digits from frontend
    user.subscriptionEndDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    await user.save();

    console.log("✅ User subscription updated:", user.email, planName);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          subscriptionPlanName: user.subscriptionPlanName,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionStartDate: user.subscriptionStartDate,
          trialEndDate: user.trialEndDate,
        },
      },
      message: `Successfully subscribed to ${planName} plan`,
    });
  } catch (err) {
    next(err);
  }
};

// Get user profile with subscription data
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(constants.NOT_FOUND);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          subscriptionPlanId: user.subscriptionPlanId,
          subscriptionPlanName: user.subscriptionPlanName,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionStartDate: user.subscriptionStartDate,
          subscriptionEndDate: user.subscriptionEndDate,
          trialEndDate: user.trialEndDate,
        },
      },
      message: "Profile retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, subscribe, getProfile };