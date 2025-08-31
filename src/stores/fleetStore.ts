import { create } from "zustand";

export type Status = "moving" | "charging" | "idle";

export type Vehicle = {
  id: string;
  name: string;
  speed: number;
  battery: number;
  temperature: number;
  tireFL: number;
  tireFR: number;
  tireRL: number;
  tireRR: number;
  motorEfficiency: number;
  regenActive: boolean;
  status: Status;
  distance: number;
  lat: number;
  lng: number;
};

export type Alert = {
  id: string;
  vehicleId: string;
  type:
    | "battery_low"
    | "temp_high"
    | "tire_pressure"
    | "speeding"
    | "geofence"
    | "harsh_braking"
    | "charging_complete"
    | "other";
  severity: "info" | "warning" | "critical";
  message: string;
  ts: number;
  acknowledged?: boolean;
};

type FleetState = {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;

  search: string;
  filterStatus: "all" | Status;
  sortBy: "battery" | "speed" | "distance" | null;

  alerts: Alert[];

  online: boolean;
  setOnline: (online: boolean) => void;

  setVehicles: (v: Vehicle[]) => void;
  selectVehicle: (id: string) => void;
  setSearch: (q: string) => void;
  setFilterStatus: (s: "all" | Status) => void;
  setSortBy: (s: FleetState["sortBy"]) => void;

  pushAlert: (a: Alert) => void;
  ackAlert: (id: string) => void;
  ackAll: () => void;
};

export const useFleet = create<FleetState>((set, get) => ({
  vehicles: [],
  selectedVehicleId: null,

  search: "",
  filterStatus: "all",
  sortBy: null,

  alerts: [],

  online: true,
  setOnline: (online) => set({ online }),

  setVehicles: (incoming) => {
    const isFirstSet = get().vehicles.length === 0;
    if (!get().online && !isFirstSet) return;

    set({ vehicles: incoming });

    if (isFirstSet && incoming.length) {
      set({ selectedVehicleId: incoming[0].id });
    } else {
      const sel = get().selectedVehicleId;
      if (sel && !incoming.some(v => v.id === sel)) {
        set({ selectedVehicleId: incoming[0]?.id ?? null });
      }
    }
  },

  selectVehicle: (id) => set({ selectedVehicleId: id }),
  setSearch: (q) => set({ search: q }),
  setFilterStatus: (s) => set({ filterStatus: s }),
  setSortBy: (s) => set({ sortBy: s }),

  pushAlert: (a) => {
    if (!get().online) return;

    const next = [a, ...get().alerts];
    const seen = new Set<string>();
    const deduped: Alert[] = [];
    for (const alert of next) {
      if (seen.has(alert.id)) continue;
      seen.add(alert.id);
      deduped.push(alert);
      if (deduped.length >= 50) break;
    }
    set({ alerts: deduped });
  },

  ackAlert: (id) => set({ alerts: get().alerts.filter(a => a.id !== id) }),

  ackAll: () => set({ alerts: [] }),
}));

export const selectSelectedVehicle = (s: FleetState) =>
  s.vehicles.find(v => v.id === s.selectedVehicleId) || null;

export const selectFilteredSortedVehicles = (s: FleetState) => {
  let list = s.vehicles;

  const q = s.search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      v => v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q)
    );
  }

  if (s.filterStatus !== "all") {
    list = list.filter(v => v.status === s.filterStatus);
  }

  if (s.sortBy) {
    const key = s.sortBy;
    list = [...list].sort((a, b) => {
      if (key === "battery") return b.battery - a.battery;
      if (key === "speed") return b.speed - a.speed;
      if (key === "distance") return b.distance - a.distance;
      return 0;
    });
  }

  return list;
};
