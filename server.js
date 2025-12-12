import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import progressRoutes from "./routes/progress.js";
import userRoutes from "./routes/users.js";
import langgananRoutes from "./routes/langganan.js";
import moduleRoutes from "./routes/modules.js";
import learningPathRoutes from "./routes/learningpath.js";

dotenv.config();
const app = express();

//middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL.split(","),
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json());

//routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/langganan", langgananRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/learning-paths", learningPathRoutes);

//root test
app.get("/", (req, res) => {
  res.json({ message: "Backend API running..." });
});

//run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
