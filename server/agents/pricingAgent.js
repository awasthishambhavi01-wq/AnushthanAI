// server/agents/pricingAgent.js
//
// Job: take a Product DNA object with category + material filled (and
// optionally sellerCost), and return a suggested price range in INR with
// a short reasoning explanation.
//
// MVP NOTE: this version reasons using Gemini's general market knowledge,
// not true RAG retrieval (see rag/ folder for that upgrade path later).
// This is intentional - a rule-informed LLM estimate is a legitimate MVP
// per the "build core first, optimize later" approach.
//
// This agent does NOT touch vision/voice/catalog fields - it only fills:
// priceRange, priceReasoning.

import { callTextModel, parseJsonResponse } from "../utils/llmClient.js";
import { buildPricingPrompt } from "../utils/prompts.js";
import { validateForPricing } from "../schemas/productDNA.js";

/**
 * Generates a suggested price range for a product.
 *
 * @param {object} dna - Product DNA object, must already have:
 *   category, material (sellerCost is optional but improves accuracy)
 * @returns {Promise<object>} partial Product DNA fields:
 *   { priceRange: { min, max }, priceReasoning }
 */
export async function suggestPrice(dna) {
  const check = validateForPricing(dna);
  if (!check.valid) {
    throw new Error(
      `Cannot suggest price - missing required fields: ${check.missing.join(", ")}`
    );
  }

  const prompt = buildPricingPrompt(dna);
  const rawResponse = await callTextModel(prompt);
  const parsed = parseJsonResponse(rawResponse);

  const min = Number(parsed.priceMin);
  const max = Number(parsed.priceMax);

  // Guard against the model returning non-numeric or nonsensical values
  // (e.g. min > max) - fail loudly rather than silently showing broken data
  // in the demo.
  if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max < min) {
    throw new Error(
      `Pricing agent returned an invalid range (min: ${parsed.priceMin}, max: ${parsed.priceMax})`
    );
  }

  return {
    priceRange: { min, max },
    priceReasoning: parsed.reasoning ?? null,
  };
}