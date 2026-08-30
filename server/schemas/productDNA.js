// server/schemas/productDNA.js
//
// Product DNA is the single shared data object that flows through the entire
// agent pipeline. Each agent reads some fields and writes others:
//
//   visionAgent   -> fills: category, color, material, pattern, visualNotes
//   voiceAgent    -> fills: rawDescription, spokenLanguage, sellerNotes
//   catalogAgent  -> reads: everything above  -> writes: title, description, keywords
//   pricingAgent  -> reads: category, material, sellerCost -> writes: priceRange, priceReasoning
//
// Keeping this shape in one file means every agent agrees on field names —
// no more "vision agent calls it 'colour' but catalog agent expects 'color'" bugs.

/**
 * Creates a blank Product DNA object with sensible defaults.
 * Call this once per new product, then let each agent fill in its part.
 */
export function createEmptyProductDNA() {
  return {
    // --- Identity ---
    id: null,                 // set when saved (e.g. timestamp or uuid)
    createdAt: null,          // ISO date string, set on creation

    // --- Filled by Vision Agent (from the product photo) ---
    category: null,           // e.g. "kurti", "earrings", "pottery bowl"
    color: null,               // e.g. "blue"
    material: null,            // e.g. "cotton", "brass", "clay"
    pattern: null,              // e.g. "hand embroidery", "geometric print"
    visualNotes: null,          // free-text: anything else vision noticed
    visionConfidence: null,     // 0-1 score, optional, useful for debugging

    // --- Filled by Voice/Text Agent (from seller's description) ---
    rawDescription: null,       // original text/transcribed voice input, untouched
    spokenLanguage: null,       // e.g. "hi", "en", "hinglish"
    sellerNotes: null,          // structured notes pulled from the description
                                 // e.g. "600 rupees to make", "handmade", "custom sizes available"
    sellerCost: null,           // numeric, if seller mentioned production cost

    // --- Filled by Catalog Agent ---
    title: null,                // generated product title
    descriptionEn: null,        // English description
    descriptionHi: null,        // Hindi description
    keywords: [],                // array of SEO/search keywords

    // --- Filled by Pricing Agent ---
    priceRange: null,            // { min: number, max: number }
    priceReasoning: null,        // short explanation of how the price was derived

    // --- Pipeline status (useful for debugging + UI loading states) ---
    status: {
      vision: "pending",         // "pending" | "done" | "failed"
      voice: "pending",
      catalog: "pending",
      pricing: "pending",
    },
  };
}

/**
 * Checks whether a Product DNA object has the minimum fields needed
 * to move on to the Catalog Agent. Call this after vision + voice steps.
 * Returns { valid: boolean, missing: string[] }
 */
export function validateForCatalog(dna) {
  const required = ["category", "color", "material", "rawDescription"];
  const missing = required.filter((field) => !dna[field]);
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Checks whether a Product DNA object has enough info for the Pricing Agent.
 */
export function validateForPricing(dna) {
  const required = ["category", "material"];
  const missing = required.filter((field) => !dna[field]);
  return {
    valid: missing.length === 0,
    missing,
  };
}