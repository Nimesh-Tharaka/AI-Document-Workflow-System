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
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold text-slate-900">Upload Leave Request</h2>
      <p className="mt-1 text-sm text-slate-500">
        Upload PDF, JPG, JPEG, or PNG leave request files.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <input
          id="leaveRequestFileInput"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(event) => setSelectedFile(event.target.files[0] || null)}
          className="block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm"
        />

        {selectedFile && (
          <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
            Selected File: <span className="font-medium">{selectedFile.name}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upload Leave Request"}
        </button>

        {error && (
          <div className="rounded-xl bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-green-100 p-3 text-sm text-green-700">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}