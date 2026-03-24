import mongoose from "mongoose";

const infoBoxLogoSchema = new mongoose.Schema(
  {
    journal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Journal", required: true, index: true },
    image_url: { type: String, required: true },
    image_public_id: { type: String, required: true }
  },
  { timestamps: true }
);

export const InfoBoxLogo = mongoose.model("InfoBoxLogo", infoBoxLogoSchema);
