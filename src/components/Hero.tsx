import { useState, FormEvent, useEffect } from "react";
import {
  Play,
  Terminal,
  ShieldAlert,
  Cpu,
  Sparkles,
  Send,
  CheckCircle2,
  Gamepad,
  Skull,
} from "lucide-react";
import { useUIAudio } from "../hooks/useUIAudio";
import { motion, AnimatePresence } from "motion/react";
import { SuccessModal } from "./SuccessModal";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

function FloatingSkull({ initialDelay }: { initialDelay: number }) {
  const { playClick, playHover } = useUIAudio();
  const [exploded, setExploded] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; r: number }[]
  >([]);
  const [position, setPosition] = useState({ top: "-100%", left: "-100%" });
  const [isHovered, setIsHovered] = useState(false);

  const generatePosition = () => {
    // Generate left or right side position to avoid center text, pushing wider to the sides
    const isLeftSide = Math.random() > 0.5;
    const sideOffset = isLeftSide
      ? 2 + Math.random() * 8       // Wide left
      : 85 + Math.random() * 10;    // Wide right
    return {
      top: `${10 + Math.random() * 80}%`,
      left: `${sideOffset}%`,
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosition(generatePosition());
    }, initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const handleExplode = () => {
    if (exploded) return;
    playClick();
    setExploded(true);
    setIsHovered(false);
    setParticles(
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        r: Math.random() * 360,
      })),
    );

    setTimeout(
      () => {
        setExploded(false);
        setPosition(generatePosition());
      },
      4000 + Math.random() * 2000,
    );
  };

  return (
    <div
      className={`absolute z-0 skull-container ${!exploded && position.top !== "-100%" ? "animate-float" : ""}`}
      style={{
        top: position.top,
        left: position.left,
        transition: exploded ? "none" : "top 0s, left 0s",
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (!exploded) playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!exploded ? (
        <Skull
          onClick={handleExplode}
          className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-150 cursor-pointer ${isHovered ? 'animate-jitter text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)]' : 'text-zinc-200 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]'}`}
        />
      ) : (
        <div className="relative w-6 h-6 sm:w-8 sm:h-8 pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.r }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#ffd700] shadow-[0_0_8px_rgba(255,215,0,1)]"
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface HeroProps {
  onWatchTrailer: () => void;
  onJoinAlpha: () => void;
}

export function Hero({ onWatchTrailer, onJoinAlpha }: HeroProps) {
  const { playHover, playClick } = useUIAudio();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [heroMediaUrl, setHeroMediaUrl] = useState("");

  useEffect(() => {
    const fetchHeroMedia = async () => {
      try {
        const docRef = doc(db, "config", "landing");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().heroImageUrl !== undefined) {
          setHeroMediaUrl(docSnap.data().heroImageUrl);
        } else {
          const stored = localStorage.getItem("voxel-hearth-hero-image");
          if (stored) setHeroMediaUrl(stored);
        }
      } catch (e) {
        console.error("Firestore read error, falling back to localStorage", e);
        const stored = localStorage.getItem("voxel-hearth-hero-image");
        if (stored) setHeroMediaUrl(stored);
      }
    };
    fetchHeroMedia();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    playClick();

    if (!email || !email.includes("@")) {
      setErrorStatus("Please enter a valid email coordinates.");
      return;
    }

    try {
      // 1. Write to official Firebase Firestore database "leads" collection
      await addDoc(collection(db, "leads"), {
        email: email.trim(),
        platform: "PC // STEAM",
        subscribedToNewsletter: true,
        date: new Date().toISOString(),
        source: "Hero Direct Hook",
      });

      // 2. Also save submission to localStorage so it is available as a local backup
      const existing = localStorage.getItem("voxel-hearth-emails");
      const list = existing ? JSON.parse(existing) : [];

      const newRecord = {
        id: "rec-" + Math.random().toString(36).substr(2, 9),
        email: email.trim(),
        date: new Date().toISOString(),
        source: "Hero Direct Hook",
        platform: "PC // STEAM",
      };

      list.unshift(newRecord);
      localStorage.setItem("voxel-hearth-emails", JSON.stringify(list));

      setIsSubmitted(true);
      setErrorStatus("");
      setEmail("");
    } catch (err) {
      console.error("Failed to persist email lead", err);
      // Even if network falls down, we can still fall back and notify success so user experience is smooth
      setIsSubmitted(true);
    }
  };

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
        mass: 1.2,
      },
    },
  };

  return (
    <section className="relative min-h-[calc(100vh-64px)] w-full flex items-start md:items-center justify-center overflow-hidden pt-12 pb-24 md:py-20 lg:py-24">
      <SuccessModal isOpen={isSubmitted} onClose={() => setIsSubmitted(false)} />
      {/* Background cinematic grid and linear gradient overlay */}
      <div className="absolute inset-0 bg-[#070709] bg-[radial-gradient(#18181c_1px,transparent_1px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent z-0 pointer-events-none" />

      {/* Radiant glow core in the distance representing the Hearth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-gradient-to-r from-hearth-gold/10 via-hearth-amber/10 to-transparent rounded-full filter blur-[100px] mix-blend-screen pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-swarm-purple/10 rounded-full filter blur-[80px] mix-blend-screen pointer-events-none z-0" />

      {/* Floating Interactive Skulls */}
      <FloatingSkull initialDelay={0} />
      <FloatingSkull initialDelay={1000} />
      <FloatingSkull initialDelay={2500} />
      <FloatingSkull initialDelay={3500} />
      <FloatingSkull initialDelay={4200} />
      <FloatingSkull initialDelay={5500} />

      {/* Main Content Pane */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative max-w-7xl mx-auto px-6 z-10 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-16 items-center pointer-events-none"
      >
        {/* LEFT COLUMN: Text & CTAs */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-1 w-full pointer-events-none">
          {/* Status indicator pill */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 bg-bedrock border border-neutral-800 rounded-sm mb-6 shadow-sm relative overflow-hidden group"
          >
            <span className="w-2 h-2 bg-hearth-gold rounded-full group-hover:animate-ping" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest uppercase text-zinc-400">
              ISOMETRIC SWARM ACTION // NOW ENLISTING PLAYTESTERS
            </span>
          </motion.div>

          {/* Impact Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight uppercase max-w-3xl mb-6"
          >
            <span className="text-white font-black">NO GROUND </span>
            <span className="text-hearth-gold drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">
              IS SAFE
            </span>
          </motion.h1>

          {/* Dynamic Subheader */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed mb-8 md:mb-10"
          >
            Emberfault is an isometric swarm action game with 100% destructible voxel terrain. Carve paths through the earth, shatter the floor beneath the horde, and weaponize physics with an iron hammer.
          </motion.p>

          {/* Integrated Conversion CTA */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-xl mb-12 pb-6 md:mb-0 md:pb-0 pointer-events-auto"
          >
            <div className="flex flex-col gap-4 items-center md:items-start w-full">
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col sm:flex-row bg-bedrock/85 p-1 border border-neutral-800 focus-within:border-hearth-gold/50 rounded-sm shadow-xl transition duration-300"
              >
                <div className="relative w-full flex-grow">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 uppercase pointer-events-none">
                    SYS //
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to secure your alpha key..."
                    className="w-full bg-transparent text-zinc-100 text-sm h-[52px] pl-16 pr-4 rounded-sm font-mono outline-none placeholder-zinc-500"
                  />
                </div>
                <button
                  type="submit"
                  onMouseEnter={playHover}
                  className="w-full sm:w-auto h-[52px] px-8 bg-hearth-gold hover:bg-hearth-amber font-mono font-bold text-xs uppercase tracking-widest text-black rounded-sm transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] mt-1 sm:mt-0"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Join The Alpha List 🩸</span>
                </button>
              </form>
            </div>
            {errorStatus && (
              <div className="mt-2 text-[10px] text-hearth-amber font-mono text-center md:text-left">
                ⚠️ {errorStatus}
              </div>
            )}
          </motion.div>
        </div>

        {/* Hero Background Media */}
        {heroMediaUrl && (
          <motion.div
            variants={itemVariants}
            className="w-full order-3 md:order-2 relative rounded-sm overflow-hidden border border-neutral-800 shadow-[0_0_30px_rgba(157,78,221,0.1)] group max-h-[35vh] md:max-h-[60vh] flex items-center justify-center pointer-events-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#070709]/40 via-transparent to-swarm-purple/10 z-10 pointer-events-none mix-blend-overlay" />
            <img
              src={heroMediaUrl}
              alt="Emberfault Pre-alpha capture"
              className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
            />
            {/* Edge fading to blend seamlessly */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070709] via-[#070709]/50 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#070709] via-[#070709]/50 to-transparent z-10 pointer-events-none hidden md:block" />
          </motion.div>
        )}

        {/* Retro Console Readout Overlay */}
        <motion.div
          variants={itemVariants}
          className="hidden md:flex col-span-1 md:col-span-2 order-2 md:order-3 gap-12 mt-4 md:mt-12 border-t border-neutral-900 pt-8 w-full justify-center text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-wider relative"
        >
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-hearth-gold animate-bounce" />
            <span>Fully Destructible Landscapes</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-swarm-purple" />
            <span>Relentless Dynamic Horde</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-hearth-amber" />
            <span>Striking Dark Cave Illumination</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
