import express from "express";
import {
  getLangganan,
  addLangganan,
  updateLangganan,
  deleteLangganan,
} from "../controllers/langgananController.js";

const router = express.Router();

router.get("/", getLangganan);
router.post("/", addLangganan);
router.patch("/:id", updateLangganan);
router.delete("/:id", deleteLangganan);

export default router;