export default function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();

  const configs = {
    processed: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", dot: "#3b82f6", label: "Processed" },
    approved: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", dot: "#22c55e", label: "Approved" },
    rejected: { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca", dot: "#ef4444", label: "Rejected" },
    pending_review: { bg: "#fefce8", color: "#a16207", border: "#fef08a", dot: "#eab308", label: "Pending Review" },
    needs_correction: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa", dot: "#f97316", label: "Needs Correction" },
  };

  const config = configs[normalized] || {
    bg: "#f8fafc", color: "#475569", border: "#e2e8f0", dot: "#94a3b8", label: status || "Unknown"
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border"
      style={{ backgroundColor: config.bg, color: config.color, borderColor: config.border }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.dot }}
      />
      {config.label}
    </span>
  );
}