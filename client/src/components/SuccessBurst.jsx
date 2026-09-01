import { useEffect, useState } from "react";

const COLORS = ["#6366f1", "#a855f7", "#f97316", "#34d399", "#818cf8"];
const PIECE_COUNT = 26;

export default function SuccessBurst() {
  const [pieces] = useState(() =>
    Array.from({ length: PIECE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.25,
      duration: 1.1 + Math.random() * 0.6,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
      size: 6 + Math.random() * 6,
    }))
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1900);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-20px] rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(540deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
