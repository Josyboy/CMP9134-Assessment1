import { Router } from "express";
import { authGuard } from "../middleware/authGuard.js";
import { getAuditEntries } from "../controllers/auditController.js";

const router = Router();

router.get("/", authGuard, getAuditEntries);

export default router;
