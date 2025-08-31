import "./index.css";
import "leaflet/dist/leaflet.css";
import "./i18n";

import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppShell from "./components/layout/AppShell";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ui/ErrorFallback";

import { useTelemetry } from "./hooks/useTelemetry";
import { useOfflineDetector } from "./hooks/useOfflineDetector";
import { useUI } from "./stores/uiStore";
import { useFleet } from "./stores/fleetStore";

export default function App() {
  useTelemetry();
  useOfflineDetector();

  useEffect(() => {
    useFleet.getState().setOnline(useUI.getState().online);
    const unsub = useUI.subscribe(
      (state) => {
        useFleet.getState().setOnline(state.online);
      }
    );
    return () => unsub();
  }, []);

  return (
    <ThemeProvider>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // optional: reset state if needed
          window.location.reload();
        }}
      >
        <AppShell />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
