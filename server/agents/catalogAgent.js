// server/agents/catalogAgent.js
//
// Job: take a Product DNA object that already has vision fields filled
// (category, color, material, pattern, visualNotes) plus the seller's own
// description (rawDescription), and generate a professional bilingual
// listing: title, English description, Hindi description, keywords.
//
// This agent does NOT touch vision or pricing fields - it only fills:
// title, descriptionEn, descriptionHi, keywords.

import { callTextModel, parseJsonResponse } from "../utils/llmClient.js";
import { buildCatalogPrompt } from "../utils/prompts.js";
import { validateForCatalog } from "../schemas/productDNA.js";

/**
 * Generates a bilingual catalog listing from a filled Product DNA object.
 *
 * @param {object} dna - Product DNA object, must already have:
 *   category, color, material, pattern, visualNotes, rawDescription
 * @returns {Promise<object>} partial Product DNA fields:
 *   { title, descriptionEn, descriptionHi, keywords }
 */
export async function generateCatalog(dna) {
  // Guard: make sure vision + description fields are actually filled before
  // we waste an API call on incomplete data.
  const check = validateForCatalog(dna);
  if (!check.valid) {
    throw new Error(
      `Cannot generate catalog - missing required fields: ${check.missing.join(", ")}`
    );
  }

  const prompt = buildCatalogPrompt(dna);
  const rawResponse = await callTextModel(prompt);
  const parsed = parseJsonResponse(rawResponse);

  return {
    title: parsed.title ?? null,
    descriptionEn: parsed.descriptionEn ?? null,
    descriptionHi: parsed.descriptionHi ?? null,
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
  };
}