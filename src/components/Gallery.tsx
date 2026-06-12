import { useState, useEffect, ReactNode } from "react";
import { Maximize2, Zap, Compass, Flame, ShieldAlert, Sparkles, X, Swords, Star } from "lucide-react";
import { useUIAudio } from "../hooks/useUIAudio";
import { motion } from "motion/react";

interface MediaItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: "Combat" | "Destruction" | "Atmosphere";
  accentColor: string;
  glowClass: string;
  proceduralVisual: ReactNode;
}

export function Gallery() {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [customImages, setCustomImages] = useState<any[]>([]); // Using 'any' for fallback or generic JSON
  const { playHover, playClick } = useUIAudio();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("voxel-hearth-gallery-v2");
      if (stored) {
        setCustomImages(JSON.parse(stored));
      } else {
        const seedData = [
          { id: "seed-1", proceduralId: "screen-1", title: "The Core Furnace", subtitle: "Heart of the Cavern", category: "Atmosphere", description: "Secure and defend the radiant central hearth. This ancient gold core pulses warmth and illumination across the bedrock corridors, serving as the ultimate line of defense against the shadow-dwelling swarms.", url: "" },
          { id: "seed-2", proceduralId: "screen-2", title: "Bedrock Cataclysm", subtitle: "Tactical Cave-ins", category: "Destruction", description: "Demolish unstable cavern support beams to trigger a devastating, physical landslide. Use the falling stone blocks to crush high-density crawler packs or build makeshift blockades.", url: "" },
          { id: "seed-3", proceduralId: "screen-3", title: "Horde Containment", subtitle: "Funneling the Terror", category: "Combat", description: "When the dynamic danger scales to dangerous heights, force thousands of rushing enemies through custom-carved narrow tunnels of death. Maximize explosive payload value.", url: "" },
          { id: "seed-4", proceduralId: "screen-4", title: "Prism Burst Fire", subtitle: "Banish the Shadows", category: "Combat", description: "Discharge luminous golden spell strikes directly into the cavernous void. Every ray of energy illuminates dark rock layers and exposes creeping flankers before they strike from above.", url: "" },
          { id: "seed-5", proceduralId: "screen-5", title: "Chipping Outposts", subtitle: "Cavalry Trenches", category: "Destruction", description: "Chisel protective trench fortifications in strategic bottlenecks. Reinforce stone block borders with active defense units, allowing you to sustain gunfire on waves of enemies.", url: "" },
          { id: "seed-6", proceduralId: "screen-6", title: "Luminous Shrines", subtitle: "Mysterious Altars", category: "Atmosphere", description: "Locate golden glowing monuments nested deep within the obsidian stone tunnels. Activate these radiant monoliths to trigger heavy spell powers and massive area-of-effect flash attacks.", url: "" }
        ];
        localStorage.setItem("voxel-hearth-gallery-v2", JSON.stringify(seedData));
        setCustomImages(seedData);
      }
    } catch(err) {}
  }, []);

  // Map the procedurals into a registry so we can merge them by proceduralId
  const PROCEDURAL_REGISTRY: Record<string, any> = {
    "screen-1": {
      accentColor: "text-hearth-gold",
      glowClass: "hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]",
      proceduralVisual: (
        <div className="w-full h-full bg-[#0d0d10] relative flex items-center justify-center overflow-hidden border border-neutral-900">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="w-16 h-16 bg-[#ffd700] rounded-sm animate-pulse flex items-center justify-center glow-hearth shadow-inner">
            <Flame className="w-8 h-8 text-black transition duration-300" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-[#ffd700]/20 rounded-full animate-spin [animation-duration:12s]" />
          <div className="absolute bottom-3 left-3 bg-void/90 px-2 py-0.5 border border-neutral-850 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            HEARTH RATING: 100%
          </div>
        </div>
      )
    },
    "screen-2": {
      accentColor: "text-hearth-amber",
      glowClass: "hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]",
      proceduralVisual: (
        <div className="w-full h-full bg-[#0d0d10] relative flex flex-col justify-between p-4 overflow-hidden border border-neutral-900">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(250,204,21,0.05)_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="flex justify-around">
            <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-sm translate-y-6 animate-float" />
            <div className="w-10 h-10 bg-zinc-700 border border-zinc-650 rounded-sm translate-y-10 animate-float [animation-delay:1.5s]" />
            <div className="w-6 h-6 bg-zinc-900 border border-zinc-200/5 rounded-sm translate-y-3 animate-float [animation-delay:3s]" />
          </div>
          <div className="flex justify-center mt-auto">
            <div className="w-10 h-10 bg-swarm-purple/20 border border-swarm-purple/40 text-swarm-purple rounded-sm flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-void/90 px-2 py-0.5 border border-neutral-850 text-[9px] font-mono text-hearth-amber uppercase tracking-widest">
            STRUCTURAL FLUIDITY: INSECURE
          </div>
        </div>
      )
    },
    "screen-3": {
      accentColor: "text-swarm-purple",
      glowClass: "hover:shadow-[0_0_20px_rgba(157,0,255,0.25)]",
      proceduralVisual: (
        <div className="w-full h-full bg-[#0d0d10] relative flex items-center justify-between px-6 overflow-hidden border border-neutral-900">
          <div className="w-1/4 h-full bg-zinc-900 border-r border-neutral-800" />
          <div className="flex-1 h-full relative flex items-center justify-center">
            <div className="w-3 h-3 bg-swarm-purple rounded-xs animate-ping absolute top-12 left-6" />
            <div className="w-2.5 h-2.5 bg-swarm-purple rounded-xs animate-ping absolute bottom-8 right-6 [animation-delay:1s]" />
            <div className="w-3.5 h-3.5 bg-swarm-purple rounded-xs animate-ping absolute top-1/2 left-12 [animation-delay:2.5s]" />
          </div>
          <div className="w-1/4 h-full bg-zinc-900 border-l border-neutral-800" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-void/95 px-3 py-1 border border-swarm-purple/30 text-[9px] font-mono text-swarm-purple uppercase tracking-widest shadow-sm">
            SWARM RADIUS: HIGH
          </div>
        </div>
      )
    },
    "screen-4": {
      accentColor: "text-hearth-gold",
      glowClass: "hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]",
      proceduralVisual: (
        <div className="w-full h-full bg-[#0d0d10] relative flex items-center justify-center overflow-hidden border border-neutral-900">
          <div className="absolute w-full h-[3px] bg-gradient-to-r from-transparent via-[#ffd700] to-transparent shadow-[0_0_15px_#ffd700]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-12">
            <Sparkles className="w-6 h-6 text-hearth-gold animate-spin [animation-duration:4s]" />
            <Sparkles className="w-5 h-5 text-hearth-amber animate-bounce" />
          </div>
          <div className="absolute bottom-3 right-3 bg-void/90 px-2 py-0.5 border border-neutral-850 text-[9px] font-mono text-zinc-550 text-zinc-500 uppercase tracking-widest">
            FUSING RADIANTS
          </div>
        </div>
      )
    },
    "screen-5": {
      accentColor: "text-hearth-amber",
      glowClass: "hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]",
      proceduralVisual: (
        <div className="w-full h-full bg-[#0d0d10] relative flex flex-col justify-end p-4 overflow-hidden border border-neutral-900">
          <div className="flex gap-2 justify-center mb-8">
            <Compass className="w-5 h-5 text-zinc-650 text-zinc-500 animate-spin" />
          </div>
          <div className="flex items-end gap-1 font-mono justify-center">
            <div className="w-8 h-6 bg-zinc-850 border border-neutral-800" />
            <div className="w-8 h-12 bg-zinc-800 border border-neutral-700 relative flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-hearth-gold animate-pulse" />
            </div>
            <div className="w-8 h-6 bg-zinc-850 border border-neutral-800" />
          </div>
          <div className="absolute top-3 left-3 bg-void/90 px-2 py-0.5 border border-neutral-850 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            TRENCH RADAR: RUNNING
          </div>
        </div>
      )
    },
    "screen-6": {
      accentColor: "text-swarm-purple",
      glowClass: "hover:shadow-[0_0_20px_rgba(157,0,255,0.25)]",
      proceduralVisual: (
        <div className="w-full h-full bg-[#0d0d10] relative flex items-center justify-center overflow-hidden border border-neutral-900">
          <div className="w-8 h-16 bg-gradient-to-t from-swarm-purple/35 to-[#9d00ff]/70 border border-[#9d00ff] relative rounded-t-sm flex items-center justify-center shadow-[0_0_15px_rgba(157,0,255,0.4)]">
            <Swords className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="absolute top-2 w-4 h-4 bg-[#ffd700] rounded-full filter blur-[4px] animate-bounce" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-void/90 px-2 py-0.5 border border-neutral-850 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            ALTAR INTACT
          </div>
        </div>
      )
    }
  };

  const galleryItems: MediaItem[] = customImages.map((img, index) => {
    if (img.proceduralId && PROCEDURAL_REGISTRY[img.proceduralId]) {
      return {
        id: img.id || `proc-screen-${index}`,
        title: img.title || "Community Capture",
        subtitle: img.subtitle || "Custom Upload",
        category: img.category || "Atmosphere",
        description: img.description || "",
        accentColor: PROCEDURAL_REGISTRY[img.proceduralId].accentColor,
        glowClass: PROCEDURAL_REGISTRY[img.proceduralId].glowClass,
        proceduralVisual: PROCEDURAL_REGISTRY[img.proceduralId].proceduralVisual,
      };
    }
    
    return {
      id: img.id || `custom-screen-${index}`,
      title: img.title || "Community Capture",
      subtitle: img.subtitle || "Custom Upload",
      category: img.category || "Atmosphere",
      accentColor: "text-zinc-300",
      glowClass: "hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]",
      description: img.description || "A custom image uploaded to the sandbox.",
      proceduralVisual: (
        <div className="w-full h-full bg-[#0d0d10] relative flex items-center justify-center overflow-hidden border border-neutral-900">
           <img src={img.url} alt={`Custom upload ${index}`} className="w-full h-full object-cover" />
        </div>
      )
    };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 12,
        mass: 1.2
      } 
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="space-y-12"
    >
      {/* Header section with voxel branding */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 bg-hearth-gold inline-block" />
            <span className="font-mono text-xs text-hearth-amber uppercase tracking-widest font-bold">SCREENSHOTS & MEDIA</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white uppercase leading-none">
            ADRENALINE CAPTURES
          </h3>
        </div>
        <p className="max-w-md text-xs text-zinc-400 font-mono leading-relaxed border-l-2 border-neutral-800 pl-4">
          Witness high-intensity destruction loops and vibrant ambient lights shining through dark subterranean pits. Expand any frame to inspect the battlefield.
        </p>
      </motion.div>

      {/* Grid Layout of 6 Screens: Single Column on Mobile, Two Columns on Tablet, Three on Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <motion.div
            variants={itemVariants}
            key={item.id}
            onClick={() => {
              playClick();
              setSelectedItem(item);
            }}
            onMouseEnter={playHover}
            className={`group relative bg-bedrock rounded-sm border border-neutral-800 p-3 flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-hearth-gold/50 ${item.glowClass}`}
          >
            {/* Visual Aspect Container (16:10 aspect ratio) */}
            <div className="w-full aspect-[16/10] bg-void rounded-xs overflow-hidden relative mb-4">
              {item.proceduralVisual}
              
              {/* Expand Overlay on Hover */}
              <div className="absolute inset-0 bg-void/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                <div className="p-2.5 bg-hearth-gold text-black rounded-sm shadow-lg border border-white/20 transform scale-90 group-hover:scale-100 transition-all duration-300">
                  <Maximize2 className="w-4.5 h-4.5" />
                </div>
              </div>
            </div>

            {/* Metadata Labeling */}
            <div className="px-1 flex justify-between items-center">
              <div>
                <h4 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-tight group-hover:text-hearth-gold transition">
                  {item.title}
                </h4>
                <p className="font-mono text-[10px] text-zinc-500 leading-none mt-0.5">
                  {item.subtitle}
                </p>
              </div>

              <span className={`font-mono text-[9px] uppercase border px-1.5 py-0.5 rounded-sm tracking-wider ${
                item.category === "Combat"
                  ? "bg-swarm-purple/10 border-swarm-purple/30 text-swarm-purple"
                  : item.category === "Destruction"
                  ? "bg-hearth-amber/10 border-hearth-amber/30 text-hearth-amber"
                  : "bg-hearth-gold/10 border-hearth-gold/30 text-hearth-gold"
              }`}>
                {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Immersive Lightbox Modal Container */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => {
              playClick();
              setSelectedItem(null);
            }}
            className="absolute inset-0 bg-void/95 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-2xl bg-bedrock rounded-sm border border-neutral-800 shadow-[0_0_50px_rgba(250,204,21,0.15)] overflow-hidden z-10 p-5 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center pb-3 border-b border-neutral-900">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs uppercase px-2 py-0.5 rounded-sm bg-void border border-neutral-800 font-bold ${selectedItem.accentColor}`}>
                  {selectedItem.category} FIELD REPORT
                </span>
              </div>
              <button
                onClick={() => {
                  playClick();
                  setSelectedItem(null);
                }}
                onMouseEnter={playHover}
                className="p-1 text-xs font-mono border border-neutral-850 bg-void hover:bg-neutral-800 rounded-sm text-zinc-400 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full aspect-[16/10] bg-void border border-neutral-900 overflow-hidden relative">
              {selectedItem.proceduralVisual}
            </div>

            <div className="px-1 space-y-2">
              <h4 className="font-display font-black text-white text-xl uppercase tracking-tight">
                {selectedItem.title} // <span className={selectedItem.accentColor}>{selectedItem.subtitle}</span>
              </h4>
              <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-900 font-mono text-[9px] text-zinc-500">
              <span>CAPTURE_ID: {selectedItem.id.toUpperCase()} // ACTIVE DEPLOYMENT</span>
              <button
                onClick={() => {
                  playClick();
                  setSelectedItem(null);
                }}
                onMouseEnter={playHover}
                className="hover:text-hearth-gold hover:border-hearth-gold/30 transition px-2.5 py-1.5 border border-neutral-850 rounded-sm bg-void/40 uppercase cursor-pointer"
              >
                Close Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
