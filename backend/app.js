import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

dotenv.config({ path: "./config/config.env" });
const app = express();

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Allowed origins (for production hosting)
const allowedOrigins = [
  "https://main.d1sj7cd70hlter.amplifyapp.com",
  "https://expense-tracker-app-three-beryl.vercel.app",
  // add more origins if needed
];

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes (clean structure)
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/transactions", transactionRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello World! API is running 🚀");
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server is listening on http://localhost:${port}`);
});
