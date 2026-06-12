import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, Cpu, Radio, Gamepad } from "lucide-react";
import { useUIAudio } from "../hooks/useUIAudio";

export function SuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { playClick, playHover } = useUIAudio();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-hearth-gold/30 p-8 sm:p-12 pl-8 pr-8 rounded-sm text-center shadow-2xl overflow-hidden"
          >
            {/* Fireworks / Celebration Effects */}
            <Fireworks />

            <button
              onClick={() => { playClick(); onClose(); }}
              onMouseEnter={playHover}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 text-3xl sm:text-4xl font-display font-black text-white tracking-tight mb-6"
            >
              You're on the list! 🩸
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 w-full mb-10 max-w-lg mx-auto space-y-4"
            >
              <p className="text-zinc-300 font-sans leading-relaxed text-sm sm:text-base text-center px-4">
                Emberfault is a solo passion project built entirely by one developer. Because there's no massive publisher or big team behind this, a little bit of support goes an incredibly long way.
              </p>
              <p className="text-zinc-300 font-sans leading-relaxed text-sm sm:text-base text-center px-4">
                The absolute best way to back the project right now is to hit that Wishlist button on Steam. It helps force the algorithm to pay attention and gives an independent game a real fighting chance. Grab your hammer and get on the board.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative z-10 flex flex-col items-center justify-center gap-4"
            >
              <button 
                onClick={() => { playClick(); window.open('https://store.steampowered.com/', '_blank'); }}
                onMouseEnter={playHover}
                className="relative py-3 px-8 bg-hearth-gold hover:bg-hearth-amber font-mono font-bold text-sm uppercase tracking-wider text-black rounded-sm transition animate-breathe-glow active:scale-95 flex items-center justify-center gap-3 glow-hearth shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:shadow-[0_0_25px_rgba(250,204,21,0.8)] group w-full sm:w-auto cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <Gamepad className="w-5 h-5 group-hover:animate-pulse" strokeWidth={2.5} />
                </div>
                <span>Wishlist Now</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Fireworks() {
  const [particles, setParticles] = useState<{id: number; x: number; y: number; color: string; scale: number; duration: number; delay: number}[]>([]);

  useEffect(() => {
    const colors = ["#facc15", "#fef08a", "#fbbf24", "#eab308"];
    const p = [];
    for(let i=0; i<40; i++) {
      p.push({
        id: i,
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: Math.random() * 1.5 + 0.5,
        duration: 0.8 + Math.random() * 0.8,
        delay: Math.random() * 0.3
      });
    }
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-70">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: p.scale, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }}
        />
      ))}
    </div>
  );
}
