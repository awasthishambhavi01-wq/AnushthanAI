import { useState } from "react";
import Home from "./pages/Home.jsx";
import Result from "./pages/Result.jsx";

// No router library needed for a prototype this size — we just track
// whether we have a finished listing yet and swap views based on that.
export default function App() {
  const [listing, setListing] = useState(null);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo">V</div>
        <div>
          <h1 className="app-title">VyaparAI</h1>
          <p className="app-subtitle">Photo in, professional listing out.</p>
        </div>
      </header>

      {!listing ? (
        <Home onListingGenerated={setListing} />
      ) : (
        <Result listing={listing} onStartOver={() => setListing(null)} />
      )}
    </div>
  );
}
