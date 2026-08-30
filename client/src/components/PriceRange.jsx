/**
 * Shows the Pricing agent's suggested range and its reasoning.
 * Renders nothing if pricing failed for this listing (pipeline allows
 * that — see orchestrator/listingPipeline.js pricing step comments).
 */
export default function PriceRange({ listing }) {
  if (!listing.priceRange) {
    return (
      <div className="card">
        <div className="section-title">Suggested price</div>
        <p className="field-hint">Price suggestion unavailable for this listing.</p>
      </div>
    );
  }

  const { min, max } = listing.priceRange;

  return (
    <div className="card">
      <div className="section-title">Suggested price</div>
      <div className="price-box">
        <span className="price-range">₹{min} – ₹{max}</span>
      </div>
      {listing.priceReasoning && (
        <p className="price-reasoning">{listing.priceReasoning}</p>
      )}
    </div>
  );
}
