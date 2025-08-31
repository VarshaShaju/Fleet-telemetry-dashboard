import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useLayout } from "../../stores/layoutStore";
import { SortableItem } from "./SortableItem";

type PanelId = "overview" | "vehicle" | "alerts";

type Props = {
  renderers: Record<PanelId, React.ReactNode>;
};

export default function DraggableDashboard({ renderers }: Props) {
  const order = useLayout(s => s.order);
  const setOrder = useLayout(s => s.setOrder);
  const dragMode = useLayout(s => s.dragMode);

  // disable dragging on small screens
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 640px)").matches;
  });
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragEnd = React.useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return;
      const from = order.indexOf(active.id as PanelId);
      const to = order.indexOf(over.id as PanelId);
      if (from >= 0 && to >= 0) setOrder(arrayMove(order, from, to));
    },
    [order, setOrder]
  );

  const titles: Record<PanelId, string> = {
    overview: "Overview",
    vehicle: "Vehicle",
    alerts: "Notifications",
  };

  const draggingDisabled = isMobile || !dragMode;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="space-y-6">
          {order.map(id => (
            <SortableItem key={id} id={id} disabled={draggingDisabled}>
              <div className="rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800">
                <div className="px-4 py-2 border-b dark:border-neutral-800 flex items-center justify-between">
                  <div className="font-semibold capitalize">{titles[id]}</div>
                  <div
                    className={[
                      "select-none text-sm opacity-60",
                      draggingDisabled ? "hidden" : "inline-flex",
                    ].join(" ")}
                    title="Drag to reorder"
                    aria-hidden
                  >
                    ⠿
                  </div>
                </div>
                <div className="p-4">{renderers[id]}</div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
