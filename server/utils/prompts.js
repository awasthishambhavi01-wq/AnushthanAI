// server/utils/prompts.js
//
// All prompt templates live here, in one place. This makes them easy to
// tune without hunting through agent files, and keeps agents.js files short.
//
// IMPORTANT: every prompt below asks Gemini to respond in STRICT JSON only.
// This is what lets llmClient's parseJsonResponse() turn the response
// directly into a JS object. If you edit these prompts, keep the
// "respond with ONLY valid JSON" instruction intact.

/**
 * Vision Agent prompt — analyzes a product photo and extracts structured attributes.
 *
 * Example use case: a homemade vegetarian thali (dal, rice, chapati, mix veg)
 * should come back as something like:
 * {
 *   "category": "homemade meal / thali",
 *   "color": "mixed - yellow dal, white rice, golden chapati, green mix veg",
 *   "material": "n/a",
 *   "pattern": "n/a",
 *   "visualNotes": "steel thali plate with 4 compartments, dal, rice, 2 chapati, mix vegetable curry",
 *   "confidence": 0.9
 * }
 */
export function buildVisionPrompt() {
  return `You are a product analysis assistant for a platform that helps small home-based
sellers (food makers, artisans, tailors) turn a simple photo into a professional
product listing.

Look at the attached image carefully and identify what is being sold.

The product could be a FOOD ITEM (like a homemade thali, snacks, sweets) OR a
CRAFT/CLOTHING ITEM (like a kurti, jewellery, pottery). Adapt your answer to
whichever type of product you see.

Respond with ONLY valid JSON, no extra text, no markdown code fences, in
exactly this shape:

{
  "category": "short product category, e.g. 'homemade vegetarian thali' or 'cotton kurti'",
  "color": "dominant colors you observe, comma separated",
  "material": "material if visible/relevant (for food, write 'n/a')",
  "pattern": "any visible pattern, design, or plating style (for food, describe how it's arranged/served)",
  "visualNotes": "1-2 sentences describing what you see: components, presentation, notable details",
  "confidence": 0.0
}

"confidence" should be a number between 0 and 1 representing how confident you are
in this analysis. Respond with ONLY the JSON object above, nothing else.`;
}

/**
 * Catalog Agent prompt — takes the filled Product DNA (vision output + seller's
 * own description) and generates a bilingual listing.
 *
 * @param {object} dna - a Product DNA object (see schemas/productDNA.js)
 *                        expected to have: category, color, material, pattern,
 *                        visualNotes, rawDescription already filled in
 */
export function buildCatalogPrompt(dna) {
  return `You are a catalog-writing assistant for a platform that helps small home-based
sellers create professional product listings from minimal input.

Here is what we know about this product:
- Category: ${dna.category}
- Color: ${dna.color}
- Material: ${dna.material}
- Pattern/Presentation: ${dna.pattern}
- Visual notes: ${dna.visualNotes}
- Seller's own description (in their words): "${dna.rawDescription}"

Using this information, write a professional product listing.

Respond with ONLY valid JSON, no extra text, no markdown code fences, in
exactly this shape:

{
  "title": "a short, appealing product title (max 8 words)",
  "descriptionEn": "a 2-3 sentence professional description in English, highlighting what makes this product appealing (freshness, homemade quality, taste/craft, etc.)",
  "descriptionHi": "the same description translated naturally into Hindi (not word-for-word, sound natural to a Hindi speaker)",
  "keywords": ["5 to 8 relevant search keywords as an array of short strings"]
}

Keep the tone warm and trustworthy - this is a small home business, not a
large factory brand. Respond with ONLY the JSON object above, nothing else.`;
}

/**
 * Pricing Agent prompt — suggests a price range with reasoning.
 * Kept simple/rule-informed for the MVP (no RAG yet) - the model reasons
 * using general knowledge of typical prices for similar home-made products.
 *
 * @param {object} dna - Product DNA, expected to have category, material, sellerCost (optional)
 */
export function buildPricingPrompt(dna) {
  const costLine = dna.sellerCost
    ? `The seller mentioned it costs them approximately ₹${dna.sellerCost} to make.`
    : `The seller did not mention a production cost.`;

  return `You are a pricing assistant for a platform that helps small home-based Indian
sellers price their products fairly and competitively.

Product details:
- Category: ${dna.category}
- Material: ${dna.material}
- ${costLine}

Based on typical market prices in India for similar homemade/small-business
products, suggest a fair price range in Indian Rupees (₹).

Respond with ONLY valid JSON, no extra text, no markdown code fences, in
exactly this shape:

{
  "priceMin": 0,
  "priceMax": 0,
  "reasoning": "1-2 sentences explaining how you arrived at this range, mentioning production cost (if given), typical market rates, and any relevant product factors"
}

Respond with ONLY the JSON object above, nothing else.`;
}