import { useState, type ReactNode } from "react";
import { useFleet } from "../../stores/fleetStore";
import { useTheme } from "../../contexts/ThemeContext";
import { useUI } from "../../stores/uiStore";
import {
  Bell, AlertTriangle, Flame, Gauge, BatteryLow,
  Waypoints, Car, CheckCircle2, Menu, Sun, Moon,
  Wifi, WifiOff, GripVertical
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Tiny pill for alert severity labels.
function Chip({ color, children }: { color: "red" | "amber" | "neutral"; children: ReactNode }) {
  const map = {
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
    neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
  } as const;
  return <span className={`text-xs px-2 py-0.5 rounded-full ${map[color]}`}>{children}</span>;
}

// Picks an icon for the given alert type
const iconFor = (type: string) => {
  switch (type) {
    case "battery_low": return <BatteryLow size={16} />;
    case "temp_high": return <Flame size={16} />;
    case "tire_pressure": return <Gauge size={16} />;
    case "speeding": return <Car size={16} />;
    case "geofence": return <Waypoints size={16} />;
    case "harsh_braking": return <AlertTriangle size={16} />;
    case "charging_complete": return <CheckCircle2 size={16} />;
    default: return <AlertTriangle size={16} />;
  }
};

//Top app bar: sidebar toggles, theme/offline switches, customize toggle, and alerts menu
export default function HeaderBar() {
  const { t } = useTranslation();
  const alerts = useFleet(s => s.alerts);
  const ackAlert = useFleet(s => s.ackAlert);
  const ackAll = useFleet(s => s.ackAll);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const sidebarCollapsed = useUI(s => s.sidebarCollapsed);
  const expandSidebar   = useUI(s => s.expand);
  const openMobile      = useUI(s => s.openMobile);

  const online            = useUI(s => s.online);
  const demoOffline       = useUI(s => s.demoOffline);
  const toggleDemoOffline = useUI(s => s.toggleDemoOffline);

  const customizeMode     = useUI(s => s.customizeMode);
  const toggleCustomize   = useUI(s => s.toggleCustomize);

  const [open, setOpen] = useState(false);

  return (
    <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={openMobile}
          className="lg:hidden p-2 rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          title={t("openSidebar", { defaultValue: "Open sidebar" })}
          aria-label={t("openSidebar", { defaultValue: "Open sidebar" })}
        >
          <Menu size={18} />
        </button>

        {sidebarCollapsed && (
          <button
            onClick={expandSidebar}
            className="hidden lg:inline-flex p-2 rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            title={t("openSidebar", { defaultValue: "Open sidebar" })}
            aria-label={t("openSidebar", { defaultValue: "Open sidebar" })}
          >
            <Menu size={18} />
          </button>
        )}

        <h1 className="text-xl font-semibold">{t("header.title")}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          title={
            isDark
              ? t("header.themeLight", { defaultValue: "Switch to light mode" })
              : t("header.themeDark",  { defaultValue: "Switch to dark mode" })
          }
          aria-label={
            isDark
              ? t("header.themeLight", { defaultValue: "Switch to light mode" })
              : t("header.themeDark",  { defaultValue: "Switch to dark mode" })
          }
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Simulate Offline */}
        <button
          onClick={toggleDemoOffline}
          className="p-2 rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          title={
            demoOffline
              ? t("online.back", { defaultValue: "Return to online (demo off)" })
              : t("offline.simulate", { defaultValue: "Simulate offline" })
          }
          aria-label={
            demoOffline
              ? t("online.back", { defaultValue: "Return to online (demo off)" })
              : t("offline.simulate", { defaultValue: "Simulate offline" })
          }
        >
          {demoOffline || !online ? <WifiOff size={18} /> : <Wifi size={18} />}
        </button>

        {/* Customize toggle — desktop only */}
        <button
          onClick={toggleCustomize}
          className={[
            "hidden lg:inline-flex p-2 rounded-lg border",
            "dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800",
            customizeMode ? "ring-2 ring-cyan-400" : ""
          ].join(" ")}
          title={
            customizeMode
              ? t("header.done", { defaultValue: "Done" })
              : t("header.customize", { defaultValue: "Customize layout" })
          }
          aria-pressed={customizeMode}
        >
          <GripVertical size={18} />
        </button>

        {/* Alerts */}
        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="px-3 py-1.5 rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            title={t("header.alerts", { defaultValue: "Alerts" })}
          >
            <Bell size={18} />
            <span className="hidden sm:inline">{t("header.alerts", { defaultValue: "Alerts" })}</span>
            {alerts.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center text-xs font-semibold rounded-full bg-red-600 text-white min-w-5 h-5 px-1">
                {alerts.length}
              </span>
            )}
          </button>

          {open && (
            <div
              className="
                absolute right-0 mt-2
                w-[92vw] sm:w-96
                max-w-[92vw] sm:max-w-none
                max-h-[70vh] sm:max-h-[28rem]
                overflow-auto rounded-xl border
                bg-white dark:bg-neutral-900 shadow-lg p-2 z-[3000]
              "
            >
              <div className="px-2 py-1.5 flex items-center justify-between">
                <div className="text-sm font-medium">
                  {t("header.unack", { defaultValue: "Unacknowledged" })} ({alerts.length})
                </div>
                {alerts.length > 0 && (
                  <button
                    onClick={() => ackAll()}
                    className="text-xs underline"
                    title={t("header.ackAll", { defaultValue: "Acknowledge all" })}
                  >
                    {t("header.ackAll", { defaultValue: "Acknowledge all" })}
                  </button>
                )}
              </div>

              {alerts.length === 0 ? (
                <div className="p-3 text-sm opacity-70">{t("header.noAlerts", { defaultValue: "No alerts" })}</div>
              ) : (
                alerts.map(a => (
                  <div
                    key={a.id}
                    className="p-2 rounded-lg border mb-2 last:mb-0 dark:border-neutral-700 flex items-start gap-2"
                  >
                    <div className="p-2 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                      {iconFor(a.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{a.message}</div>
                        <Chip color={a.severity === "critical" ? "red" : a.severity === "warning" ? "amber" : "neutral"}>
                          {t(`severity.${a.severity}`, a.severity)}
                        </Chip>
                      </div>
                      <div className="text-xs opacity-60 mt-0.5">{new Date(a.ts).toLocaleString()}</div>
                      <button onClick={() => ackAlert(a.id)} className="mt-1 text-xs underline">
                        {t("header.markRead", { defaultValue: "Mark as read" })}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
