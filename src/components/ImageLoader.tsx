import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ShieldAlert } from "lucide-react";

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  theme?: "gold" | "purple" | "amber";
}

export function ImageLoader({
  src,
  alt,
  className = "",
  containerClassName = "",
  loading = "lazy",
  decoding = "async",
  theme = "gold",
}: ImageLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const themeColors = {
    gold: {
      text: "text-hearth-gold",
      ping: "bg-hearth-gold",
      border: "border-hearth-gold/20",
      glow: "shadow-[0_0_15px_rgba(250,204,21,0.15)]",
      label: "HEARTH // SECURE_LINK",
    },
    purple: {
      text: "text-swarm-purple",
      ping: "bg-swarm-purple",
      border: "border-swarm-purple/20",
      glow: "shadow-[0_0_15px_rgba(157,78,221,0.15)]",
      label: "SWARM // SCANNING_CELL",
    },
    amber: {
      text: "text-hearth-amber",
      ping: "bg-hearth-amber",
      border: "border-hearth-amber/20",
      glow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]",
      label: "CORE // BUFFERING_STREAM",
    },
  };

  const currentTheme = themeColors[theme] || themeColors.gold;

  return (
    <div
      className={`relative overflow-hidden w-full h-full bg-[#070709] border border-neutral-900/60 rounded-xs flex items-center justify-center ${containerClassName}`}
    >
      <AnimatePresence mode="wait">
        {!isLoaded && !hasError && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090b] z-10 p-4"
          >
            {/* Grid overlay for aesthetic */}
            <div className="absolute inset-0 bg-[#070709] bg-[radial-gradient(#18181c_1px,transparent_1px)] [background-size:12px_12px] opacity-40 z-0 pointer-events-none" />

            {/* Pulsing ring and spinner */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="relative">
                <Loader2 className={`w-6 h-6 animate-spin ${currentTheme.text}`} />
                <div
                  className={`absolute -inset-1 rounded-full border ${currentTheme.border} ${currentTheme.glow} animate-pulse`}
                />
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-zinc-500 select-none">
                <span className={`w-1.5 h-1.5 rounded-full animate-ping ${currentTheme.ping}`} />
                <span>{currentTheme.label}</span>
              </div>
            </div>
          </motion.div>
        )}

        {hasError && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0505] z-10 p-4 border border-red-950/40"
          >
            <ShieldAlert className="w-6 h-6 text-red-500 mb-2 animate-bounce" />
            <span className="font-mono text-[9px] text-red-500 uppercase tracking-widest select-none">
              ERROR // OFFLINE_SOURCE
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover scale-100 transition-all duration-700 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  );
}
