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