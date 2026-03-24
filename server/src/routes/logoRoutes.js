import { Router } from "express";
import { createLogo, deleteLogo, getLogos } from "../controllers/logoController.js";
import { adminOnly, protect } from "../middlewares/auth.js";
import { imageUpload } from "../middlewares/upload.js";

const router = Router();

router.get("/", getLogos);
router.post("/", protect, adminOnly, imageUpload.single("logo"), createLogo);
router.delete("/:id", protect, adminOnly, deleteLogo);

export default router;
