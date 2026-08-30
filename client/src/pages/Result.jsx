import ProductDNA from "../components/ProductDNA.jsx";
import ListingCard from "../components/ListingCard.jsx";
import PriceRange from "../components/PriceRange.jsx";

export default function Result({ listing, onStartOver }) {
  return (
    <div>
      <ProductDNA listing={listing} />
      <ListingCard listing={listing} />
      <PriceRange listing={listing} />

      <button type="button" className="btn-secondary" onClick={onStartOver}>
        ← Create another listing
      </button>
    </div>
  );
}
