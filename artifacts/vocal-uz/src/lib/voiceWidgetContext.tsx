import { createContext, useContext, useState, type ReactNode } from "react";
import { VoiceRangeWidget } from "@/components/VoiceRangeWidget";

interface VoiceWidgetContextValue {
  open: () => void;
}

const VoiceWidgetContext = createContext<VoiceWidgetContextValue | null>(null);

interface VoiceWidgetProviderProps {
  children: ReactNode;
  accentColor: string;
  pageName: string;
  lightMode?: boolean;
}

export function VoiceWidgetProvider({
  children,
  accentColor,
  pageName,
  lightMode = false,
}: VoiceWidgetProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <VoiceWidgetContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <VoiceRangeWidget
        accentColor={accentColor}
        pageName={pageName}
        lightMode={lightMode}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </VoiceWidgetContext.Provider>
  );
}

export function useVoiceWidget(): VoiceWidgetContextValue {
  const ctx = useContext(VoiceWidgetContext);
  if (!ctx) throw new Error("useVoiceWidget must be used within VoiceWidgetProvider");
  return ctx;
}
