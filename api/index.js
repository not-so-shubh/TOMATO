const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const serverless = require("serverless-http");

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://tomato-kq5w.vercel.app"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
// DO NOT use express.static for uploads in serverless
// app.use("/uploads", express.static("uploads"));

// Import routes from the backend
const userRoutes = require("../backend/routes/userRoutes");
const restaurantRoutes = require("../backend/routes/restaurantRoutes");
const foodRoutes = require("../backend/routes/foodRoutes");
const cartRoutes = require("../backend/routes/cartRoutes");
const orderRoutes = require("../backend/routes/orderRoutes");
const adminRoutes = require("../backend/routes/adminRoutes");

app.use("/api/users", userRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Use a single MongoDB connection across invocations
let isConnected = false;
async function connectMongo() {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
  }
}

app.use(async (req, res, next) => {
  await connectMongo();
  next();
});

module.exports = serverless(app);