import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import robotRoutes from "./routes/robotRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/robot", robotRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/users", userRoutes);

export default app;
