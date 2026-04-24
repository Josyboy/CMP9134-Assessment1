import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import {
  type RobotMap,
  type RobotStatus,
  type TelemetryData,
  type User,
} from "../types/index";
import TelemetryPanel from "../components/TelemetryPanel";
import ControlPanel from "../components/ControlPanel";
import MapGrid from "../components/MapGrid";
import Navbar from "../components/Navbar";
import PageHelmet from "../components/PageHelmet";
import api from "../services/api";

interface DashboardProps {
  telemetry: TelemetryData | null;
  connected: boolean;
  socketError: string;
  lastUpdated: Date | null;
  isLoading: boolean;
}
const Dashboard: React.FC<DashboardProps> = ({
  telemetry,
  connected,
  socketError,
  lastUpdated,
}) => {
  const [robotStatus, setRobotStatus] = useState<RobotStatus | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [map, setMap] = useState<RobotMap | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const fetchRobotStatus = async () => {
    try {
      const status = await apiService.getRobotStatus();
      setRobotStatus(status);
      //   setLoading(false);
    } catch (error) {
      console.error("Failed to fetch robot status:", error);
    }
  };

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);

    fetchRobotStatus();
  }, []);

  const fetchMapData = async () => {
    setIsLoading(true);

    try {
      const mapResult = await api.getRobotMap();

      setMap(mapResult);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchStatusAndMap = () => {
    fetchRobotStatus();
    fetchMapData();
  };

  useEffect(() => {
    void fetchMapData();
  }, []);

  return (
    <>
      <PageHelmet
        title="Dashboard | Robot GCS"
        description="Monitor robot position, movement, telemetry, and system status."
      />
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className={`mb-3 p-3 rounded-lg text-sm flex items-center justify-between ${
              connected
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-500 text-white"
            }`}>
            <div>
              {connected
                ? "Live telemetry connected"
                : `Telemetry disconnected${socketError ? ` - ${socketError}` : ""}`}
            </div>

            <button
              type="button"
              onClick={refetchStatusAndMap}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white">
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <MapGrid telemetry={telemetry} isLoading={isLoading} map={map} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <TelemetryPanel
                lastUpdated={lastUpdated}
                telemetry={telemetry}
                status={robotStatus}
                connected={connected}
              />
              {/* <SensorPanel /> */}
              <ControlPanel
                isLoading={isLoading}
                disabled={currentUser?.role !== "COMMANDER"}
                telemetry={telemetry}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
