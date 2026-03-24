import { Router } from "express";
import {
  createJournal,
  deleteJournal,
  getJournalBySlug,
  getJournals,
  updateJournal
} from "../controllers/journalController.js";
import { adminOnly, protect } from "../middlewares/auth.js";
import { cacheGet } from "../middlewares/cache.js";
import { imageUpload } from "../middlewares/upload.js";

const router = Router();

router.get("/", cacheGet(() => "journals:list"), getJournals);
router.get("/:slug", cacheGet((req) => `journals:slug:${req.params.slug}`), getJournalBySlug);

router.post("/", protect, adminOnly, imageUpload.single("cover"), createJournal);
router.put("/:id", protect, adminOnly, imageUpload.single("cover"), updateJournal);
router.delete("/:id", protect, adminOnly, deleteJournal);

export default router;
