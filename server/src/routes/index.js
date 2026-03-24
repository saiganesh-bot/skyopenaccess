import { Router } from "express";
import authRoutes from "./authRoutes.js";
import contentRoutes from "./contentRoutes.js";
import journalRoutes from "./journalRoutes.js";
import logoRoutes from "./logoRoutes.js";
import submissionRoutes from "./submissionRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/journals", journalRoutes);
router.use("/logos", logoRoutes);
router.use("/submissions", submissionRoutes);
router.use("/content", contentRoutes);

export default router;
