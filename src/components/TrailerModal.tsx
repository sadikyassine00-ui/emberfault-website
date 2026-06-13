import { motion, AnimatePresence } from "motion/react";
import { X, Play, Volume2, ShieldAlert, Zap } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrailerModal({ isOpen, onClose }: TrailerModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [simulationStep, setSimulationStep] = useState(0);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchTrailer = async () => {
      try {
        const docRef = doc(db, "config", "landing");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().trailerUrl) {
          setTrailerUrl(docSnap.data().trailerUrl);
        } else {
          const storedUrl = localStorage.getItem("voxel-hearth-trailer");
          if (storedUrl) setTrailerUrl(storedUrl);
        }
      } catch (e) {
        console.error("Firestore read error, falling back to localStorage", e);
        const storedUrl = localStorage.getItem("voxel-hearth-trailer");
        if (storedUrl) setTrailerUrl(storedUrl);
      }
    };
    fetchTrailer();
  }, [isOpen]);

  // Animate a simple gameplay ASCII/Block simulation inside the player
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSimulationStep((prev) => (prev + 1) % 40);
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  // procedural frame-based simulation visuals
  const renderMockGameplay = () => {
    const gridCols = 24;
    const gridRows = 12;
    const items: ReactNode[] = [];

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const isPlayer = c === 12 && r === 8;
        const isHearth = c === 12 && r === 5;
        
        // Simulating hordes of purple voxels closing in
        const pulseRatio = simulationStep / 40;
        const waveX = Math.floor(12 + Math.cos(pulseRatio * Math.PI * 2) * 8);
        const waveY = Math.floor(6 + Math.sin(pulseRatio * Math.PI * 2) * 4);
        const isEnemy = Math.abs(c - waveX) < 2 && Math.abs(r - waveY) < 2 && Math.random() > 0.4;
        
        // Simulating mining drone beams projecting outwards
        const bulletDist = (simulationStep % 6) + 1;
        const isBulletRight = r === 8 && c === 12 + bulletDist;
        const isBulletLeft = r === 8 && c === 12 - bulletDist;

        // Voxel block style
        let bgColor = "bg-[#18181c] border border-neutral-850";
        let shadowClass = "";

        if (isPlayer) {
          bgColor = "bg-white border-white";
          shadowClass = "shadow-[0_0_15px_#fff]";
        } else if (isHearth) {
          bgColor = "bg-hearth-red animate-pulse";
          shadowClass = "shadow-[0_0_20px_#ff4500]";
        } else if (isEnemy) {
          bgColor = "bg-swarm-purple";
          shadowClass = "shadow-[0_0_10px_#9d00ff]";
        } else if (isBulletRight || isBulletLeft) {
          bgColor = "bg-hearth-amber";
          shadowClass = "shadow-[0_0_8px_#ff8c00]";
        } else if (r === 11) {
          // destructible floor / bedrocks
          bgColor = "bg-zinc-805 bg-neutral-800";
        }

        items.push(
          <div
            key={`${r}-${c}`}
            className={`w-full aspect-square rounded-sm transition-colors duration-150 ${bgColor} ${shadowClass}`}
          />
        );
      }
    }

    return (
      <div className="grid grid-cols-24 gap-[2px] bg-void p-3 rounded-sm border border-neutral-800 relative select-none font-mono">
        {items}

        {/* HUD overlay inside simulation */}
        <div className="absolute top-4 left-4 z-10 flex gap-4 text-[9px] text-zinc-400 font-mono tracking-widest uppercase pointer-events-none">
          <div className="bg-void/90 p-1.5 border border-neutral-800 flex items-center gap-1.5 rounded-sm">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
            <span>HEARTH STATUS: 92%</span>
          </div>
          <div className="bg-void/90 p-1.5 border border-neutral-800 flex items-center gap-1.5 rounded-sm">
            <ShieldAlert className="w-3 h-3 text-swarm-purple animate-bounce" />
            <span>SWARM DENSITY: EXTREME</span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 z-10 bg-void/90 p-1.5 border border-zinc-800 font-mono text-[9px] uppercase tracking-wider rounded-sm pointer-events-none">
          <span>TENSION RATING: CRITICAL</span>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-void/95 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-3xl bg-bedrock rounded-sm border border-neutral-800 shadow-[0_0_50px_rgba(255,69,0,0.15)] flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-900 bg-[#121215]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-hearth-red animate-pulse" />
              <h3 className="font-display font-black text-white hover:text-hearth-amber tracking-wider text-base uppercase">
                Emberfault // Alpha Gameplay Trailer
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-2 text-xs font-mono border border-neutral-805 border-zinc-700 bg-void hover:bg-hearth-red hover:text-white rounded-sm transition text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Gameplay Simulation Window or Real Video */}
          <div className="p-6 bg-[#09090b] flex flex-col gap-4">
            <div className="relative">
              {trailerUrl ? (
                <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-neutral-800 shadow-[0_0_20px_rgba(255,140,0,0.1)]">
                   <iframe 
                      className="w-full h-full" 
                      src={trailerUrl} 
                      title="Emberfault Trailer" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                   ></iframe>
                </div>
              ) : (
                <>
                  {!isPlaying && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-void/80 backdrop-blur-xs">
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="p-4 bg-hearth-red hover:bg-hearth-amber text-white font-mono text-xs uppercase tracking-widest font-bold glow-hearth flex items-center gap-2 rounded-sm transition-all"
                      >
                        <Play className="w-5 h-5 fill-white" />
                        <span>Watch Sandbox Feed</span>
                      </button>
                    </div>
                  )}
                  {renderMockGameplay()}
                </>
              )}
            </div>

            {/* Subtitles & Narrative log */}
            <div className="bg-void border border-neutral-900 p-4 rounded-sm flex items-start gap-4">
              <div className="p-2 bg-hearth-red/10 rounded-sm shrink-0 font-bold border border-hearth-red/30 text-hearth-red font-mono text-[10px]">
                NARRATIVE FEED
              </div>
              <p className="text-xs text-zinc-450 leading-relaxed font-mono">
                {simulationStep < 10 && ">> SYSTEM WARNING: High-gravity swarm triggers incoming from coordinates sector 42."}
                {simulationStep >= 10 && simulationStep < 20 && ">> DESTRUCTIBILITY REPORT: Plasma beam carving terrain coordinates. Sub-grid level -18 shredded."}
                {simulationStep >= 20 && simulationStep < 30 && ">> WARNING: AI Tension Director promoting swarm drones to Emissive Voxel variants."}
                {simulationStep >= 30 && ">> EMERGENCY ACTIVE: Activate thermal hearth energy shield to maintain bedrock stabilization."}
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-neutral-900 bg-[#121215] text-[11px] font-mono text-zinc-400">
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-zinc-300 hover:text-hearth-amber transition bg-void/50 px-2 py-1 border border-neutral-800 rounded-sm"
              >
                {isPlaying ? "PAUSE FEED" : "RESUME FEED"}
              </button>
              <span className="text-neutral-700">|</span>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Volume2 className="w-3.5 h-3.5" />
                <span>SOUNDTRACK: RETRO CHIP</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-hearth-red animate-ping" />
              <span className="text-[10px]">LIVE RENDER // godot_runtime_x64</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
