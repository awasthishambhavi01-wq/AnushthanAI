import { useEffect, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import {
  Sparkles,
  Wand2,
  Check,
  Loader2,
  RotateCcw,
} from "lucide-react";

export default function ImageEnhancer({ photoFile, onEnhanced }) {
  const [enhancedUrl, setEnhancedUrl] = useState(null);
  const [enhancedFile, setEnhancedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState("");
  const [error, setError] = useState("");

  const originalUrl = photoFile
    ? URL.createObjectURL(photoFile)
    : null;

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
    };
  }, [photoFile]);

  async function enhanceImage() {
    if (!photoFile) return;

    try {
      setProcessing(true);
      setError("");
      setEnhancedUrl(null);
      setEnhancedFile(null);

      // STEP 1 — AI background removal
      setStep("AI is removing the background...");

      const transparentBlob = await removeBackground(photoFile);

      // STEP 2 — Canvas enhancement
      setStep("Enhancing lighting and contrast...");

      const img = new Image();
      const transparentUrl = URL.createObjectURL(transparentBlob);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = transparentUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      // Professional white e-commerce background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Brightness + contrast
      ctx.filter = "brightness(1.08) contrast(1.08)";
      ctx.drawImage(img, 0, 0);

      URL.revokeObjectURL(transparentUrl);

      // STEP 3 — Convert canvas to PNG
      setStep("Preparing marketplace-ready photo...");

      const finalBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png", 0.95)
      );

      const finalFile = new File(
        [finalBlob],
        `anushthanai-enhanced-${Date.now()}.png`,
        {
          type: "image/png",
        }
      );

      const finalUrl = URL.createObjectURL(finalFile);

      setEnhancedFile(finalFile);
      setEnhancedUrl(finalUrl);
      setStep("Photo enhancement complete.");
    } catch (err) {
      console.error(err);
      setError(
        "Image enhancement failed. Please try again or use the original photo."
      );
    } finally {
      setProcessing(false);
    }
  }

  function useEnhancedPhoto() {
    if (!enhancedFile) return;

    onEnhanced(enhancedFile);
  }

  function useOriginalPhoto() {
    onEnhanced(photoFile);
  }

  if (!photoFile) return null;

  return (
    <div className="mb-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                AI Image Studio
              </h3>

              <p className="text-[11px] text-zinc-500">
                Make your product photo marketplace-ready
              </p>
            </div>
          </div>
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300 border border-indigo-500/20 rounded-full px-2 py-1">
          AI Powered
        </span>
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-2 gap-3 mb-4">

        {/* Original */}
        <div>
          <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1.5">
            Original
          </div>

          <div className="aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src={originalUrl}
              alt="Original product"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Enhanced */}
        <div>
          <div className="text-[10px] uppercase tracking-wide text-indigo-300 mb-1.5">
            AI Enhanced
          </div>

          <div className="aspect-square rounded-xl overflow-hidden bg-white border border-indigo-500/30 relative">

            {enhancedUrl ? (
              <img
                src={enhancedUrl}
                alt="AI enhanced product"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                <Wand2 size={22} className="text-indigo-400 mb-2" />

                <span className="text-xs text-zinc-500">
                  AI enhanced preview
                </span>
              </div>
            )}

            {processing && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-4">
                <Loader2
                  size={25}
                  className="text-indigo-400 animate-spin mb-2"
                />

                <span className="text-[11px] text-white">
                  {step}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Processing status */}
      {processing && (
        <div className="mb-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs text-indigo-300">
            <Loader2 size={13} className="animate-spin" />
            {step}
          </div>
        </div>
      )}

      {/* Success */}
      {enhancedUrl && !processing && (
        <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs text-emerald-300">
            <Check size={14} />
            Background removed + lighting enhanced
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2.5">
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {/* Buttons */}
      {!enhancedUrl && !processing && (
        <button
          type="button"
          onClick={enhanceImage}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
        >
          <Sparkles size={16} />
          Enhance Photo with AI
        </button>
      )}

      {enhancedUrl && !processing && (
        <div className="flex gap-2">

          <button
            type="button"
            onClick={useEnhancedPhoto}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            <Check size={16} />
            Use Enhanced Photo
          </button>

          <button
            type="button"
            onClick={enhanceImage}
            className="px-4 flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 rounded-xl transition-colors"
            title="Enhance again"
          >
            <RotateCcw size={15} />
          </button>

        </div>
      )}

      {enhancedUrl && !processing && (
        <button
          type="button"
          onClick={useOriginalPhoto}
          className="w-full mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Continue with original photo
        </button>
      )}
    </div>
  );
}