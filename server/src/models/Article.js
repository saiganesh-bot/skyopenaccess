import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    journal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Journal", required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    authors: { type: String, required: true },
    abstract: { type: String, required: true },
    pdf_url: String,
    pdf_public_id: String,
    format: String,
    external_link: String,
    doi_link: String
  },
  { timestamps: true }
);

export const Article = mongoose.model("Article", articleSchema);
