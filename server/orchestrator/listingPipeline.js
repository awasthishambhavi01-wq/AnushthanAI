// server/orchestrator/listingPipeline.js
//
// Job: coordinate the full "photo + description -> finished listing" flow.
// This is the ONE place that decides the order agents run in and how their
// outputs get merged into a single Product DNA object.
//
// Keep this file "dumb and linear" on purpose - no cleverness, just:
//   1. run vision agent
//   2. run catalog agent
//   3. run pricing agent
//   4. return the merged result
// Each step updates dna.status so the frontend can show live progress
// (this is what LoadingAgentStatus.jsx will read).

import { createEmptyProductDNA } from "../schemas/productDNA.js";
import { analyzeImage } from "../agents/visionAgent.js";
import { generateCatalog } from "../agents/catalogAgent.js";
import { suggestPrice } from "../agents/pricingAgent.js";

/**
 * Runs the full listing generation pipeline.
 *
 * @param {object} input
 * @param {string} input.imagePath - local path to the uploaded product photo
 * @param {string} input.mimeType - e.g. "image/jpeg" or "image/png"
 * @param {string} input.rawDescription - seller's own description (typed or transcribed)
 * @param {number} [input.sellerCost] - optional, cost to make the product (for pricing)
 *
 * @returns {Promise<object>} a fully filled Product DNA object
 */
export async function runListingPipeline({ imagePath, mimeType, rawDescription, sellerCost }) {
  const dna = createEmptyProductDNA();
  dna.createdAt = new Date().toISOString();
  dna.rawDescription = rawDescription ?? null;
  dna.sellerCost = sellerCost ?? null;

  // --- Step 1: Vision agent ---
  try {
    const visionResult = await analyzeImage(imagePath, mimeType);
    Object.assign(dna, visionResult);
    dna.status.vision = "done";
  } catch (err) {
    dna.status.vision = "failed";
    console.error("[listingPipeline] Vision step failed:", err.message);
    throw new Error(`Pipeline stopped at vision step: ${err.message}`);
  }

  // --- Step 2: Catalog agent (needs vision output + rawDescription) ---
  try {
    const catalogResult = await generateCatalog(dna);
    Object.assign(dna, catalogResult);
    dna.status.catalog = "done";
  } catch (err) {
    dna.status.catalog = "failed";
    console.error("[listingPipeline] Catalog step failed:", err.message);
    throw new Error(`Pipeline stopped at catalog step: ${err.message}`);
  }

  // --- Step 3: Pricing agent (needs category + material at minimum) ---
  try {
    const pricingResult = await suggestPrice(dna);
    Object.assign(dna, pricingResult);
    dna.status.pricing = "done";
  } catch (err) {
    dna.status.pricing = "failed";
    console.error("[listingPipeline] Pricing step failed:", err.message);
    // NOTE: pricing failure does not stop the pipeline - a listing without
    // a price is still useful to show. Vision/catalog failures above DO stop
    // the pipeline because nothing useful can be shown without them.
  }

  // voice step is marked done here since, for the MVP, rawDescription is
  // provided directly (typed or already-transcribed) rather than processed
  // by a separate voice agent call.
  dna.status.voice = rawDescription ? "done" : "pending";

  return dna;
}