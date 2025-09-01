import React from "react";
import { useTranslation } from "react-i18next";
import Flag from "../ui/Flag";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function LanguageFlagDropdown() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const current = i18n.language.startsWith("de") ? "de" : "en";
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const change = (lng: "en" | "de") => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    setOpen(false);
  };

  // click-away & ESC to close
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const menuId = "lang-menu";

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-white hover:opacity-90 focus:outline-none"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        title={t("language")}
      >
        <Flag code={current === "de" ? "de" : "en"} size={18} />
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 mt-2 w-40 rounded-xl border bg-white dark:bg-neutral-900 text-slate-900 dark:text-white dark:border-neutral-700 shadow-lg p-1 z-[1500]"
        >
          <button
            role="menuitem"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
            onClick={() => change("en")}
          >
            <Flag code="en" size={18} />
            <span>English</span>
          </button>
          <button
            role="menuitem"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
            onClick={() => change("de")}
          >
            <Flag code="de" size={18} />
            <span>Deutsch</span>
          </button>
        </div>
      )}
    </div>
  );
}
