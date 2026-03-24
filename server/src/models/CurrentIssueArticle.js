import mongoose from "mongoose";

const currentIssueArticleSchema = new mongoose.Schema(
  {
    issue_id: { type: mongoose.Schema.Types.ObjectId, ref: "CurrentIssue", required: true, index: true },
    article_id: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true, index: true }
  },
  { timestamps: true }
);

export const CurrentIssueArticle = mongoose.model("CurrentIssueArticle", currentIssueArticleSchema);
