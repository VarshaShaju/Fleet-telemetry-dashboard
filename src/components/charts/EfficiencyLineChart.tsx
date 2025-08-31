import { useMemo, useRef } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useTheme } from "../../contexts/ThemeContext";

/** deterministic PRNG so each vehicle has a stable series */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

type Props = {
  vehicleId: string;
  height?: number;
  title?: string;
  fleetAvg?: number;
};

export default function EfficiencyLineChart({
  vehicleId,
  height = 160,
  title,
  fleetAvg,
}: Props) {
  const { theme } = useTheme();
  const axis = theme === "dark" ? "#d4d4d8" : "#525252";
  const grid = theme === "dark" ? "rgba(212,212,216,.2)" : "rgba(0,0,0,.08)";
  const line = "rgba(92, 155, 192, 1)";
  const tipBorder = theme === "dark" ? "rgba(82,82,82,.8)" : "rgba(0,0,0,.06)";

  // Generate 12 months of efficiency data (kWh/100km) with upward trend + noise
  const data = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const seed = hashStr(vehicleId);
    const rnd = mulberry32(seed);
    const base = 14 + (seed % 1400) / 1000;
    const trend = 0.12;
    return months.map((m, i) => {
      const noise = (rnd() - 0.5) * 1.6;
      const eff = Math.max(12, base + i * trend + noise);
      return { month: m, eff: +eff.toFixed(2) };
    });
  }, [vehicleId]);

  const minEff = Math.min(...data.map(d => d.eff));
  const maxEff = Math.max(...data.map(d => d.eff));
  const pad = Math.max(0.5, (maxEff - minEff) * 0.15);
  const domain: [number, number] = [Math.floor(minEff - pad), Math.ceil(maxEff + pad)];

  const tipRef = useRef<HTMLDivElement | null>(null);
  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const v = payload[0]?.value ?? 0;
    return (
      <div
        ref={tipRef}
        className="rounded-lg border bg-white dark:bg-neutral-900 p-2 text-sm shadow"
        style={{ borderColor: tipBorder }}
      >
        <div className="font-medium mb-1">{label}</div>
        <div>
          Efficiency: <span className="font-semibold">{Number(v).toFixed(2)}</span> kWh / 100 km
        </div>
      </div>
    );
  };

  return (
    <div style={{ height }}>
      {title ? (
        <div className="px-1 pb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {title}
        </div>
      ) : null}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey="month" stroke={axis} tickLine={false} axisLine={{ stroke: axis }} />
          <YAxis
            stroke={axis}
            tickFormatter={(v) => `${v}`}
            width={42}
            tickCount={6}
            domain={domain}
          />
          <Tooltip content={<Tip />} />
          {typeof fleetAvg === "number" && (
            <ReferenceLine
              y={fleetAvg}
              stroke={theme === "dark" ? "#a3a3a3" : "#9ca3af"}
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
              label={{
                value: "Fleet avg",
                position: "right",
                fill: axis,
                fontSize: 11,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="eff"
            name="kWh / 100 km"
            stroke={line}
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
