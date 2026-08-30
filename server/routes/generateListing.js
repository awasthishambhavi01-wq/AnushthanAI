// server/routes/generateListing.js
//
// Job: expose the listing pipeline as an HTTP endpoint.
// POST /api/generate-listing
//   - multipart/form-data with fields:
//       photo         (file, required)
//       rawDescription (text, required)
//       sellerCost     (number, optional)
//
// This file is intentionally thin - it only handles the HTTP request/response
// and file upload plumbing. All real logic lives in orchestrator/listingPipeline.js.

import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { runListingPipeline } from "../orchestrator/listingPipeline.js";

const router = Router();

// --- Multer setup: where uploaded photos get temporarily saved ---
const uploadDir = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // prefix with timestamp so repeated uploads never collide
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max, generous for a phone photo
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, or WEBP images are allowed."));
    }
  },
});

router.post("/generate-listing", upload.single("photo"), async (req, res) => {
  // Guard: no photo uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No photo uploaded. Field name must be 'photo'." });
  }

  const { rawDescription, sellerCost } = req.body;

  // Guard: no description provided
  if (!rawDescription || rawDescription.trim().length === 0) {
    // clean up the uploaded file since we're rejecting this request
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: "rawDescription is required." });
  }

  try {
    const result = await runListingPipeline({
      imagePath: req.file.path,
      mimeType: req.file.mimetype,
      rawDescription: rawDescription.trim(),
      sellerCost: sellerCost ? Number(sellerCost) : undefined,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("[generateListing route] Pipeline error:", err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    // Clean up the uploaded photo after processing (success or failure) -
    // we don't need to keep it once the pipeline has read it.
    fs.unlink(req.file.path, () => {});
  }
});

export default router;