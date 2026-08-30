/**
 * Shows what the Vision agent detected in the photo — proves to the
 * viewer that the AI actually "looked" at the image before anything
 * else was generated.
 */
export default function ProductDNA({ listing }) {
  const rows = [
    { label: "Category", value: listing.category },
    { label: "Color", value: listing.color },
    { label: "Material", value: listing.material },
    { label: "Pattern / presentation", value: listing.pattern },
  ].filter((row) => row.value && row.value !== "n/a");

  return (
    <div className="card">
      <div className="section-title">Detected from your photo</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {rows.map((row) => (
          <span className="badge" key={row.label}>
            {row.label}: {row.value}
          </span>
        ))}
      </div>
      {listing.visualNotes && (
        <p className="field-hint" style={{ marginTop: 12 }}>
          {listing.visualNotes}
        </p>
      )}
    </div>
  );
}
