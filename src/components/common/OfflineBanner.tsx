// src/components/common/OfflineBanner.tsx
import React from "react";
import { WifiOff } from "lucide-react";
import { useUI } from "../../stores/uiStore";
import { useTranslation } from "react-i18next";

export default function OfflineBanner() {
  const online = useUI((s) => s.online);
  const { t } = useTranslation();

  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!online) {
      setMounted(true);
      // ensure next paint before enabling the slide-in class
      requestAnimationFrame(() => setOpen(true));
    } else {
      // slide up first, then unmount after the transition
      setOpen(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [online]);

  if (!mounted) return null;

  return (
    <div
      className={[
        "px-4 lg:px-6 py-2 bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200 flex items-center gap-2",
        "transition-transform duration-300 ease-out",
        open ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <WifiOff size={16} />
      <span className="text-sm">
        {/* falls back to English if you haven't added keys */}
        {t("offline.banner", "Offline mode: telemetry paused. Showing last known data.")}
      </span>
    </div>
  );
}
