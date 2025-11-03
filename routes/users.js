import express from "express";
import {
  getUsers,
  getChartData,
  addUser,
} from "../controllers/userControllers.js";
import { validateUser } from "../middleware/validateUser.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/chart/:id", getChartData);
router.post("/", validateUser, addUser);

export default router;
<<<<<<< HEAD

// buat atur user
=======
>>>>>>> bf24b3ea7fcbaff47c1419607bbf19d5d209c311
