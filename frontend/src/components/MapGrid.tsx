import { Bot } from "lucide-react";
import type { RobotMap, TelemetryData } from "../types";

type MapGridProps = {
  telemetry: TelemetryData | null;
  isLoading: boolean;
  map: RobotMap | null;
};

const MapGrid: React.FC<MapGridProps> = ({ telemetry, isLoading, map }) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!map) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Environment Map
        </h2>
        <div className="animate-spin rounded-full h-[1.5rem] w-[1.5rem] border-b-2 border-white" />
      </div>
    );
  }

  const robotX = telemetry?.position?.x;
  const robotY = telemetry?.position?.y;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Environment Map
          </h2>
          <p className="text-sm text-slate-500">
            Obstacles, free cells, and current robot position
          </p>
        </div>

        <div className="flex gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-slate-200" />
            Free
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-red-600" />
            Obstacle
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-blue-600" />
            Robot
          </span>
        </div>
      </div>

      <div className="overflow-auto">
        <div
          className="grid gap-[2px] rounded-xl bg-slate-300 p-2"
          style={{
            gridTemplateColumns: `repeat(${map.width}, minmax(0, 1fr))`,
          }}>
          {map?.grid?.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isRobot = robotX === colIndex && robotY === rowIndex;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`flex aspect-square items-center justify-center rounded-[4px] text-[10px] font-medium ${
                    isRobot
                      ? "bg-blue-600 text-white"
                      : cell === 1
                        ? "bg-red-600 text-white"
                        : "bg-white text-slate-400"
                  }`}
                  title={
                    isRobot
                      ? `Robot (${colIndex}, ${rowIndex})`
                      : cell === 1
                        ? `Obstacle (${colIndex}, ${rowIndex})`
                        : `Free (${colIndex}, ${rowIndex})`
                  }>
                  {isRobot ? <Bot size={22} /> : ""}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
};

export default MapGrid;
