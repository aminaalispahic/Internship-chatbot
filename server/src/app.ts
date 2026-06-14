import express from "express";
import authRoutes from "./routes/auth";
import chatRoutes from "./routes/chat";
import adminRoutes from "./routes/admin";
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
export default app;