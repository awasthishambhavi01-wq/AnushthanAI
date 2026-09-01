import { Wand2 } from "lucide-react";

const EXAMPLES = [
  {
    label: "Thali",
    imagePath: "/demo-images/thali.jpg",
    description:
      "Meri maa ke haath ka bana khana, roz taza banta hai, ghar jaisa swaad, 100 percent vegetarian thali with daal, rice, chapati aur mix veg.",
  },
  {
    label: "Kurti",
    imagePath: "/demo-images/kurti.jpg",
    description:
      "Ye cotton ki blue kurti hai, isme hand embroidery hai aur ise banane me 600 rupaye lage hain.",
  },
  {
    label: "Jewellery",
    imagePath: "/demo-images/jewellery.jpg",
    description:
      "Handmade brass jhumka earrings, traditional design, banaye jaate hain local artisans dwara, roughly 150 rupaye ki cost aati hai.",
  },
];

async function loadDemoFile(imagePath, label) {
  const response = await fetch(imagePath);
  if (!response.ok) throw new Error(`Demo image not found at ${imagePath}`);
  const blob = await response.blob();
  return new File([blob], `${label.toLowerCase()}-demo.jpg`, { type: blob.type || "image/jpeg" });
}

export default function ExampleChips({ onExampleSelected }) {
  async function handleClick(example) {
    try {
      const file = await loadDemoFile(example.imagePath, example.label);
      onExampleSelected(file, example.description);
    } catch {
      alert(
        `Couldn't load the demo photo for "${example.label}". Make sure ${example.imagePath} exists in client/public/demo-images/.`
      );
    }
  }

  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mb-2">
        <Wand2 size={13} />
        Quick demo — try without your own photo
      </div>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => handleClick(ex)}
            className="text-xs font-medium bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700 hover:border-indigo-500/50 text-zinc-300 hover:text-indigo-300 px-3.5 py-1.5 rounded-full transition-colors"
          >
            {ex.label}
          </button>
        ))}
      </div>
    </div>
  );
}
