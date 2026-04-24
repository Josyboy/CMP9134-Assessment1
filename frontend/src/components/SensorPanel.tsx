import React, { useEffect, useState } from "react";
import apiService from "../services/api";
import { type SensorData } from "../types/index";
import { Activity, Sun, Volume2, Thermometer, Droplet } from "lucide-react";

const SensorPanel: React.FC = () => {
  const [sensors, setSensors] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSensors();
  }, []);

  const fetchSensors = async () => {
    try {
      const data = await apiService.getSensorData();
      setSensors(data);
    } catch (error) {
      console.error("Failed to fetch sensor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProximityColor = (value: number) => {
    if (value < 30) return "text-red-600";
    if (value < 70) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Sensor Data</h3>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 rounded"></div>
          ))}
        </div>
      ) : sensors ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Proximity</span>
            </div>
            <span
              className={`font-semibold ${getProximityColor(sensors.proximity)}`}>
              {sensors.proximity} cm
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </div>
            <span className="font-semibold">{sensors.light} lux</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Sound</span>
            </div>
            <span className="font-semibold">{sensors.sound} dB</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              <span>Temperature</span>
            </div>
            <span className="font-semibold">{sensors.temperature}°C</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4" />
              <span>Humidity</span>
            </div>
            <span className="font-semibold">{sensors.humidity}%</span>
          </div>

          {sensors.proximity < 30 && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              ⚠️ Obstacle detected nearby!
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-slate-500 py-8">
          No sensor data available
        </div>
      )}
    </div>
  );
};

export default SensorPanel;
