import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import progressRoutes from "./routes/progress.js";
import userRoutes from "./routes/users.js";
<<<<<<< HEAD
=======
import langgananRoutes from "./routes/langganan.js";
>>>>>>> bf24b3ea7fcbaff47c1419607bbf19d5d209c311

dotenv.config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
<<<<<<< HEAD
=======
app.use("/api/langganan", langgananRoutes);
>>>>>>> bf24b3ea7fcbaff47c1419607bbf19d5d209c311

//root test
app.get("/", (req, res) => {
  res.json({ message: "Backend API running..." });
});

//run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
