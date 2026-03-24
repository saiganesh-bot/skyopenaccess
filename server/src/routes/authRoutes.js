import { Router } from "express";
import {
	loginAdmin,
	me,
	resendAdminVerification,
	setupFirstAdmin,
	verifyAdminEmail,
	verifyAdminTwoFactor
} from "../controllers/authController.js";
import { adminOnly, protect } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/setup-admin", setupFirstAdmin);
router.post("/login", authLimiter, loginAdmin);
router.post("/verify-email", authLimiter, verifyAdminEmail);
router.post("/resend-verification", authLimiter, resendAdminVerification);
router.post("/verify-2fa", authLimiter, verifyAdminTwoFactor);
router.get("/me", protect, adminOnly, me);

export default router;
