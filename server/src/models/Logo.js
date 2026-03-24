import mongoose from "mongoose";

const logoSchema = new mongoose.Schema(
  {
    image_url: { type: String, required: true },
    image_public_id: { type: String, required: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Logo = mongoose.model("Logo", logoSchema);
