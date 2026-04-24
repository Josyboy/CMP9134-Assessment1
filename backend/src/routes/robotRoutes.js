import { Router } from "express";
import { authGuard } from "../middleware/authGuard.js";
import {
  getRobotStatus,
  moveRobot,
  resetRobot,
  getRobotMap,
  getRobotSensors,
} from "../controllers/robotController.js";

const router = Router();

router.get("/status", authGuard, getRobotStatus);
router.post("/move", authGuard, moveRobot);
router.post("/reset", authGuard, resetRobot);
router.get("/map", authGuard, getRobotMap);
router.get("/sensor", authGuard, getRobotSensors);

export default router;
