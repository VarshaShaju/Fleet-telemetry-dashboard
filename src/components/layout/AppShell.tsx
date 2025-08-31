import { useEffect, useMemo, Fragment, type CSSProperties } from "react";
import Sidebar from "../sidebar/Sidebar";
import HeaderBar from "../layout/HeaderBar";
import Overview from "../overview/Overview";
import VehicleDetail from "../dashboard/VehicleDetail";
import AlertCenter from "../alerts/AlertCenter";
import OfflineBanner from "../common/OfflineBanner";
import { useUI } from "../../stores/uiStore";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

export default function Appshell() {
  const mobileOpen       = useUI(s => s.mobileOpen);
  const closeMobile      = useUI(s => s.closeMobile);
  const initNetworkWatch = useUI(s => s.initNetworkWatch);

  const customizeMode    = useUI(s => s.customizeMode);
  const layoutOrder      = useUI(s => s.layoutOrder);
  const setLayoutOrder   = useUI(s => s.setLayoutOrder);

  useEffect(() => { initNetworkWatch(); }, [initNetworkWatch]);

  const sections = useMemo(() => ({
    overview: <section><Overview /></section>,
    vehicle:  <section><VehicleDetail /></section>,
    alerts:   <section><AlertCenter /></section>,
  }), []);

  const ordered = layoutOrder.filter(id => id in sections);

  /** Handles final position after drag to persist the new section order. */
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const next = [...ordered];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    setLayoutOrder(next);
  };

  return (
    <div className="h-screen w-full flex bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      {/* DESKTOP SIDEBAR */}
      <aside
        data-sidebar-root
        className="
          hidden lg:block relative shrink-0 w-72
          border-r border-black/5 dark:border-white/10
          bg-cyan-900 text-white dark:bg-neutral-950/90
        "
      >
        <div className="h-full overflow-y-auto">
          <Sidebar variant="rail" />
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      <div className={`lg:hidden fixed inset-0 z-[2000] ${mobileOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={closeMobile}
          className={`absolute inset-0 bg-black/40 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`
            absolute inset-y-0 left-0 w-72
            bg-cyan-900 text-white shadow-2xl dark:bg-neutral-950/90
            transform transition-transform duration-300
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-full overflow-y-auto">
            <Sidebar variant="drawer" />
          </div>
        </div>
      </div>

      {/* MAIN COLUMN */}
      <main className="min-w-0 flex-1 flex flex-col">
        <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 backdrop-blur dark:bg-neutral-900/80">
          <HeaderBar />
        </header>

        <OfflineBanner />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-6">
            {!customizeMode ? (
              <Fragment>
                {ordered.map(id => (
                  <Fragment key={id}>{sections[id as keyof typeof sections]}</Fragment>
                ))}
              </Fragment>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="dashboard-droppable">
                  {(drop) => (
                    <div ref={drop.innerRef} {...drop.droppableProps} className="space-y-6">
                      {ordered.map((id, index) => (
                        <Draggable draggableId={id} index={index} key={id}>
                          {(drag, snapshot) => (
                            <div
                              ref={drag.innerRef}
                              {...drag.draggableProps}
                              {...drag.dragHandleProps}
                              className={[
                                "relative",
                                snapshot.isDragging ? "ring-2 ring-cyan-400 rounded-xl" : ""
                              ].join(" ")}
                              style={drag.draggableProps.style as CSSProperties}
                            >
                              {sections[id as keyof typeof sections]}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {drop.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
