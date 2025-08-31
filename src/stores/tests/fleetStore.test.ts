import { describe, beforeEach, it } from "@jest/globals";
import { useFleet, selectFilteredSortedVehicles, type Vehicle } from "../fleetStore";

function resetStore() {
  useFleet.setState({
    vehicles: [],
    selectedVehicleId: null,
    search: "",
    filterStatus: "all",
    sortBy: null,
    alerts: [],
    online: true,
  });
}

const sample: Vehicle[] = [
  { id: "EV-1", name: "Vehicle 1", speed: 50, battery: 80, temperature: 22, tireFL: 32, tireFR: 32, tireRL: 32, tireRR: 32, motorEfficiency: 90, regenActive: true, status: "moving",   distance: 1000, lat: 50.9, lng: 6.9 },
  { id: "EV-2", name: "Vehicle 2", speed:  0, battery: 45, temperature: 23, tireFL: 32, tireFR: 32, tireRL: 32, tireRR: 32, motorEfficiency: 90, regenActive: true, status: "idle",     distance:  800, lat: 50.8, lng: 6.8 },
  { id: "EV-3", name: "Vehicle 3", speed:  0, battery: 15, temperature: 21, tireFL: 32, tireFR: 32, tireRL: 32, tireRR: 32, motorEfficiency: 90, regenActive: true, status: "charging", distance:  500, lat: 50.7, lng: 6.7 },
];

describe("fleetStore", () => {
  beforeEach(resetStore);

  it("sets vehicles and auto-selects first; preserves selection if present", () => {
    const { setVehicles, selectVehicle } = useFleet.getState();

    setVehicles(sample);
    expect(useFleet.getState().selectedVehicleId).toBe("EV-1");

    selectVehicle("EV-2");
    setVehicles([sample[1], sample[2]]); // EV-2 still present
    expect(useFleet.getState().selectedVehicleId).toBe("EV-2");
  });

  it("falls back to first vehicle if current selection disappears", () => {
    const { setVehicles, selectVehicle } = useFleet.getState();

    setVehicles(sample);
    selectVehicle("EV-2");
    // Now EV-2 is missing from the incoming list → selection should jump to first item
    setVehicles([sample[0], sample[2]]);
    expect(useFleet.getState().selectedVehicleId).toBe("EV-1");
  });

  it("filters by status and sorts by battery desc", () => {
    useFleet.setState({ vehicles: sample, filterStatus: "charging", sortBy: "battery", search: "" });
    const onlyCharging = selectFilteredSortedVehicles(useFleet.getState());
    expect(onlyCharging.map(v => v.id)).toEqual(["EV-3"]);

    useFleet.setState({ filterStatus: "all", sortBy: "battery" });
    const sorted = selectFilteredSortedVehicles(useFleet.getState());
    expect(sorted.map(v => v.battery)).toEqual([80, 45, 15]);
  });

  it("search filters by name or id (case-insensitive)", () => {
    useFleet.setState({ vehicles: sample, search: "vehicle 2", filterStatus: "all", sortBy: null });
    const filteredByName = selectFilteredSortedVehicles(useFleet.getState());
    expect(filteredByName.map(v => v.id)).toEqual(["EV-2"]);

    useFleet.setState({ search: "ev-3" });
    const filteredById = selectFilteredSortedVehicles(useFleet.getState());
    expect(filteredById.map(v => v.id)).toEqual(["EV-3"]);
  });

  it("pushAlert adds and ackAll clears alerts (when online)", () => {
    const { pushAlert, ackAll } = useFleet.getState();
    pushAlert({ id: "a1", vehicleId: "EV-1", type: "speeding", severity: "warning", message: "Fast!", ts: Date.now() });
    pushAlert({ id: "a2", vehicleId: "EV-2", type: "battery_low", severity: "critical", message: "Low battery", ts: Date.now() });
    expect(useFleet.getState().alerts.length).toBe(2);

    ackAll();
    expect(useFleet.getState().alerts.length).toBe(0);
  });

  it("does not add alerts while offline", () => {
    const { pushAlert } = useFleet.getState();
    useFleet.setState({ online: false });

    pushAlert({ id: "a3", vehicleId: "EV-1", type: "other", severity: "info", message: "noop", ts: Date.now() });
    expect(useFleet.getState().alerts.length).toBe(0);
  });
});
