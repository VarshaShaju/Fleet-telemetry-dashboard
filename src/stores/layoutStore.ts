import { create } from "zustand";

type PanelId = "overview" | "vehicle" | "alerts";

type LayoutState = {
  order: PanelId[];
  dragMode: boolean;
  setOrder: (next: PanelId[]) => void;
  toggleDragMode: () => void;
  disableDragMode: () => void;
};

const KEY = "dashboard:panelOrder:v1";
const BASE: PanelId[] = ["overview", "vehicle", "alerts"];

const load = (): PanelId[] => {
  if (typeof window === "undefined") return BASE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return BASE;
    const parsed = JSON.parse(raw);
    const ok =
      Array.isArray(parsed) &&
      parsed.length === BASE.length &&
      parsed.every((x: any) => BASE.includes(x));
    return ok ? (parsed as PanelId[]) : BASE;
  } catch {
    return BASE;
  }
};

const save = (order: PanelId[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(order));
  } catch {}
};

export const useLayout = create<LayoutState>((set, get) => ({
  order: load(),
  dragMode: false,
  setOrder: (next) => {
    save(next);
    set({ order: next });
  },
  toggleDragMode: () => set({ dragMode: !get().dragMode }),
  disableDragMode: () => set({ dragMode: false }),
}));
