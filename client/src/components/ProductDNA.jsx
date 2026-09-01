import { Eye } from "lucide-react";

/**
 * Field names below match server/schemas/productDNA.js exactly:
 * category, color, material, pattern, visualNotes, visionConfidence
 */
export default function ProductDNA({ listing }) {
  const rows = [
    { label: "Category", value: listing.category },
    { label: "Color", value: listing.color },
    { label: "Material", value: listing.material },
    { label: "Pattern", value: listing.pattern },
  ].filter((row) => row.value && row.value !== "n/a");

  const confidencePct =
    typeof listing.visionConfidence === "number"
      ? Math.round(listing.visionConfidence * 100)
      : null;

  return (
    <div className="glass-card rounded-2xl p-6 mb-4 animate-fade-up" style={{ animationFillMode: "backwards" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          <Eye size={13} className="text-indigo-400" />
          Detected from your photo
        </div>
        {confidencePct !== null && (
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
            {confidencePct}% confidence
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {rows.map((row) => (
          <span
            key={row.label}
            className="text-xs font-medium bg-zinc-800/70 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full"
          >
            <span className="text-zinc-500">{row.label}:</span> {row.value}
          </span>
        ))}
      </div>

      {listing.visualNotes && (
        <p className="text-xs text-zinc-500 mt-3 leading-relaxed">{listing.visualNotes}</p>
      )}
    </div>
  );
}
