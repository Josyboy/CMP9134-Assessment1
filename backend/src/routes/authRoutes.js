import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";

const router = Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.post("/signout", logoutUser);

export default router;
