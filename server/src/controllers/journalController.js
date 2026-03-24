import { cloudinary } from "../config/cloudinary.js";
import { Journal } from "../models/Journal.js";
import { cacheInvalidateByPrefix } from "../middlewares/cache.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

export const getJournals = asyncHandler(async (req, res) => {
  const journals = await Journal.find().sort({ created_at: -1 });
  res.status(200).json({ journals });
});

export const getJournalBySlug = asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({ slug: req.params.slug });
  if (!journal) return res.status(404).json({ message: "Journal not found" });
  res.status(200).json({ journal });
});

export const createJournal = asyncHandler(async (req, res) => {
  const { title, about, aim_scope, author_guidelines } = req.body;
  const slug = slugify(title);

  const exists = await Journal.findOne({ slug });
  if (exists) {
    return res.status(409).json({ message: "Journal with this title already exists" });
  }

  let upload;
  if (req.file?.buffer) {
    upload = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "journals/covers",
      resource_type: "image"
    });
  }

  const journal = await Journal.create({
    title,
    slug,
    about,
    aim_scope,
    author_guidelines,
    cover_image_url: upload?.secure_url,
    cover_image_public_id: upload?.public_id
  });

  cacheInvalidateByPrefix("journals:");
  res.status(201).json({ journal });
});

export const updateJournal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const journal = await Journal.findById(id);
  if (!journal) return res.status(404).json({ message: "Journal not found" });

  const { title, about, aim_scope, author_guidelines } = req.body;

  if (title && title !== journal.title) {
    journal.slug = slugify(title);
    journal.title = title;
  }

  if (typeof about === "string") journal.about = about;
  if (typeof aim_scope === "string") journal.aim_scope = aim_scope;
  if (typeof author_guidelines === "string") journal.author_guidelines = author_guidelines;

  if (req.file?.buffer) {
    const upload = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "journals/covers",
      resource_type: "image"
    });
    if (journal.cover_image_public_id) {
      await cloudinary.uploader.destroy(journal.cover_image_public_id, { resource_type: "image" });
    }
    journal.cover_image_url = upload.secure_url;
    journal.cover_image_public_id = upload.public_id;
  }

  await journal.save();
  cacheInvalidateByPrefix("journals:");

  res.status(200).json({ journal });
});

export const deleteJournal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const journal = await Journal.findById(id);
  if (!journal) return res.status(404).json({ message: "Journal not found" });

  if (journal.cover_image_public_id) {
    await cloudinary.uploader.destroy(journal.cover_image_public_id, { resource_type: "image" });
  }

  await journal.deleteOne();
  cacheInvalidateByPrefix("journals:");
  res.status(200).json({ message: "Journal deleted" });
});
