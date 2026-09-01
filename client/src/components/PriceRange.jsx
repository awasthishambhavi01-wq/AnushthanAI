import { IndianRupee } from "lucide-react";

/**
 * Field names match backend exactly: priceRange.min, priceRange.max, priceReasoning.
 * If pricing failed, backend's orchestrator does NOT stop the whole pipeline
 * (see orchestrator/listingPipeline.js) - it just omits priceRange from the
 * response. We check for that here rather than assuming it always exists.
 */
export default function PriceRange({ listing }) {
  if (!listing.priceRange) {
    return (
      <div className="glass-card rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
          <IndianRupee size={13} className="text-orange-400" />
          AI Suggested Price
        </div>
        <p className="text-sm text-zinc-500">Price suggestion unavailable for this listing.</p>
      </div>
    );
  }

  const { min, max } = listing.priceRange;

  return (
    <div
      className="glass-card rounded-2xl p-6 mb-4 animate-fade-up relative overflow-hidden"
      style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3 relative">
        <IndianRupee size={13} className="text-orange-400" />
        AI Suggested Price
      </div>

      <div className="bg-gradient-to-br from-orange-500/15 via-zinc-900/40 to-purple-500/10 border border-orange-500/20 rounded-xl px-5 py-5 relative">
        <span className="font-display font-bold text-3xl bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
          ₹{min} – ₹{max}
        </span>
      </div>

      {listing.priceReasoning && (
        <p className="text-xs text-zinc-500 mt-3 leading-relaxed relative">{listing.priceReasoning}</p>
      )}
    </div>
  );
}
