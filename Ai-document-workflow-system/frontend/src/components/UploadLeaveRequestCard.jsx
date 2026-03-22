import { useState } from "react";

export default function UploadLeaveRequestCard({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please choose a leave request file first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await onUploadSuccess(selectedFile);
      setSuccess("Leave request uploaded and processed successfully.");
      setSelectedFile(null);

      const input = document.getElementById("leaveRequestFileInput");
      if (input) input.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Upload Leave Request</h2>
          <p className="mt-1 text-sm text-slate-500">Upload PDF, JPG, JPEG, or PNG leave request files.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          Smart Intake
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          htmlFor="leaveRequestFileInput"
          className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition-all duration-200 hover:border-slate-400 hover:bg-white"
        >
          <span className="text-base font-semibold text-slate-800">Choose leave request file</span>
          <span className="mt-2 text-sm text-slate-500">Drag and drop or click to browse</span>
        </label>

        <input
          id="leaveRequestFileInput"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(event) => setSelectedFile(event.target.files[0] || null)}
          className="hidden"
        />

        {selectedFile && (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-100">
            Selected File: <span className="font-semibold text-slate-900">{selectedFile.name}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upload Leave Request"}
        </button>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}
