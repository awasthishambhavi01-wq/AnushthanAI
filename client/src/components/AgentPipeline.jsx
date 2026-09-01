import { Eye, Sparkles, IndianRupee, Check, X, Loader2 } from "lucide-react";

const STEPS = [
  {
    key: "vision",
    label: "Vision Agent",
    sublabel: "Reading & understanding product image",
    Icon: Eye,
    color: "indigo",
  },
  {
    key: "catalog",
    label: "Catalog Agent",
    sublabel: "Creating marketplace listing",
    Icon: Sparkles,
    color: "purple",
  },
  {
    key: "pricing",
    label: "Pricing Agent",
    sublabel: "Estimating market price",
    Icon: IndianRupee,
    color: "orange",
  },
];

const COLOR_MAP = {
  indigo: { bg: "bg-indigo-500", ring: "ring-indigo-500/30", text: "text-indigo-400", glow: "shadow-indigo-500/40" },
  purple: { bg: "bg-purple-500", ring: "ring-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/40" },
  orange: { bg: "bg-orange-500", ring: "ring-orange-500/30", text: "text-orange-400", glow: "shadow-orange-500/40" },
};

/**
 * statuses: { vision: 'waiting'|'running'|'completed'|'error', catalog: ..., pricing: ... }
 * This is a real visual representation of the backend pipeline order
 * (vision -> catalog -> pricing) - not fabricated telemetry, just an
 * honest approximation of progress since the backend returns one
 * response rather than streaming per-agent events.
 */
export default function AgentPipeline({ statuses }) {
  return (
    <div className="glass-card rounded-2xl p-6 animate-pop-in">
      <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-5">
        AI Agent Pipeline
      </div>

      <div className="flex flex-col">
        {STEPS.map((step, i) => {
          const status = statuses[step.key];
          const colors = COLOR_MAP[step.color];
          const isLast = i === STEPS.length - 1;
          const prevCompleted = i === 0 || statuses[STEPS[i - 1].key] === "completed" || statuses[STEPS[i - 1].key] === "error" && false;
          const lineFill = statuses[STEPS[i - 1]?.key] === "completed" ? 1 : 0;

          return (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300
                    ${status === "completed" ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30" : ""}
                    ${status === "running" ? `${colors.bg} border-transparent shadow-lg ${colors.glow}` : ""}
                    ${status === "error" ? "bg-red-500 border-red-500 shadow-lg shadow-red-500/30" : ""}
                    ${status === "waiting" ? "bg-zinc-800/80 border-zinc-700" : ""}
                  `}
                >
                  {status === "completed" && <Check size={18} className="text-white" />}
                  {status === "running" && <Loader2 size={18} className="text-white animate-spin-slow" />}
                  {status === "error" && <X size={18} className="text-white" />}
                  {status === "waiting" && <step.Icon size={17} className="text-zinc-500" />}
                </div>
                {!isLast && (
                  <div
                    className="pipeline-line h-10 my-0.5"
                    style={{ "--fill": lineFill }}
                  />
                )}
              </div>

              <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                <div
                  className={`text-sm font-semibold transition-colors
                    ${status === "waiting" ? "text-zinc-500" : "text-zinc-100"}`}
                >
                  {step.label}
                  {status === "running" && <span className={`ml-2 text-xs font-normal ${colors.text}`}>running…</span>}
                  {status === "completed" && <span className="ml-2 text-xs font-normal text-emerald-400">completed</span>}
                  {status === "error" && <span className="ml-2 text-xs font-normal text-red-400">error</span>}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">{step.sublabel}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
