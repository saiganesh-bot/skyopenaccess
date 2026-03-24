import mongoose from "mongoose";

const pendingDeletionSchema = new mongoose.Schema(
  {
    public_id: { type: String, required: true },
    resource_type: { type: String, required: true },
    retry_count: { type: Number, default: 0 },
    last_retry_at: Date
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const PendingDeletion = mongoose.model("PendingDeletion", pendingDeletionSchema);
