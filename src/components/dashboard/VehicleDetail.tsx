import { useState } from "react";
import { useFleet, selectSelectedVehicle } from "../../stores/fleetStore";
import MapPanel from "../map/MapPanel";
import EfficiencyLineChart from "../charts/EfficiencyLineChart";
import {
  Gauge, BatteryCharging, Thermometer, GaugeCircle, TrendingUp,
  RotateCw, Activity, Route, MapPin, Maximize2, Minimize2
} from "lucide-react";
import { useTranslation } from "react-i18next";

/** VehicleDetail: shows the selected vehicle’s map, efficiency trend, and key metrics. */
export default function VehicleDetail() {
  const vehicle = useFleet(selectSelectedVehicle);
  const vehicles = useFleet(s => s.vehicles);
  const [mapExpanded, setMapExpanded] = useState(false);
  const { t } = useTranslation();

  if (!vehicle) return null;

  const MAP_COLLAPSED = 160;
  const MAP_EXPANDED  = 360;
  const CHART_HEIGHT  = 320;

  const Item = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="text-sm flex items-start gap-2">
      <span className="mt-0.5 p-1 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
        <Icon size={16} />
      </span>
      <div>
        <div className="opacity-70">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );

  const statusText = t(vehicle.status);

  return (
    <section className="space-y-4">
      <div className="rounded-xl border bg-white dark:bg-neutral-900">
        <div className="px-4 py-3 border-b dark:border-neutral-800 flex items-center justify-between">
          <div className="font-semibold">{vehicle.name}</div>
        </div>

        <div className="p-4">
          <div className="grid gap-4 lg:grid-cols-2 relative">
            {/* Map (collapsed) */}
            <div className="rounded-xl border dark:border-neutral-800 overflow-hidden">
              <div className="px-3 py-2 border-b dark:border-neutral-800 flex items-center justify-between">
                <div className="text-sm font-medium">{t("vehicle.map")}</div>
                <button
                  /* Hide on mobile view */
                  className="hidden lg:inline-flex px-2 py-1 rounded-md border dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  onClick={() => setMapExpanded(true)}
                  title={t("vehicle.expandMap")}
                >
                  <Maximize2 size={16} />
                </button>
              </div>
              <div className="p-3">
                <div className="rounded-xl overflow-hidden border dark:border-neutral-800">
                  <MapPanel vehicles={vehicles} focus={vehicle} />
                </div>
              </div>
            </div>

            {/* Efficiency Trend Graph */}
            <div className="rounded-xl border dark:border-neutral-800 overflow-hidden">
              <div className="px-3 py-2 border-b dark:border-neutral-800 flex items-center justify-between">
                <div className="text-sm font-medium">{t("vehicle.effTrend")}</div>
                <div className="text-xs opacity-70">{t("vehicle.effUnit")}</div>
              </div>
              <div className="p-3">
                <EfficiencyLineChart vehicleId={vehicle.id} height={CHART_HEIGHT} />
              </div>
            </div>

            {/* Expanded map overlays Both columns (desktop only) */}
            {mapExpanded && (
              <div className="hidden lg:block absolute inset-0 z-[1100]">
                <div className="rounded-xl border bg-white dark:bg-neutral-900 shadow-2xl h-full overflow-hidden dark:border-neutral-800 flex flex-col">
                  <div className="px-3 py-2 border-b dark:border-neutral-800 flex items-center justify-between">
                    <div className="text-sm font-medium">{t("vehicle.map")}</div>
                    <button
                      className="px-2 py-1 rounded-md border dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      onClick={() => setMapExpanded(false)}
                      title={t("vehicle.collapseMap")}
                    >
                      <Minimize2 size={16} />
                    </button>
                  </div>
                  <div className="p-3 flex-1">
                    <div className="rounded-xl overflow-hidden border dark:border-neutral-800 h-full">
                      <MapPanel vehicles={vehicles} focus={vehicle} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="px-4 pb-4">
          <div className="rounded-xl border p-4 dark:border-neutral-800">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
              <Item icon={Gauge}           label={t("metrics.speed")}            value={`${Math.round(vehicle.speed)} km/h`} />
              <Item icon={BatteryCharging} label={t("metrics.battery")}          value={`${vehicle.battery.toFixed(0)} %`} />
              <Item icon={Thermometer}     label={t("metrics.temperature")}      value={`${vehicle.temperature.toFixed(1)} °C`} />
              <Item icon={GaugeCircle}     label={t("metrics.tireFL")}           value={`${vehicle.tireFL.toFixed(1)} psi`} />
              <Item icon={GaugeCircle}     label={t("metrics.tireFR")}           value={`${vehicle.tireFR.toFixed(1)} psi`} />
              <Item icon={GaugeCircle}     label={t("metrics.tireRL")}           value={`${vehicle.tireRL.toFixed(1)} psi`} />
              <Item icon={GaugeCircle}     label={t("metrics.tireRR")}           value={`${vehicle.tireRR.toFixed(1)} psi`} />
              <Item icon={TrendingUp}      label={t("metrics.motorEfficiency")}  value={`${vehicle.motorEfficiency.toFixed(0)} %`} />
              <Item icon={RotateCw}        label={t("metrics.regenerative")}     value={vehicle.regenActive ? t("enabled") : t("disabled")} />
              <Item icon={Activity}        label={t("metrics.status")}           value={statusText} />
              <Item icon={Route}           label={t("metrics.distance")}         value={`${vehicle.distance.toFixed(1)} km`} />
              <Item icon={MapPin}          label={t("metrics.location")}         value={`${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
