import { RotateCcw } from "lucide-react";
import ProductDNA from "../components/ProductDNA.jsx";
import ListingCard from "../components/ListingCard.jsx";
import PriceRange from "../components/PriceRange.jsx";
import SuccessBurst from "../components/SuccessBurst.jsx";

export default function Result({ listing, photoFile, onStartOver }) {
  return (
    <div>
      <SuccessBurst />
      <ProductDNA listing={listing} />
      <ListingCard listing={listing} photoFile={photoFile} />
      <PriceRange listing={listing} />

      <button
        onClick={onStartOver}
        className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors mt-2"
      >
        <RotateCcw size={14} />
        Create another listing
      </button>
    </div>
  );
}
