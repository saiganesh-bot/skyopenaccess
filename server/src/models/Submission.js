import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    article_type: {
      type: String,
      enum: ["Research", "Review", "Case Study", "Short Communication", "Editorial", "Other"],
      required: true
    },
    manuscript_title: { type: String, required: true },
    journal_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Journal", required: true }],
    country: { type: String, required: true },
    abstract: {
      type: String,
      required: true,
      minlength: 150,
      maxlength: 3000
    },
    manuscript_url: { type: String, required: true },
    manuscript_public_id: { type: String, required: true },
    manuscript_format: { type: String, required: true },
    status: {
      type: String,
      enum: ["received", "under_review", "accepted", "published", "rejected"],
      default: "received"
    }
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", submissionSchema);
