interface TapstaLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export function TapstaLogo({ size = "md", showTagline = false }: TapstaLogoProps) {
  const sizes = {
    sm: { text: "text-2xl", sub: "text-xs" },
    md: { text: "text-4xl", sub: "text-sm" },
    lg: { text: "text-6xl", sub: "text-base" },
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizes[size].text} font-black tracking-tight`}>
        <span className="text-white">Tap</span>
        <span
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          sta
        </span>
      </div>
      {showTagline && (
        <p className={`${sizes[size].sub} text-white/50 tracking-widest uppercase`}>
          Don&apos;t just watch. Tap it.
        </p>
      )}
    </div>
  );
}
