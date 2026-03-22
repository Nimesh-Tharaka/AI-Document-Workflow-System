import { useState } from "react";
import { useNavigate } from "react-router";

function formatDocumentType(type) {
  const map = {
    invoice: "Invoice",
    leave_request: "Leave Request",
    complaint: "Complaint",
  };

  return map[type] || type;
}

function getDocumentStyle(type) {
  const normalized = (type || "").toLowerCase();

  if (normalized === "invoice") {
    return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
  }

  if (normalized === "leave_request") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }

  if (normalized === "complaint") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  }

  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

export default function UniversalUploadCard({ onUpload }) {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [detectedType, setDetectedType] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please choose a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setDetectedType("");

    try {
      const result = await onUpload(selectedFile);

      setDetectedType(result.document_type || "");
      setSuccess(
        `Detected as ${formatDocumentType(result.document_type)}. Redirecting...`
      );

      setSelectedFile(null);

      const input = document.getElementById("universalDocumentFileInput");
      if (input) input.value = "";

      setTimeout(() => {
        navigate(result.redirect_path);
      }, 700);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Upload Center
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Universal Upload
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Upload an Invoice, Leave Request, or Complaint file. The system will
            detect the document type automatically and redirect you to the
            correct workflow.
          </p>
        </div>

        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
          Smart Detection
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          id="universalDocumentFileInput"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(event) => setSelectedFile(event.target.files[0] || null)}
          className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition-all duration-200 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:border-slate-400 hover:bg-white"
        />

        {selectedFile && (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-100">
            <span className="font-medium text-slate-900">Selected File:</span>{" "}
            {selectedFile.name}
          </div>
        )}

        {detectedType && (
          <div
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getDocumentStyle(
              detectedType
            )}`}
          >
            Detected: {formatDocumentType(detectedType)}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upload and Detect"}
        </button>

        {error && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 ring-1 ring-emerald-100">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}