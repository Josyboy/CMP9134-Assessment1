import { Router } from "express";
import { authGuard } from "../middleware/authGuard.js";
import { getUsers, updateUserRole } from "../controllers/userController.js";

const router = Router();

router.get("/", authGuard, getUsers);
router.patch("/:id/role", authGuard, updateUserRole);

export default router;
