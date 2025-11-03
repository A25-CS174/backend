import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import progressRoutes from "./routes/progress.js";
import userRoutes from "./routes/users.js";
import langgananRoutes from "./routes/langganan.js";
import moduleRoutes from "./routes/modules.js";

dotenv.config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/langganan", langgananRoutes);
app.use("/api/modules", moduleRoutes);

//root test
app.get("/", (req, res) => {
  res.json({ message: "Backend API running..." });
});

//run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
