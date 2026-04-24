import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AuditLogs from "./pages/AuditLog";
import Users from "./pages/Users";
import { ToastContainer } from "react-toastify";
import LidarSummary from "./pages/LidarSummary";
import { useTelemetry } from "./hooks/useTelemetry";

function App() {
  const { telemetry, connected, socketError, lastUpdated, isLoading } =
    useTelemetry();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="text-white text-center font-medium !font-montserrat"
      />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                telemetry={telemetry}
                connected={connected}
                socketError={socketError}
                lastUpdated={lastUpdated}
                isLoading={isLoading}
              />
            }
          />
          <Route path="/audit_logs" element={<AuditLogs />} />
          <Route path="/users" element={<Users />} />
          <Route
            path="/lidar_summary"
            element={
              <LidarSummary telemetry={telemetry} isLoading={isLoading} />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
