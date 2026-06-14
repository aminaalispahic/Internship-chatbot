import express from "express";
import rateLimit from "express-rate-limit";
import { register, verifyEmail, login, verify2FA } from "../controllers/authController";
import { getPublicKey } from "../services/rsaService";

const router = express.Router();

const otpLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

router.get("/public-key", (req, res) => res.json({ publicKey: getPublicKey() }));
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/verify-2fa", otpLimiter, verify2FA);

export default router;