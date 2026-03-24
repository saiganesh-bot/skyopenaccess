import mongoose from "mongoose";

const archiveArticleSchema = new mongoose.Schema(
  {
    volume_id: { type: mongoose.Schema.Types.ObjectId, ref: "ArchiveVolume", required: true, index: true },
    article_id: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true, index: true }
  },
  { timestamps: true }
);

export const ArchiveArticle = mongoose.model("ArchiveArticle", archiveArticleSchema);
