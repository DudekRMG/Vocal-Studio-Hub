import { useVoiceWidget } from "@/lib/voiceWidgetContext";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";

interface VoiceWidgetTriggerProps {
  size?: "sm" | "lg";
  accentColor?: string;
  lightMode?: boolean;
  triggerBorder?: string;
  triggerColor?: string;
  triggerHoverBorder?: string;
  triggerHoverColor?: string;
}

export function VoiceWidgetTrigger({
  size = "sm",
  accentColor = "#e8002d",
  lightMode = false,
  triggerBorder,
  triggerColor,
  triggerHoverBorder,
  triggerHoverColor,
}: VoiceWidgetTriggerProps) {
  const { open } = useVoiceWidget();
  const { lang } = useLang();
  const tx = t[lang].voiceWidget;

  const tBorder      = triggerBorder      ?? accentColor;
  const tColor       = triggerColor       ?? accentColor;
  const tHoverBorder = triggerHoverBorder ?? accentColor;
  const tHoverColor  = triggerHoverColor  ?? (lightMode ? "#0f1016" : "#f0eeea");

  return (
    <button
      className="font-display uppercase"
      onClick={open}
      style={size === "lg" ? {
        fontSize: "1.1rem",
        letterSpacing: "0.15em",
        padding: "calc(1.25rem - 1px) calc(2.5rem - 1px)",
        border: `1px solid ${tBorder}`,
        color: tColor,
        background: "transparent",
        cursor: "pointer",
        whiteSpace: "nowrap",
        width: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 0.2s, border-color 0.2s",
      } : {
        fontSize: "0.72rem",
        letterSpacing: "0.16em",
        padding: "calc(0.875rem - 1px) calc(1.5rem - 1px)",
        border: `1px solid ${tBorder}`,
        color: tColor,
        background: "transparent",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "color 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = tHoverColor;
        (e.currentTarget as HTMLButtonElement).style.borderColor = tHoverBorder;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = tColor;
        (e.currentTarget as HTMLButtonElement).style.borderColor = tBorder;
      }}
    >
      {tx.trigger}
    </button>
  );
}
