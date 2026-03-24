import mongoose from "mongoose";

const articleInPressSchema = new mongoose.Schema(
  {
    journal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Journal", required: true, index: true },
    article_id: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true, index: true }
  },
  { timestamps: true }
);

export const ArticleInPress = mongoose.model("ArticleInPress", articleInPressSchema);
