import { cloudinary } from "../config/cloudinary.js";
import { Logo } from "../models/Logo.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

export const getLogos = asyncHandler(async (req, res) => {
  const logos = await Logo.find().sort({ created_at: -1 });
  res.status(200).json({ logos });
});

export const createLogo = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const upload = await uploadBufferToCloudinary(req.file.buffer, {
    folder: "journals/marquee-logos",
    resource_type: "image"
  });

  const logo = await Logo.create({
    image_url: upload.secure_url,
    image_public_id: upload.public_id
  });

  res.status(201).json({ logo });
});

export const deleteLogo = asyncHandler(async (req, res) => {
  const logo = await Logo.findById(req.params.id);
  if (!logo) return res.status(404).json({ message: "Logo not found" });

  await cloudinary.uploader.destroy(logo.image_public_id, { resource_type: "image" });
  await logo.deleteOne();

  res.status(200).json({ message: "Logo deleted" });
});
