import mongoose from "mongoose";

const indexingLogoSchema = new mongoose.Schema(
  {
    journal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Journal", required: true, index: true },
    name: { type: String, required: true },
    image_url: String,
    image_public_id: String
  },
  { timestamps: true }
);

export const IndexingLogo = mongoose.model("IndexingLogo", indexingLogoSchema);
