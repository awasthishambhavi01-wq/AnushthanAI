import axios from "axios";

// Backend base URL. In a real deployment this would come from an env
// variable (import.meta.env.VITE_API_URL) — hardcoded here for hackathon
// simplicity since frontend and backend run on the same machine.
const API_BASE_URL = "http://localhost:5000/api";

/**
 * Calls POST /api/generate-listing with the product photo and description.
 *
 * @param {object} params
 * @param {File} params.photoFile - the uploaded image File object
 * @param {string} params.rawDescription - seller's typed/voice-transcribed description
 * @param {number} [params.sellerCost] - optional production cost in rupees
 * @returns {Promise<object>} the completed Product DNA / listing object
 */
export async function generateListing({ photoFile, rawDescription, sellerCost }) {
  const formData = new FormData();
  formData.append("photo", photoFile);
  formData.append("rawDescription", rawDescription);
  if (sellerCost) {
    formData.append("sellerCost", sellerCost);
  }

  const response = await axios.post(`${API_BASE_URL}/generate-listing`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}
