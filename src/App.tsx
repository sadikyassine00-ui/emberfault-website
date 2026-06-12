import React, { useState, useEffect, FormEvent } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { InteractiveShredder } from "./components/InteractiveShredder";
import { Gallery } from "./components/Gallery";
import { TrailerModal } from "./components/TrailerModal";
import { WishlistModal } from "./components/WishlistModal";
import { SoloDevCorner } from "./components/SoloDevCorner";

const LoginWrapper = React.lazy(() => import("./components/LoginWrapper").then(m => ({ default: m.LoginWrapper })));
const AdminDashboard = React.lazy(() => import("./components/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
import { MessageSquare, Twitter, Youtube, Sparkles, CheckCircle2, Gift, ShieldAlert } from "lucide-react";
import { useUIAudio } from "./hooks/useUIAudio";
import { motion } from "motion/react";

export default function App() {
  const { playHover, playClick } = useUIAudio();
  const [modalType, setModalType] = useState<"alpha" | "wishlist" | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isAdminPath, setIsAdminPath] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Incentive Section form states
  const [incentiveEmail, setIncentiveEmail] = useState("");
  const [isIncentiveSubmitted, setIsIncentiveSubmitted] = useState(false);
  const [incentiveError, setIncentiveError] = useState("");

  useEffect(() => {
    // Record visit
    const recordVisit = async () => {
      try {
        if (!sessionStorage.getItem('voxel_hearth_visited')) {
          await addDoc(collection(db, "visits"), {
             date: new Date().toISOString(),
             platform: navigator.platform || "Unknown",
             userAgent: navigator.userAgent
          });
          sessionStorage.setItem('voxel_hearth_visited', 'true');
        }
      } catch (err) {
        console.error("Failed to log visit", err);
      }
    };
    recordVisit();
  }, []);

  // Smooth Scroll Progress & Hash routing tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = (window.scrollY / scrollHeight) * 105;
        setScrollProgress(progress);
      }
    };
    
    const handleHashChange = () => {
      setIsAdminPath(
        window.location.pathname === "/dashboard" || 
        window.location.hash === "#dashboard" || 
        window.location.hash === "#/dashboard" || 
        window.location.hash === "#hq-admin-access"
      );
    };

    // Initial check
    handleHashChange();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const handleIncentiveSubmit = async (e: FormEvent) => {
    e.preventDefault();
    playClick();

    if (!incentiveEmail || !incentiveEmail.includes("@")) {
      setIncentiveError("Please enter valid email coordinates.");
      return;
    }

    try {
      const newRecord = {
        email: incentiveEmail.trim(),
        date: new Date().toISOString(),
        source: "Final CTA Incentive",
        platform: "PC // STEAM"
      };

      await addDoc(collection(db, "leads"), newRecord);

      setIsIncentiveSubmitted(true);
      setIncentiveError("");
      setIncentiveEmail("");
    } catch (err) {
      console.error(err);
      setIncentiveError("Network delay, please verify coordinates.");
    }
  };

  return (
    <div className="bg-void min-h-screen text-zinc-100 flex flex-col relative selection:bg-hearth-gold selection:text-black">
      {/* Scroll Progress Bar at the top of viewport */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-hearth-gold to-hearth-amber z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Sticky Navigation Bar */}
      <Navbar 
        onWishlistClick={() => {
          playClick();
          window.open('https://store.steampowered.com/', '_blank');
        }} 
      />

      {isAdminPath ? (
        /* Hidden Admin View Mode with Mock Auth */
        <main className="flex-grow">
          <React.Suspense fallback={
            <div className="min-h-screen bg-void flex items-center justify-center p-6 text-zinc-300 font-mono font-bold tracking-widest uppercase">
              <div className="animate-pulse">INITIALIZING SECURE CONNECTION...</div>
            </div>
          }>
            <LoginWrapper>
              <AdminDashboard onBackToLanding={() => {
                if (window.location.pathname === "/dashboard") {
                  window.history.pushState({}, "", "/");
                  window.dispatchEvent(new Event("popstate"));
                } else {
                  window.location.hash = "";
                }
              }} />
            </LoginWrapper>
          </React.Suspense>
        </main>
      ) : (
        /* Standard Marketing Funnel Path representing gamers' discovery patterns */
        <main className="flex-grow flex flex-col">
          
          {/* SECTION 1: HERO (THE HOOK) */}
          <Hero
            onWatchTrailer={() => {
              playClick();
              setIsTrailerOpen(true);
            }}
            onJoinAlpha={() => {
              playClick();
              setModalType("alpha");
            }}
          />

          {/* SECTION 2: THE VISUAL GALLERY (THE PROOF) */}
          <section id="gallery" className="scroll-mt-24 max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
            <Gallery />
          </section>

          {/* INTERACTIVE COMPONENT: REAL-TIME DESTRUCTIBILITY PREVIEW */}
          <section id="shredder" className="scroll-mt-24 max-w-7xl mx-auto px-6 py-16 md:py-24 w-full space-y-6 border-y border-neutral-900 bg-gradient-to-b from-void via-bedrock/25 to-void">
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-hearth-gold/10 border border-hearth-gold/20 rounded-full mb-3">
                <span className="w-1.5 h-1.5 bg-hearth-amber rounded-full animate-pulse" />
                <span className="text-[10px] font-mono tracking-wider text-hearth-amber uppercase">REAL-TIME SANDBOX EXTREME</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white uppercase mb-2">
                CAVERN STRATEGY INTERACTIVE
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                Test-drive our destruction and building math. Click or hold your cursor over the bedrock to disintegrate structural walls in real-time, or build fortresses to protect the core.
              </p>
            </motion.div>
            <InteractiveShredder />
          </section>

          {/* SECTION 3: FEATURE HOOKS (THE PITCH) */}
          <section id="features" className="scroll-mt-24 max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
            <Features />
          </section>

          {/* SECTION 4: THE SOLO DEV CORNER */}
          <section className="relative z-20 bg-void">
            <SoloDevCorner />
          </section>

          {/* SECTION 5: THE FINAL CTA (THE CLOSE) */}
          <section className="relative w-full overflow-hidden bg-[#0a0a0d] border-t border-neutral-900 py-20 px-6">
            {/* Background geometric flare */}
            <div className="absolute inset-0 bg-[radial-gradient(#1c1917_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-r from-hearth-gold/5 via-hearth-amber/5 to-transparent rounded-full filter blur-[120px] mix-blend-screen pointer-events-none z-0" />
            
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="max-w-4xl mx-auto relative z-10 text-center space-y-8 flex flex-col items-center"
            >
              {/* Special Incentive Indicator badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-bedrock border-2 border-hearth-gold/35 rounded-sm animate-pulse-ring shadow-lg">
                <Gift className="w-4 h-4 text-hearth-gold" />
                <span className="text-[10px] font-mono tracking-widest uppercase text-hearth-gold font-bold">
                  EXCLUSIVE ALPHA TEAM DROP ACCESS
                </span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-5xl leading-tight text-white uppercase">
                SHAPE THE FIRE. <br />
                <span className="bg-gradient-to-r from-hearth-gold to-hearth-amber bg-clip-text text-transparent">
                  RETRIEVE YOUR EXCLUSIVE WARHAMMER SKIN.
                </span>
              </h2>

              <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                Join our deep-earth playtest today and lock-in the <strong className="text-hearth-gold uppercase">"Prism-Ignited Carbon" Warhammer skin</strong>, gifted instantly to your account upon deep deployment. Help us calibrate the seismic physics and balance the swarm density!
              </p>

              {/* Dynamic registration form (Incentive channel) */}
              {!isIncentiveSubmitted ? (
                <form 
                  onSubmit={handleIncentiveSubmit}
                  className="w-full max-w-md bg-bedrock border border-neutral-800 focus-within:border-hearth-gold p-1.5 rounded-sm flex flex-col sm:flex-row gap-2 shadow-2xl transition duration-300"
                >
                  <input
                    type="email"
                    value={incentiveEmail}
                    onChange={(e) => setIncentiveEmail(e.target.value)}
                    placeholder="Enter email address for hammer skin drops..."
                    className="flex-grow bg-transparent text-xs text-zinc-100 font-mono py-2.5 px-3 outline-none placeholder-zinc-650"
                  />
                  <button
                    type="submit"
                    onMouseEnter={playHover}
                    className="py-3 px-6 bg-gradient-to-r from-hearth-gold to-hearth-amber hover:from-hearth-amber hover:to-hearth-gold font-mono font-bold text-[10px] uppercase tracking-wider text-black rounded-sm transition active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    DEPLOY DROPS
                  </button>
                </form>
              ) : (
                <div className="w-full max-w-md bg-hearth-gold/5 border border-hearth-gold/30 p-5 rounded-sm text-center">
                  <div className="flex items-center justify-center gap-2 text-hearth-gold font-mono text-xs uppercase tracking-widest mb-1.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-hearth-gold" />
                    <span>DROPS ASSIGNED</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans leading-tight">
                    Excellent choice, Operator. Your "Prism-Ignited" Warhammer skin has been successfully allocated to your address. We'll deploy entry coordinates when deep-earth playtests commence.
                  </p>
                </div>
              )}


              {incentiveError && (
                <p className="text-[10px] text-hearth-amber font-mono">
                  ⚠️ {incentiveError}
                </p>
              )}

              {/* Secondary assurances disclaimer */}
              <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>NO CORRUPTED PROTOCOLS // VERIFIED GAME SPARK SIGN UP</span>
              </div>
            </motion.div>
          </section>

          {/* Social Community engagement footer block */}
          <section id="community" className="scroll-mt-24 max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-neutral-900 w-full bg-void">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="text-2xl font-display font-black tracking-tight text-white uppercase glow-text-subtle">
                Emberfault Tunnels
              </h4>
              <p className="max-w-md text-xs sm:text-sm text-zinc-500 leading-relaxed font-sans">
                Interact directly with me, exchange customized templates, and influence weapon balancing parameters inside my closed Discord tunnels.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
              <a 
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                onMouseEnter={playHover}
                className="py-3 px-8 bg-hearth-gold hover:bg-hearth-amber font-mono font-bold text-xs uppercase tracking-wider text-black text-center rounded-sm transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.2)] hover:shadow-[0_0_25px_rgba(250,204,21,0.4)] active:scale-95 cursor-pointer flex justify-center gap-2 items-center whitespace-nowrap glow-hearth border border-transparent"
              >
                <MessageSquare className="w-4 h-4 fill-black text-black" /> Enter Discord
              </a>
            </div>
          </section>
        </main>
      )}

      {/* Simple and Clean Footer */}
      <footer className="border-t border-neutral-900 bg-[#060608] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Logo element */}
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Emberfault Logo" 
              className="h-6 w-auto object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              onMouseEnter={playHover}
              className="p-2 border border-neutral-850 bg-void rounded-sm text-zinc-500 hover:text-white hover:border-zinc-700 transition"
              title="Discord"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              onMouseEnter={playHover}
              className="p-2 border border-neutral-850 bg-void rounded-sm text-zinc-500 hover:text-white hover:border-zinc-700 transition"
              title="X / Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              onMouseEnter={playHover}
              className="p-2 border border-neutral-850 bg-void rounded-sm text-zinc-500 hover:text-white hover:border-zinc-700 transition"
              title="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright details */}
          <p className="text-[10px] font-mono text-zinc-500">
            &copy; Emberfault. All rights voxelated.
          </p>
        </div>
      </footer>

      {/* Overlay Modals mapping */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
      />

      <WishlistModal
        isOpen={modalType !== null}
        type={modalType || "wishlist"}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}
export { App as VoxelHearthLanding };
