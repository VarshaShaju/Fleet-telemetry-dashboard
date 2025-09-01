import { useState, useRef, useEffect } from "react";
import { useFleet, selectFilteredSortedVehicles } from "../../stores/fleetStore";
import { Filter, ArrowUpDown, Search, ChevronLeft, X, Check } from "lucide-react";
import LanguageFlagDropdown from "../common/LanguageFlagDropdown";
import { useTranslation } from "react-i18next";
import { useUI } from "../../stores/uiStore";

//Close the given popover/menu when the user clicks outside it
function useClickAway<T extends HTMLElement>(onAway: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onAway();
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onAway]);
  return ref;
}

type SidebarProps = {
  //rail = desktop persistent column, drawer = mobile overlay
  variant?: "rail" | "drawer";
};

//Fleet sidebar: search, filter/sort menus and vehicle list.
export default function Sidebar({ variant = "rail" }: SidebarProps) {
  const { t } = useTranslation();

  const search = useFleet(s => s.search);
  const setSearch = useFleet(s => s.setSearch);

  const filterStatus = useFleet(s => s.filterStatus);
  const setFilterStatus = useFleet(s => s.setFilterStatus);

  const sortBy = useFleet(s => s.sortBy);
  const setSortBy = useFleet(s => s.setSortBy);

  const selected = useFleet(s => s.selectedVehicleId);
  const select = useFleet(s => s.selectVehicle);

  const vehicles = useFleet(selectFilteredSortedVehicles);

  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  const filterWrapRef = useClickAway<HTMLDivElement>(() => setOpenFilter(false));
  const sortWrapRef = useClickAway<HTMLDivElement>(() => setOpenSort(false));


  const collapsed   = useUI(s => s.sidebarCollapsed);
  const collapse    = useUI(s => s.collapse);
  const closeMobile = useUI(s => s.closeMobile);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const EXPANDED_W = 288; // w-72

  useEffect(() => {
    if (variant !== "rail") return; // only rail animates host width
    const host =
      (rootRef.current?.closest("[data-sidebar-root]") as HTMLElement) ||
      rootRef.current?.parentElement!;
    if (!host) return;
    host.style.transition = "width 300ms ease-in-out";
    host.style.overflow = "hidden";
    host.style.width = collapsed ? "0px" : `${EXPANDED_W}px`;
  }, [collapsed, variant]);

  const closeBtn = (
    variant === "rail" ? (
      <button
        onClick={collapse}
        className="p-1 rounded-md text-white/90 hover:bg-white/10"
        title={t("hideSidebar", { defaultValue: "Hide sidebar" })}
        aria-label={t("hideSidebar", { defaultValue: "Hide sidebar" })}
      >
        <ChevronLeft size={18} />
      </button>
    ) : (
      <button
        onClick={closeMobile}
        className="p-1 rounded-md text-white/90 hover:bg-white/10"
        title={t("close", { defaultValue: "Close" })}
        aria-label={t("close", { defaultValue: "Close" })}
      >
        <X size={18} />
      </button>
    )
  );

  return (
    <div ref={rootRef} className="p-4 space-y-4">
      <div className="mb-2 flex items-center justify-between overflow-visible">
        <div className="font-bold text-lg text-white">CUBONIC</div>
        <div className="flex items-center gap-1">
          <LanguageFlagDropdown />
          {closeBtn}
        </div>
      </div>

      {/* SearchBar */}
      <div className="relative">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t("search") || "Search"}
          aria-label={t("search") || "Search"}
        className="
            w-full rounded-lg border border-white/20 bg-white text-slate-900 placeholder-slate-500 px-3 py-2 pr-9
            focus:outline-none focus:ring-0 focus:border-white/40
            dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-400
          "
        />
        <Search
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-neutral-300 opacity-90 pointer-events-none"
          aria-hidden
        />
      </div>

      {/* Filter & Sort */}
      <div className="grid grid-cols-2 gap-2">
        {/* Filter */}
        <div className="relative" ref={filterWrapRef}>
          <button
            onClick={() => { setOpenFilter(v => !v); setOpenSort(false); }}
            className="
              w-full px-3 py-2 rounded-lg border
              bg-white text-slate-500 dark:bg-neutral-900 dark:text-white
              flex items-center justify-between
              hover:bg-neutral-50 dark:hover:bg-neutral-800
            "
            title={t("filter") || "Filter"}
            aria-haspopup="menu"
            aria-expanded={openFilter}
          >
            <span className="truncate">{t("filter") || "Filter"}</span>
            <Filter size={16} className="text-slate-500 dark:text-neutral-300" />
          </button>

          {openFilter && (
            <div
              className="
                absolute left-0 mt-2 w-48 rounded-xl border
                bg-white text-slate-900 dark:bg-neutral-900 dark:text-white
                shadow z-[3000] p-1
              "
              role="menu"
            >
              {(["all", "moving", "charging", "idle"] as const).map(opt => {
                const isActive = filterStatus === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => { setFilterStatus(opt as any); setOpenFilter(false); }}
                    className={`
                      w-full px-3 py-2 rounded-lg
                      hover:bg-neutral-50 dark:hover:bg-neutral-800
                      ${isActive ? "bg-neutral-50 dark:bg-neutral-800" : ""}
                      flex items-center justify-between
                      text-left
                    `}
                    role="menuitemradio"
                    aria-checked={isActive}
                  >
                    <span>
                      {opt === "all"
                        ? (t("allStatus") || "All Status")
                        : opt === "moving"
                        ? (t("moving") || "Moving")
                        : opt === "charging"
                        ? (t("charging") || "Charging")
                        : (t("idle") || "Idle")}
                    </span>
                    {/* Tick shown for the active option */}
                    <Check
                      size={16}
                      className={`ml-2 shrink-0 ${
                        isActive ? "opacity-100 text-emerald-600 dark:text-emerald-400" : "opacity-0"
                      }`}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="relative" ref={sortWrapRef}>
          <button
            onClick={() => { setOpenSort(v => !v); setOpenFilter(false); }}
            className="
              w-full px-3 py-2 rounded-lg border
              bg-white text-slate-500 dark:bg-neutral-900 dark:text-white
              flex items-center justify-between
              hover:bg-neutral-50 dark:hover:bg-neutral-800
            "
            title={t("sort") || "Sort"}
            aria-haspopup="menu"
            aria-expanded={openSort}
          >
            <span className="truncate">{t("sort") || "Sort"}</span>
            <ArrowUpDown size={16} className="text-slate-500 dark:text-neutral-300" />
          </button>

          {openSort && (
            <div
              className="
                absolute right-0 mt-2 w-48 rounded-xl border
                bg-white text-slate-900 dark:bg-neutral-900 dark:text-white
                shadow z-[3000] p-1
              "
              role="menu"
            >
              {[
                { key: null as null | "battery" | "speed" | "distance", label: t("none") || "None" },
                { key: "battery" as const, label: t("metrics.battery") || "Battery" },
                { key: "speed" as const,   label: t("metrics.speed") || "Speed" },
                { key: "distance" as const, label: t("metrics.distance") || "Distance" },
              ].map(opt => {
                const isActive = sortBy === opt.key;
                return (
                  <button
                    key={String(opt.key)}
                    onClick={() => { setSortBy(opt.key as any); setOpenSort(false); }}
                    className={`
                      w-full px-3 py-2 rounded-lg
                      hover:bg-neutral-50 dark:hover:bg-neutral-800
                      ${isActive ? "bg-neutral-50 dark:bg-neutral-800" : ""}
                      flex items-center justify-between
                      text-left
                    `}
                    role="menuitemradio"
                    aria-checked={isActive}
                  >
                    <span>{opt.label}</span>
                    {/* Tick shown for the active sort */}
                    <Check
                      size={16}
                      className={`ml-2 shrink-0 ${
                        isActive ? "opacity-100 text-emerald-600 dark:text-emerald-400" : "opacity-0"
                      }`}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Vehicles List */}
      <nav className="pt-2 space-y-1">
        {vehicles.slice(0, 10).map(v => {
          const isSelected = selected === v.id;
          return (
            <button
              key={v.id}
              onClick={() => select(v.id)}
              aria-selected={isSelected}
              className={[
                "w-full text-left px-3 py-2 rounded-lg transition-colors",
                "border border-transparent",
                isSelected
                  ? "bg-white text-cyan-900 ring-2 ring-cyan-400 dark:bg-neutral-900 dark:text-white dark:ring-cyan-300/60"
                  : "bg-white text-slate-900 hover:bg-white/90 dark:bg-neutral-900 dark:text-white"
              ].join(" ")}
            >
              {v.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
