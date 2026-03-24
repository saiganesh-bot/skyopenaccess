import mongoose from "mongoose";

const archiveVolumeSchema = new mongoose.Schema(
  {
    journal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Journal", required: true, index: true },
    year: { type: Number, required: true },
    volume_title: { type: String, required: true }
  },
  { timestamps: true }
);

export const ArchiveVolume = mongoose.model("ArchiveVolume", archiveVolumeSchema);
