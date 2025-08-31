import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  id: string;
  disabled?: boolean;
  children: React.ReactNode;
  handleRef?: React.RefObject<HTMLElement>; // if provided, only this handle is draggable
};

export function SortableItem({ id, disabled, children, handleRef }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({ id, disabled });

  React.useEffect(() => {
    if (handleRef?.current) setActivatorNodeRef(handleRef.current);
  }, [handleRef, setActivatorNodeRef]);

  const style: React.CSSProperties = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.9 : 1,
  };

  // If no handleRef, make the whole item the activator; otherwise, only the handle is draggable
  const activatorProps = handleRef ? {} : listeners;

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging || undefined}
      aria-disabled={disabled || undefined}
    >
      <div
        {...attributes}
        {...(disabled ? {} : activatorProps)}
        className={!disabled && !handleRef ? "cursor-grab active:cursor-grabbing" : undefined}
        tabIndex={!disabled && !handleRef ? 0 : undefined}
      >
        {children}
      </div>
    </div>
  );
}
