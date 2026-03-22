import AppHeader from "../components/AppHeader";
import UniversalUploadCard from "../components/UniversalUploadCard";
import { uploadUniversalDocument } from "../api/documentHubApi";

export default function UniversalUploadPage() {
  async function handleUniversalUpload(file) {
    return await uploadUniversalDocument(file);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="mx-auto max-w-6xl p-6">
        <AppHeader />

        <div className="mb-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Universal Workspace
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Smart Document Upload
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Upload any supported business document and let the system detect
                the type automatically before routing it to the correct
                workflow.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Supported Types
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">3</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <UniversalUploadCard onUpload={handleUniversalUpload} />

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Document Types
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                Supported Document Types
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                The system identifies the uploaded file and sends it to the
                correct process automatically.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 ring-1 ring-blue-200">
                  Invoice
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  Invoice Workflow
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Automatically routed to the Finance workflow for validation,
                  review, and approval.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                  Leave Request
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  HR Workflow
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Automatically routed to HR for employee leave review and
                  approval handling.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                <div className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">
                  Complaint
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  Complaint Workflow
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Automatically routed depending on urgency, complaint type, and
                  responsible department.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}