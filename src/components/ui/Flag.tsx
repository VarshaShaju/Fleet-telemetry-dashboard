type FlagCode = "en" | "gb" | "de";

export default function Flag({
  code = "en",
  size = 18,
  title,
  className = "",
}: {
  code?: FlagCode;
  size?: number;
  title?: string;
  className?: string;
}) {
  // Emoji flags: UK for English (GB), Germany for Deutsch
  const glyph = code === "de" ? "🇩🇪" : "🇬🇧";

  return (
    <span
      className={`inline-block leading-none ${className}`}
      style={{ fontSize: size }}
      role="img"
      aria-label={title ?? (code === "de" ? "Deutsch" : "English")}
      title={title ?? (code === "de" ? "Deutsch" : "English")}
    >
      {glyph}
    </span>
  );
}
