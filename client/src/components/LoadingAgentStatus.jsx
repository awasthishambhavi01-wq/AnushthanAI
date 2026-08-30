const STEPS = [
  { key: "vision", label: "Vision agent — reading your photo" },
  { key: "catalog", label: "Catalog agent — writing the listing" },
  { key: "pricing", label: "Pricing agent — checking market rates" },
];

/**
 * Shows a sequential "agent working" list while the pipeline runs.
 * activeIndex tells us which step is currently in progress (0, 1, 2).
 * Steps before activeIndex are shown as done; steps after are pending.
 */
export default function LoadingAgentStatus({ activeIndex }) {
  return (
    <div className="agent-status-list">
      {STEPS.map((step, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "pending";
        return (
          <div key={step.key} className={`agent-status-row ${state}`}>
            <span className="agent-dot" />
            <span>
              {state === "done" ? "✓ " : ""}
              {step.label}
              {state === "active" ? "…" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
