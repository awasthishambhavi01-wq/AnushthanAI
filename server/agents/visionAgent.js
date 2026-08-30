// server/agents/visionAgent.js
//
// Job: take an uploaded product photo, ask Gemini to analyze it, and return
// a partially-filled Product DNA object with the vision-related fields set.
//
// This agent does NOT touch voice/catalog/pricing fields - it only fills:
// category, color, material, pattern, visualNotes, visionConfidence.

import { callVisionModel, parseJsonResponse } from "../utils/llmClient.js";
import { buildVisionPrompt } from "../utils/prompts.js";

/**
 * Analyzes a product image and returns the vision-related fields.
 *
 * @param {string} imagePath - local file path to the uploaded image (from multer)
 * @param {string} mimeType - e.g. "image/jpeg" or "image/png"
 * @returns {Promise<object>} partial Product DNA fields:
 *   { category, color, material, pattern, visualNotes, visionConfidence }
 */
export async function analyzeImage(imagePath, mimeType = "image/jpeg") {
  const prompt = buildVisionPrompt();

  const rawResponse = await callVisionModel(imagePath, prompt, mimeType);
  const parsed = parseJsonResponse(rawResponse);

  // Map the model's JSON keys onto our Product DNA field names.
  // Done explicitly (not just spread) so a stray/extra field from the model
  // can never silently leak into the DNA object.
  return {
    category: parsed.category ?? null,
    color: parsed.color ?? null,
    material: parsed.material ?? null,
    pattern: parsed.pattern ?? null,
    visualNotes: parsed.visualNotes ?? null,
    visionConfidence: parsed.confidence ?? null,
  };
}