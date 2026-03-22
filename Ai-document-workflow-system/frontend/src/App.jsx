import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import InvoicePage from "./pages/InvoicePage";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";
import InvoiceDashboardPage from "./pages/InvoiceDashboardPage";
import LeaveRequestPage from "./pages/LeaveRequestPage";
import LeaveRequestDetailPage from "./pages/LeaveRequestDetailPage";
import ComplaintPage from "./pages/ComplaintPage";
import ComplaintDetailPage from "./pages/ComplaintDetailPage";
import UniversalUploadPage from "./pages/UniversalUploadPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UniversalUploadPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <InvoicePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices/:invoiceId"
        element={
          <ProtectedRoute>
            <InvoiceDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave-requests"
        element={
          <ProtectedRoute>
            <LeaveRequestPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave-requests/:leaveRequestId"
        element={
          <ProtectedRoute>
            <LeaveRequestDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <ComplaintPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/complaints/:complaintId"
        element={
          <ProtectedRoute>
            <ComplaintDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["admin", "approver"]}>
            <InvoiceDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}