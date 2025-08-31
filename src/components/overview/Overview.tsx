import type { ReactNode } from "react";
import { useFleet } from "../../stores/fleetStore";
import { Car, BatteryCharging } from "lucide-react";
import { useTranslation } from "react-i18next";

const Dot = ({ className = "" }: { className?: string }) => (
  <span className={`inline-block h-3 w-3 rounded-full ${className}`} />
);

const Pill = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full ${className}`}>
    {children}
  </span>
);

/** Overview: shows fleet status counts and battery distribution */
export default function Overview() {
  const { t } = useTranslation();
  const vehicles = useFleet((s) => s.vehicles);

  let active = 0, inactive = 0, shop = 0, out = 0;
  for (const v of vehicles) {
    const override = (v as any).operationalStatus as "active" | "inactive" | "shop" | "out" | undefined;
    if (override) {
      if (override === "active") active++;
      else if (override === "inactive") inactive++;
      else if (override === "shop") shop++;
      else if (override === "out") out++;
    } else {
      if (v.status === "idle") inactive++;
      else active++;
    }
  }

  const count = vehicles.length;

  let sum = 0, r0_25 = 0, r25_50 = 0, r50_75 = 0, r75_100 = 0;
  for (const v of vehicles) {
    const b = Math.max(0, Math.min(100, Number(v.battery) || 0));
    sum += b;
    if (b < 25) r0_25++;
    else if (b < 50) r25_50++;
    else if (b < 75) r50_75++;
    else r75_100++;
  }
  const avgBattery = count ? sum / count : 0;

  const colors = {
    green: {
      dot: "bg-emerald-500",
      pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
      chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
      iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
    },
    blue: {
      dot: "bg-sky-500",
      pill: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200",
      chip: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200",
      iconBg: "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300",
    },
    amber: {
      dot: "bg-amber-500",
      pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
      chip: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
    },
    red: {
      dot: "bg-rose-500",
      pill: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200",
      chip: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200",
      iconBg: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300",
    },
  };

  const Card = ({
    title,
    Icon,
    children,
    iconClass,
  }: {
    title: string;
    Icon: any;
    children: ReactNode;
    iconClass?: string;
  }) => (
    <div className="rounded-xl border bg-white dark:bg-neutral-900 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${iconClass ?? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"}`}>
          <Icon size={20} />
        </div>
        <div className="text-sm opacity-70">{title}</div>
      </div>
      {children}
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("overview.title")}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card title={t("overview.vehicles")} Icon={Car} iconClass={colors.green.iconBg}>
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-xs opacity-70">{t("overview.totalInFleet")}</div>
            <div className="text-2xl font-semibold">{count}</div>
          </div>

          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dot className={colors.green.dot} />
                <span className="text-sm">{t("status.active", { defaultValue: "Active" })}</span>
              </div>
              <Pill className={colors.green.pill}>{active}</Pill>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dot className={colors.blue.dot} />
                <span className="text-sm">{t("status.inactive", { defaultValue: "Inactive" })}</span>
              </div>
              <Pill className={colors.blue.pill}>{inactive}</Pill>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dot className={colors.amber.dot} />
                <span className="text-sm">{t("status.shop", { defaultValue: "In Shop" })}</span>
              </div>
              <Pill className={colors.amber.pill}>{shop}</Pill>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dot className={colors.red.dot} />
                <span className="text-sm">{t("status.out", { defaultValue: "Out of Service" })}</span>
              </div>
              <Pill className={colors.red.pill}>{out}</Pill>
            </div>
          </div>
        </Card>

        <Card title={t("overview.avgBattery")} Icon={BatteryCharging} iconClass={colors.amber.iconBg}>
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-xs opacity-70">{t("overview.avgBattery")}</div>
            <div className="text-2xl font-semibold">{avgBattery.toFixed(1)}%</div>
          </div>

          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dot className={colors.green.dot} />
                <span className="text-sm">0–25%</span>
              </div>
              <Pill className={colors.green.pill}>{r0_25}</Pill>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dot className={colors.blue.dot} />
                <span className="text-sm">25–50%</span>
              </div>
              <Pill className={colors.blue.pill}>{r25_50}</Pill>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dot className={colors.amber.dot} />
                <span className="text-sm">50–75%</span>
              </div>
              <Pill className={colors.amber.pill}>{r50_75}</Pill>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dot className={colors.red.dot} />
                <span className="text-sm">75–100%</span>
              </div>
              <Pill className={colors.red.pill}>{r75_100}</Pill>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
