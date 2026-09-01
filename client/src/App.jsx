import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import Home from "./pages/Home.jsx";
import Result from "./pages/Result.jsx";
import { checkHealth } from "./api/vyaparApi.js";

export default function App() {
  const [listing, setListing] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [backendOnline, setBackendOnline] = useState(null); // null = checking

  useEffect(() => {
    checkHealth().then(setBackendOnline);
    const interval = setInterval(() => checkHealth().then(setBackendOnline), 30000);
    return () => clearInterval(interval);
  }, []);

  function handleListingGenerated(generatedListing, originalPhotoFile) {
    setListing(generatedListing);
    setPhotoFile(originalPhotoFile);
  }

  function handleStartOver() {
    setListing(null);
    setPhotoFile(null);
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-5 pt-8 pb-16">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 mb-8 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-display font-bold text-lg shadow-lg shadow-indigo-500/20 shrink-0">
              V
            </div>
            <div>
              <h1 className="text-lg font-display font-semibold text-zinc-100 leading-tight">
                AnushthanAI
              </h1>
              <p className="text-xs text-zinc-500">Photo in, professional listing out.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full glass-card">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendOnline === null
                  ? "bg-zinc-500"
                  : backendOnline
                  ? "bg-emerald-400 animate-pulse-ring"
                  : "bg-red-500"
              }`}
            />
            <span
              className={
                backendOnline === null
                  ? "text-zinc-500"
                  : backendOnline
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            >
              {backendOnline === null ? "Checking..." : backendOnline ? "AI SYSTEM ONLINE" : "Backend offline"}
            </span>
          </div>
        </header>

        {/* Hero - only on the input screen */}
        {!listing && (
          <div className="mb-8 animate-fade-up" style={{ animationDelay: "80ms", animationFillMode: "backwards" }}>
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Sparkles size={13} />
              Powered by Agentic AI
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight text-zinc-50">
              Turn any product photo into a{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                market-ready listing
              </span>{" "}
              — in seconds.
            </h2>
            <p className="text-zinc-400 mt-3 text-[15px] max-w-lg">
              Upload a photo, describe it in your own words, and let a chain of AI agents handle
              vision, copywriting, and pricing — end to end.
            </p>
          </div>
        )}

        {!listing ? (
          <Home onListingGenerated={handleListingGenerated} />
        ) : (
          <Result listing={listing} photoFile={photoFile} onStartOver={handleStartOver} />
        )}
      </div>
    </div>
  );
}
