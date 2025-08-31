import { create } from "zustand";

type UIState = {
  sidebarCollapsed: boolean;
  expand: () => void;
  collapse: () => void;
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  online: boolean;
  demoOffline: boolean;
  toggleDemoOffline: () => void;
  initNetworkWatch: () => void;
  customizeMode: boolean;
  toggleCustomize: () => void;
  layoutOrder: string[];
  setLayoutOrder: (order: string[]) => void;
};

const LS_LAYOUT_KEY = "dashboard.layoutOrder";

function loadLayout(): string[] {
  try {
    const raw = localStorage.getItem(LS_LAYOUT_KEY);
    const arr = raw ? JSON.parse(raw) : null;
    if (Array.isArray(arr) && arr.every(x => typeof x === "string")) return arr;
  } catch {}
  return ["overview", "vehicle", "alerts"];
}

export const useUI = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  expand: () => set({ sidebarCollapsed: false }),
  collapse: () => set({ sidebarCollapsed: true }),

  mobileOpen: false,
  openMobile: () => set({ mobileOpen: true }),
  closeMobile: () => set({ mobileOpen: false }),

  online: typeof navigator !== "undefined" ? navigator.onLine : true,
  demoOffline: false,
  toggleDemoOffline: () => {
    const next = !get().demoOffline;
    const navOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
    set({ demoOffline: next, online: navOnline && !next });
  },
  initNetworkWatch: () => {
    if (typeof window === "undefined") return;
    const update = () => {
      const navOnline = navigator.onLine;
      set({ online: navOnline && !get().demoOffline });
    };
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();
  },

  customizeMode: false,
  toggleCustomize: () => set(s => ({ customizeMode: !s.customizeMode })),

  layoutOrder: loadLayout(),
  setLayoutOrder: (order) => {
    set({ layoutOrder: order });
    try { localStorage.setItem(LS_LAYOUT_KEY, JSON.stringify(order)); } catch {}
  },
}));
