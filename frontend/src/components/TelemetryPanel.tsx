import React from "react";
import { Battery, Activity, Wifi } from "lucide-react";
import { type RobotStatus, type TelemetryData } from "../types/index";
import { formatTime } from "./Utils";

interface TelemetryPanelProps {
  lastUpdated: Date | null;
  telemetry: TelemetryData | null;
  status: RobotStatus | null;
  connected: boolean;
}

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  lastUpdated,
  telemetry,
  connected,
}) => {
  const getBatteryColor = (level: number) => {
    if (level < 20) return "text-red-600";
    if (level < 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IDLE":
        return "text-gray-400";
      case "MOVING":
        return "text-blue-500 animate-pulse";
      case "LOW_BATTERY":
        return "text-red-500";
      case "STUCK":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const getConnectionIcon = () => {
    if (connected) {
      return <Wifi className="w-5 h-5 text-green-600" />;
    } else {
      return <Wifi className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Telemetry Data</h3>
        <div className="flex items-center gap-2">
          {getConnectionIcon()}
          <span className="text-sm capitalize">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {telemetry ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Battery className="w-5 h-5" />
              <span>Battery</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-semibold ${getBatteryColor(telemetry.battery ?? 0)}`}>
                {telemetry.battery ?? 0}%
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              <span>Status</span>
            </div>
            <span
              className={`font-semibold capitalize ${getStatusColor(telemetry.status ?? "")}`}>
              {telemetry.status?.replace("_", " ")}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Position</span>
            </div>
            <span className="font-semibold">
              ({telemetry?.position?.x ?? "0"}, {telemetry?.position?.y ?? "0"})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Updated</span>
            </div>
            <span className="font-semibold">
              {formatTime(lastUpdated?.toString() || "")}
            </span>
          </div>

          {(telemetry.battery ?? 0) < 20 && (
            <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ Low Battery Warning! Please recharge soon.
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-slate-500 py-8">
          Waiting for telemetry data...
        </div>
      )}
    </div>
  );
};

export default TelemetryPanel;
