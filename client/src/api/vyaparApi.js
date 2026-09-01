import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

/**
 * UNCHANGED from before - same request shape, same endpoint, same response.
 * This is the one and only call that generates a listing.
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

/**
 * NEW, additive only - pings the existing /api/health endpoint (already
 * built in your backend) so the "AI SYSTEM ONLINE" indicator reflects a
 * real check, not a hardcoded green dot.
 */
export async function checkHealth() {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 3000 });
    return response.data?.status === "ok";
  } catch {
    return false;
  }
}
