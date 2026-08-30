import { useState } from "react";

/**
 * Shows the Catalog agent's output: title, bilingual description (toggle
 * between English/Hindi), and search keywords.
 */
export default function ListingCard({ listing }) {
  const [lang, setLang] = useState("en");
  const [copied, setCopied] = useState(false);

  const description = lang === "en" ? listing.descriptionEn : listing.descriptionHi;

  // Builds the full shareable text block: title + description + keywords.
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
      alert("Couldn't copy automatically — please select and copy the text manually.");
    }
  }

  function handleWhatsAppShare() {
    const text = encodeURIComponent(buildShareText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="card">
      <div className="section-title">Your listing</div>
      <h2 className="listing-title">{listing.title}</h2>

      <div className="listing-lang-tabs">
        <button
          type="button"
          className={`lang-tab ${lang === "en" ? "active" : ""}`}
          onClick={() => setLang("en")}
        >
          English
        </button>
        <button
          type="button"
          className={`lang-tab ${lang === "hi" ? "active" : ""}`}
          onClick={() => setLang("hi")}
        >
          हिन्दी
        </button>
      </div>

      <p className="listing-description">{description}</p>

      {listing.keywords?.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="field-hint" style={{ marginBottom: 6 }}>Search keywords</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {listing.keywords.map((kw) => (
              <span className="badge" key={kw}>{kw}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button type="button" className="btn-secondary" onClick={handleCopy}>
          {copied ? "✓ Copied" : "📋 Copy listing"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleWhatsAppShare}
          style={{ background: "#DFF3E3" }}
        >
          💬 Share on WhatsApp
        </button>
      </div>
    </div>
  );
}
