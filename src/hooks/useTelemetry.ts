import { useEffect } from "react";
import { useFleet, Alert, Vehicle } from "../stores/fleetStore";

function thresholdAlerts(snapshot: Vehicle[]): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();

  snapshot.forEach(v => {
    if (v.battery < 20) {
      alerts.push({
        id: `${now}-${v.id}-battery`,
        vehicleId: v.id,
        type: "battery_low",
        severity: v.battery < 10 ? "critical" : "warning",
        message: `${v.name}: Battery low (${v.battery.toFixed(0)}%)`,
        ts: now,
      });
    }
    if (v.temperature > 60) {
      alerts.push({
        id: `${now}-${v.id}-temp`,
        vehicleId: v.id,
        type: "temp_high",
        severity: "critical",
        message: `${v.name}: High temperature (${v.temperature.toFixed(1)}°C)`,
        ts: now,
      });
    }
    const tires = [v.tireFL, v.tireFR, v.tireRL, v.tireRR];
    if (tires.some(t => t < 30 || t > 38)) {
      alerts.push({
        id: `${now}-${v.id}-tire`,
        vehicleId: v.id,
        type: "tire_pressure",
        severity: "warning",
        message: `${v.name}: Tire pressure out of range`,
        ts: now,
      });
    }
    if (v.speed > 110) {
      alerts.push({
        id: `${now}-${v.id}-speed`,
        vehicleId: v.id,
        type: "speeding",
        severity: "warning",
        message: `${v.name}: Speeding (${Math.round(v.speed)} km/h)`,
        ts: now,
      });
    }
  });

  return alerts;
}

function randomMockAlerts(snapshot: Vehicle[]): Alert[] {
  // Occasionally (about 1 in 10 updates) add a random demo alert
  if (!snapshot.length || Math.random() > 0.1) return [];
  const v = snapshot[Math.floor(Math.random() * snapshot.length)];
  const now = Date.now();
  const options: Omit<Alert, "id" | "ts">[] = [
    { vehicleId: v.id, type: "geofence", severity: "warning", message: `${v.name}: Geofence exit detected` },
    { vehicleId: v.id, type: "harsh_braking", severity: "warning", message: `${v.name}: Harsh braking detected` },
    { vehicleId: v.id, type: "charging_complete", severity: "info", message: `${v.name}: Charging complete` },
  ];
  const pick = options[Math.floor(Math.random() * options.length)];
  return [{ ...pick, id: `${now}-${v.id}-${pick.type}`, ts: now }];
}

export function useTelemetry() {
  const setVehicles = useFleet(s => s.setVehicles);
  const pushAlert = useFleet(s => s.pushAlert);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: Event) => {
      const snapshot = (e as CustomEvent<Vehicle[]>).detail;
      if (!Array.isArray(snapshot)) return;

      setVehicles(snapshot);
      [...thresholdAlerts(snapshot), ...randomMockAlerts(snapshot)].forEach(pushAlert);
    };

    window.addEventListener("telemetry", handler as EventListener);
    return () => window.removeEventListener("telemetry", handler as EventListener);
  }, [setVehicles, pushAlert]);
}
