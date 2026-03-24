import mongoose from "mongoose";

const boardMemberSchema = new mongoose.Schema(
  {
    journal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Journal", required: true, index: true },
    name: { type: String, required: true },
    description: String,
    image_url: String,
    image_public_id: String
  },
  { timestamps: true }
);

export const BoardMember = mongoose.model("BoardMember", boardMemberSchema);
