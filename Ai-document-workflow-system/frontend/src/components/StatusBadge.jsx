function formatStatus(status) {
  if (!status) return "Unknown";
  return status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();

  let classes = "bg-slate-100 text-slate-700 ring-slate-200";
  let dotClass = "bg-slate-500";

  if (normalized === "processed") {
    classes = "bg-blue-50 text-blue-700 ring-blue-200";
    dotClass = "bg-blue-500";
  } else if (normalized === "approved") {
    classes = "bg-emerald-50 text-emerald-700 ring-emerald-200";
    dotClass = "bg-emerald-500";
  } else if (normalized === "rejected") {
    classes = "bg-rose-50 text-rose-700 ring-rose-200";
    dotClass = "bg-rose-500";
  } else if (normalized === "pending_review") {
    classes = "bg-amber-50 text-amber-700 ring-amber-200";
    dotClass = "bg-amber-500";
  } else if (normalized === "needs_correction") {
    classes = "bg-orange-50 text-orange-700 ring-orange-200";
    dotClass = "bg-orange-500";
  }

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${classes}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
      {formatStatus(status)}
    </span>
  );
}
