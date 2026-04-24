import React, { useState } from "react";
import apiService from "../services/api";
import { Move, RotateCcw, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import type { TelemetryData } from "../types";

interface ControlPanelProps {
  isLoading: boolean;
  disabled?: boolean;
  telemetry: TelemetryData | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isLoading,
  disabled = false,
  telemetry,
}) => {
  const [x, setX] = useState<number>(telemetry?.position?.x || 0);
  const [y, setY] = useState<number>(telemetry?.position?.y || 0);
  const [loadingMove, setLoadingMove] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMove = async () => {
    if (telemetry?.battery !== undefined && telemetry?.battery < 1) {
      return toast.error("Battery Low Please Reset");
    }

    setLoadingMove(true);
    setError(null);
    try {
      await apiService.moveRobot(x, y);
    } catch (err: any) {
      setError(err.response?.data?.message || "Move command failed");
    } finally {
      setLoadingMove(false);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleReset = async () => {
    setLoadingReset(true);
    setError(null);
    try {
      await apiService.resetRobot();
      setX(0);
      setY(0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset command failed");
    } finally {
      setLoadingReset(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Robot Control</h3>

      {disabled && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
          You have viewer permissions. Only commanders can control the robot.
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              X Coordinate
            </label>
            <input
              type="text"
              value={x}
              onChange={(e) => {
                if (Number(e.target.value) > 20 || Number(e.target.value) < 0) {
                  return toast.error("You can only enter digit from 0 - 20");
                }
                setX(parseInt(e.target.value) || 0);
              }}
              disabled={disabled || loadingMove}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Y Coordinate
            </label>
            <input
              type="text"
              value={y}
              onChange={(e) => {
                if (Number(e.target.value) > 20 || Number(e.target.value) < 0) {
                  return toast.error("You can only enter digit from 0 - 20");
                }
                setY(parseInt(e.target.value) || 0);
              }}
              disabled={disabled || loadingMove}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleMove}
            disabled={disabled || loadingMove}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loadingMove ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Move className="w-4 h-4" />
            )}
            Move Robot
          </button>

          <button
            onClick={handleReset}
            disabled={disabled || loadingReset}
            className="flex items-center justify-center gap-2 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loadingReset ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Reset Position
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
