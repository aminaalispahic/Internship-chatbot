import express from "express";
import { addKomentar, listResults, downloadResult } from "../controllers/adminController";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

// Sve admin rute su zaštićene adminMiddlewareom
router.get("/rezultati", adminMiddleware, listResults);
router.get("/rezultati/:id", adminMiddleware, downloadResult);
router.post("/rezultati/:id/komentar", adminMiddleware, addKomentar);

export default router;