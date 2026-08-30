// server/utils/llmClient.js
//
// This is the ONE place in the whole backend that talks to Gemini directly.
// Every agent (vision, catalog, pricing) imports functions from here instead
// of calling the Gemini SDK itself. This means:
//   - one place to fix bugs / swap models / add retry logic
//   - agents stay short and focused on "what to ask", not "how to ask it"

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Check that server/.env exists and has GEMINI_API_KEY set."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelName });

/**
 * Sends a TEXT-ONLY prompt to Gemini and returns the plain text response.
 * Used by: catalogAgent, pricingAgent
 *
 * @param {string} prompt - the full instruction/question for the model
 * @returns {Promise<string>} the model's text response
 */
export async function callTextModel(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (err) {
    console.error("[llmClient] Text call failed:", err.message);
    throw new Error(`Gemini text call failed: ${err.message}`);
  }
}

/**
 * Sends an IMAGE + a text prompt to Gemini and returns the plain text response.
 * Used by: visionAgent
 *
 * @param {string} imagePath - local file path to the uploaded image (e.g. from multer)
 * @param {string} prompt - instruction telling the model what to look for
 * @param {string} mimeType - e.g. "image/jpeg" or "image/png"
 * @returns {Promise<string>} the model's text response
 */
export async function callVisionModel(imagePath, prompt, mimeType = "image/jpeg") {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const text = result.response.text();
    return text;
  } catch (err) {
    console.error("[llmClient] Vision call failed:", err.message);
    throw new Error(`Gemini vision call failed: ${err.message}`);
  }
}

/**
 * Helper: tries to parse a model response as JSON, even if the model
 * wrapped it in markdown code fences (```json ... ```), which Gemini
 * sometimes does even when told not to.
 *
 * @param {string} rawText - raw text response from callTextModel/callVisionModel
 * @returns {object} parsed JSON object
 */
export function parseJsonResponse(rawText) {
  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[llmClient] Failed to parse JSON from model response:", cleaned);
    throw new Error("Model did not return valid JSON. Raw response logged above.");
  }
}