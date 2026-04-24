import { useEffect, useRef, useState } from "react";
import type { TelemetryData } from "../types";

export const useTelemetry = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [connected, setConnected] = useState(false);
  const [socketError, setSocketError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);

  const VITE_TELEMETRY_WS_URL =
    import.meta.env.VITE_TELEMETRY_WS_URL || "http://localhost:5000";

  useEffect(() => {
    let isUnmounted = false;
    setIsLoading(true);

    const connect = () => {
      const ws = new WebSocket(`${VITE_TELEMETRY_WS_URL}/ws/telemetry`);

      wsRef.current = ws;

      ws.onopen = () => {
        if (isUnmounted) return;
        setConnected(true);
        setSocketError("");
      };

      ws.onmessage = (event) => {
        if (isUnmounted) return;

        try {
          const parsed = JSON.parse(event.data);
          setTelemetry(parsed);
          setLastUpdated(new Date());
        } catch {
          setSocketError("Received invalid telemetry data");
        } finally {
          setIsLoading(false);
        }
      };

      ws.onerror = () => {
        if (isUnmounted) return;
        setSocketError("Telemetry connection error");
      };

      ws.onclose = () => {
        if (isUnmounted) return;

        setConnected(false);

        reconnectTimerRef.current = window.setTimeout(() => {
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      isUnmounted = true;

      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
      }

      wsRef.current?.close();
    };
  }, []);

  return {
    telemetry,
    connected,
    socketError,
    lastUpdated,
    isLoading,
  };
};
