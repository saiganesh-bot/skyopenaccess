import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    cover_image_url: String,
    cover_image_public_id: String,
    about: String,
    aim_scope: String,
    author_guidelines: String
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Journal = mongoose.model("Journal", journalSchema);
