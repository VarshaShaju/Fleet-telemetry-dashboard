type Status = "moving" | "charging" | "idle";

export type Vehicle = {
  id: string; name: string;
  speed: number; battery: number; temperature: number;
  tireFL: number; tireFR: number; tireRL: number; tireRR: number;
  motorEfficiency: number; regenActive: boolean;
  status: Status; distance: number; lat: number; lng: number;
};

const CENTER = { lat: 50.9375, lng: 6.9603 };
const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

function createFleet(n = 10): Vehicle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `EV-${String(i + 1).padStart(2, "0")}`,
    name: `EV - ${i + 1}`,
    speed: 0,
    battery: Math.round(rnd(40, 95)),
    temperature: Math.round(rnd(20, 38)),
    tireFL: Math.round(rnd(32, 36)), tireFR: Math.round(rnd(32, 36)),
    tireRL: Math.round(rnd(32, 36)), tireRR: Math.round(rnd(32, 36)),
    motorEfficiency: Math.round(rnd(80, 98)),
    regenActive: false,
    status: pick<Status>(["moving", "idle", "charging"]),
    distance: Math.round(rnd(1000, 25000)) / 10,
    lat: CENTER.lat + rnd(-0.2, 0.2),
    lng: CENTER.lng + rnd(-0.2, 0.2),
  }));
}

let started = false;
let timer: ReturnType<typeof setTimeout> | null = null;

// mock telemetry 
export function initializeMockData(count = 10): () => void {
  if (typeof window === "undefined") return () => {};
  if (started) return stop;

  started = true;
  const fleet = createFleet(count);

  const tick = () => {
    for (const v of fleet) {
      if (Math.random() < 0.05) v.status = pick<Status>(["moving", "idle", "charging"]);

      if (v.status === "moving") {
        v.speed = Math.max(0, Math.min(120, v.speed + rnd(-10, 15)));
        const km = (v.speed / 3600) * rnd(1, 5);
        v.distance += km;
        v.lat += rnd(-0.0008, 0.0008);
        v.lng += rnd(-0.0008, 0.0008);
        v.battery = Math.max(0, v.battery - rnd(0.02, 0.15));
        v.temperature = Math.max(15, Math.min(65, v.temperature + rnd(-0.3, 0.6)));
        v.regenActive = Math.random() < 0.3 && v.speed > 10;
      } else if (v.status === "charging") {
        v.speed = 0;
        v.battery = Math.min(100, v.battery + rnd(0.2, 0.7));
        v.temperature = Math.max(15, Math.min(55, v.temperature + rnd(-0.2, 0.2)));
        v.regenActive = false;
      } else {
        v.speed = 0;
        v.temperature = Math.max(15, Math.min(45, v.temperature + rnd(-0.2, 0.2)));
        v.regenActive = false;
      }

      v.tireFL = Math.max(28, Math.min(40, v.tireFL + rnd(-0.05, 0.05)));
      v.tireFR = Math.max(28, Math.min(40, v.tireFR + rnd(-0.05, 0.05)));
      v.tireRL = Math.max(28, Math.min(40, v.tireRL + rnd(-0.05, 0.05)));
      v.tireRR = Math.max(28, Math.min(40, v.tireRR + rnd(-0.05, 0.05)));
      v.motorEfficiency = Math.max(70, Math.min(99, v.motorEfficiency + rnd(-0.5, 0.5)));
    }

    const payload: Vehicle[] = fleet.map(v => ({ ...v }));
    window.dispatchEvent(new CustomEvent<Vehicle[]>("telemetry", { detail: payload }));
    timer = setTimeout(tick, Math.floor(rnd(1000, 5000)));
  };

  tick();
  return stop;
}

function stop() {
  if (timer) clearTimeout(timer);
  timer = null;
  started = false;
}
