// UploadInvoiceCard.jsx
import { useState } from "react";

export default function UploadInvoiceCard({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedFile) { setError("Please choose an invoice file first."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await onUploadSuccess(selectedFile);
      setSuccess("Invoice uploaded and processed successfully.");
      setSelectedFile(null);
      const input = document.getElementById("invoiceFileInput");
      if (input) input.value = "";
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Upload Invoice</h2>
          <p className="mt-0.5 text-xs text-slate-400">PDF, JPG, JPEG, or PNG invoice files</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          className={`flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${isDragging ? "border-slate-400 bg-slate-50" : selectedFile ? "border-slate-300 bg-slate-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setSelectedFile(f); }}
        >
          <input id="invoiceFileInput" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setSelectedFile(e.target.files[0] || null)} className="hidden" />
          {selectedFile ? (
            <div className="text-center px-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-sm font-medium text-slate-800 truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div className="text-center">
              <svg className="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
              <p className="text-sm text-slate-400"><span className="font-medium text-slate-600">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-slate-300 mt-0.5">PDF, PNG, JPG, JPEG</p>
            </div>
          )}
        </label>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading || !selectedFile}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? (<><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>) : (<>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
              Upload Invoice</>)}
          </button>
          {selectedFile && <button type="button" onClick={() => { setSelectedFile(null); const i = document.getElementById("invoiceFileInput"); if (i) i.value = ""; }} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Clear</button>}
        </div>
        {error && <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600"><svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>{error}</div>}
        {success && <div className="flex items-start gap-2 rounded-xl bg-green-50 border border-green-100 p-3 text-sm text-green-700"><svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>{success}</div>}
      </form>
    </div>
  );
}