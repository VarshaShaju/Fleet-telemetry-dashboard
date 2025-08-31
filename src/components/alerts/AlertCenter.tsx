import { useFleet } from "../../stores/fleetStore";
import { useTranslation } from "react-i18next";

// Shows a Notifications card when there are unacknowledged alerts.
export default function AlertCenter() {
  const alerts = useFleet(s => s.alerts);
  const ackAll = useFleet(s => s.ackAll);
  const { t } = useTranslation();

  if (alerts.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="rounded-xl border bg-white dark:bg-neutral-900 overflow-hidden dark:border-neutral-800">
        <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 px-3 py-2 border-b dark:border-neutral-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t("header.notifications")}</h3>
          <button className="text-sm underline" onClick={() => ackAll()}>
            {t("header.ackAll")}
          </button>
        </div>

        <div className="max-h-80 overflow-auto p-2">
          <div className="space-y-2">
            {alerts.map(a => (
              <div
                key={a.id}
                className="rounded-xl border bg-white dark:bg-neutral-900 p-3 dark:border-neutral-800"
              >
                <div className="text-sm">{a.message}</div>
                <div className="text-xs opacity-60">
                  {new Date(a.ts).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
