import express from "express";
import rateLimit from "express-rate-limit";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { myResults } from "../controllers/chatController";
import {
  getQuestions,
  submitAnswers,
  listResults,
  downloadResult,
} from "../controllers/chatController";

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 14,
  message: { error: "Previše zahtjeva, pokušaj za minutu." },
});

router.get("/questions", requireAuth, chatLimiter, getQuestions);
router.post("/submit", requireAuth, chatLimiter, submitAnswers);

router.get("/admin/rezultati", requireAuth, requireAdmin, listResults);
router.get("/admin/rezultati/:id", requireAuth, requireAdmin, downloadResult);
router.get("/moji-rezultati", requireAuth, myResults);
export default router;