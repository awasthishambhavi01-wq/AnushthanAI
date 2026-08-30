import { useState } from "react";
import UploadPhoto from "../components/UploadPhoto.jsx";
import RecordVoice from "../components/RecordVoice.jsx";
import LoadingAgentStatus from "../components/LoadingAgentStatus.jsx";
import { generateListing } from "../api/vyaparApi.js";

export default function Home({ onListingGenerated }) {
  const [photoFile, setPhotoFile] = useState(null);
  const [description, setDescription] = useState("");
  const [sellerCost, setSellerCost] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!photoFile) {
      setError("Please upload a product photo first.");
      return;
    }
    if (!description.trim()) {
      setError("Please add a short description — typed or spoken.");
      return;
    }

    setLoading(true);
    setActiveStep(0);

    // Simulated step progression for the loading UI — the backend runs
    // these three agents sequentially in one request, so we advance the
    // visual indicator on a timer to roughly match. This keeps the UI
    // simple: one request, one response, no streaming needed for the MVP.
    const stepTimer1 = setTimeout(() => setActiveStep(1), 2500);
    const stepTimer2 = setTimeout(() => setActiveStep(2), 5500);

    try {
      const listing = await generateListing({
        photoFile,
        rawDescription: description.trim(),
        sellerCost: sellerCost ? Number(sellerCost) : undefined,
      });
      onListingGenerated(listing);
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="section-title">Generating your listing</div>
        <LoadingAgentStatus activeIndex={activeStep} />
      </div>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      {error && <div className="error-box">{error}</div>}

      <UploadPhoto onPhotoSelected={setPhotoFile} />

      <div className="field-group">
        <label className="field-label">Describe your product</label>
        <textarea
          rows={4}
          placeholder="e.g. Meri maa ke haath ka bana khana, roz taza banta hai..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          <RecordVoice onTranscript={(text) => setDescription((prev) => (prev ? prev + " " + text : text))} />
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">
          Production cost <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>(optional, in ₹)</span>
        </label>
        <input
          type="number"
          placeholder="e.g. 60"
          value={sellerCost}
          onChange={(e) => setSellerCost(e.target.value)}
        />
        <div className="field-hint">Helps the pricing agent suggest a fairer margin.</div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        Generate my listing
      </button>
    </form>
  );
}
