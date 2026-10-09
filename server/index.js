// server/index.js
//
// Entry point. Starts the Express server, enables CORS so the React
// frontend can call it, and mounts the /api routes.

import "dotenv/config"; // MUST be the first import - loads .env before anything else runs
import express from "express";
import cors from "cors";
import generateListingRoute from "./routes/generateListing.js";

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // allows requests from the React dev server (different port)
app.use(express.json()); // parses JSON request bodies (not used by file upload route, but useful for future routes)

// --- Health check route (quick way to confirm the server is alive) ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AnushthanAI backend is running." });
});

// --- Main routes ---
app.use("/api", generateListingRoute);

// --- Start server ---
app.listen(PORT, () => {
  console.log(`AnushthanAI server running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Generate listing: POST http://localhost:${PORT}/api/generate-listing`);
});
