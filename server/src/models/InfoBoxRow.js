import mongoose from "mongoose";

const infoBoxRowSchema = new mongoose.Schema(
  {
    journal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Journal", required: true, index: true },
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { timestamps: true }
);

export const InfoBoxRow = mongoose.model("InfoBoxRow", infoBoxRowSchema);
