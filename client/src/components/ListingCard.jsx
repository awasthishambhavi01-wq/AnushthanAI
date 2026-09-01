import { useState } from "react";
import { Copy, Check, Share2, Sparkles } from "lucide-react";

/**
 * Field names match backend exactly: title, descriptionEn, descriptionHi, keywords
 */
export default function ListingCard({ listing, photoFile }) {
  const [lang, setLang] = useState("en");
  const [copied, setCopied] = useState(false);

  const description = lang === "en" ? listing.descriptionEn : listing.descriptionHi;

  function buildShareText() {
    const keywordLine = listing.keywords?.length
      ? `\n\n${listing.keywords.map((k) => `#${k.replace(/\s+/g, "")}`).join(" ")}`
      : "";
    return `${listing.title}\n\n${description}${keywordLine}`;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Couldn't copy automatically — please select and copy manually.");
    }
  }

  async function handleShare() {
    const text = buildShareText();
    const canShareFiles = photoFile && navigator.canShare && navigator.canShare({ files: [photoFile] });
    if (canShareFiles) {
      try {
        await navigator.share({ title: listing.title, text, files: [photoFile] });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div
      className="glass-card rounded-2xl p-6 mb-4 animate-fade-up"
      style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
        <Sparkles size={13} className="text-purple-400" />
        Your AI-generated listing
      </div>

      <h2 className="text-xl font-display font-semibold text-zinc-50 mb-4">{listing.title}</h2>

      {/* Prominent EN / HI switch */}
      <div className="inline-flex p-1 rounded-full bg-zinc-800/70 border border-zinc-700 mb-4">
        <button
          onClick={() => setLang("en")}
          className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all
            ${lang === "en" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          English
        </button>
        <button
          onClick={() => setLang("hi")}
          className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all
            ${lang === "hi" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          हिन्दी
        </button>
      </div>

      <p className="text-[14.5px] leading-relaxed text-zinc-300">{description}</p>

      {listing.keywords?.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-zinc-500 mb-1.5">Search keywords</div>
          <div className="flex flex-wrap gap-1.5">
            {listing.keywords.map((kw) => (
              <span key={kw} className="bg-zinc-800/70 border border-zinc-700 text-zinc-300 text-xs font-medium px-2.5 py-1 rounded-full">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 px-4 py-2 rounded-full transition-colors"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy Listing"}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full transition-colors"
        >
          <Share2 size={13} />
          Share with Photo
        </button>
      </div>
    </div>
  );
}
