require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(express.json());

// Configure CORS for production - allow multiple origins
const allowedOrigins = [
  "https://ecommerce-rust-chi-61.vercel.app",
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now to debug
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const authRouter = require("./routes/auth");
const ordersRouter = require("./routes/orders");
const authMiddleware = require("./middlewares/authMiddleware");

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/auth", authRouter);
app.use("/orders", ordersRouter);

const { auth } = authMiddleware;
app.get("/profile", auth, (req, res) => {
  res.status(200).json({ message: "Profile data", user: req.user });
});

const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
});
