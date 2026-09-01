import { useState, useRef } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import UploadPhoto from "../components/UploadPhoto.jsx";
import ImageEnhancer from "../components/ImageEnhancer.jsx";
import RecordVoice from "../components/RecordVoice.jsx";
import AgentPipeline from "../components/AgentPipeline.jsx";
import ExampleChips from "../components/ExampleChips.jsx";
import { generateListing } from "../api/vyaparApi.js";


const INITIAL_STATUSES = { vision: "waiting", catalog: "waiting", pricing: "waiting" };

export default function Home({ onListingGenerated }) {
  const [photoFile, setPhotoFile] = useState(null);
  const [description, setDescription] = useState("");
  const [sellerCost, setSellerCost] = useState("");
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState(INITIAL_STATUSES);
  const [error, setError] = useState(null);
  const uploadRef = useRef(null);

  function handleExampleSelected(file, exampleDescription) {
    setPhotoFile(file);
    setDescription(exampleDescription);
    uploadRef.current?.injectFile(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!photoFile) return setError("Please upload a product photo first.");
    if (!description.trim()) return setError("Please add a short description — typed or spoken.");

    setLoading(true);
    setStatuses({ vision: "running", catalog: "waiting", pricing: "waiting" });

    // The backend runs vision -> catalog -> pricing sequentially inside ONE
    // HTTP request (it doesn't stream per-agent events back), so this timer
    // sequence is an honest visual approximation of that real order - not
    // fabricated data, just progressive disclosure of a known pipeline.
    const t1 = setTimeout(() => setStatuses({ vision: "completed", catalog: "running", pricing: "waiting" }), 2400);
    const t2 = setTimeout(() => setStatuses({ vision: "completed", catalog: "completed", pricing: "running" }), 5200);

    try {
      const listing = await generateListing({
        photoFile,
        rawDescription: description.trim(),
        sellerCost: sellerCost ? Number(sellerCost) : undefined,
      });

      clearTimeout(t1);
      clearTimeout(t2);

      // listing.priceRange only exists if the pricing agent actually
      // succeeded (see server/orchestrator/listingPipeline.js) - pricing
      // failure doesn't throw, it just omits the field. Reflect that here
      // instead of always claiming "completed".
      setStatuses({
        vision: "completed",
        catalog: "completed",
        pricing: listing.priceRange ? "completed" : "error",
      });

      // brief pause so the final pipeline state is visible before the
      // result screen replaces it
      setTimeout(() => onListingGenerated(listing, photoFile), 500);
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);

      const message = err.response?.data?.error || err.message || "Something went wrong.";

      // Backend throws errors shaped like "Pipeline stopped at vision step: ..."
      // or "...at catalog step: ..." - parse that to mark the right step.
      if (message.includes("vision step")) {
        setStatuses({ vision: "error", catalog: "waiting", pricing: "waiting" });
      } else if (message.includes("catalog step")) {
        setStatuses({ vision: "completed", catalog: "error", pricing: "waiting" });
      } else {
        setStatuses({ vision: "completed", catalog: "completed", pricing: "error" });
      }

      setError(message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <AgentPipeline statuses={statuses} />
        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 text-red-300 text-sm rounded-xl px-4 py-3 mt-4">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl p-6 animate-fade-up"
      style={{ animationDelay: "160ms", animationFillMode: "backwards" }}
    >
      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <ExampleChips onExampleSelected={handleExampleSelected} />

      
      <UploadPhoto ref={uploadRef} onPhotoSelected={setPhotoFile} />

      {photoFile && (
  <ImageEnhancer
    photoFile={photoFile}
    onEnhanced={(file) => setPhotoFile(file)}
  />
)}


      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
          Describe your product
        </label>
        <textarea
          rows={4}
          placeholder="e.g. Meri maa ke haath ka bana khana, roz taza banta hai..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/60 focus:bg-zinc-900 transition-colors resize-y"
        />
        <div className="mt-2">
          <RecordVoice onTranscript={(text) => setDescription((prev) => (prev ? prev + " " + text : text))} />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
          Production cost <span className="font-normal normal-case text-zinc-600">(optional, in ₹)</span>
        </label>
        <input
          type="number"
          placeholder="e.g. 60"
          value={sellerCost}
          onChange={(e) => setSellerCost(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/60 focus:bg-zinc-900 transition-colors"
        />
        <div className="text-xs text-zinc-600 mt-1.5">Helps the pricing agent suggest a fairer margin.</div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-60 text-white font-semibold text-[15px] py-3.5 rounded-xl transition-all active:scale-[0.99] shadow-lg shadow-indigo-500/20"
      >
        ✨ Generate Market Listing
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
