import mongoose from "mongoose";

const recentArticleSchema = new mongoose.Schema(
  {
    journal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Journal", required: true, index: true },
    title: { type: String, required: true },
    pdf_url: String,
    pdf_public_id: String
  },
  { timestamps: true }
);

export const RecentArticle = mongoose.model("RecentArticle", recentArticleSchema);
