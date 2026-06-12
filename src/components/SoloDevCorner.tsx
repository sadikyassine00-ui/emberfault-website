import { Heart, Code2 } from "lucide-react";
import { motion } from "motion/react";

export function SoloDevCorner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <div className="bg-gradient-to-br from-[#0c0a00]/80 via-void to-void border border-hearth-gold/20 rounded-sm p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden group hover:border-hearth-gold/40 hover:shadow-[0_0_40px_rgba(250,204,21,0.08)] transition-all duration-500">
        
        {/* Subtle grid background, tinted gold */}
        <div className="absolute inset-0 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-500" />
        
        {/* Ambient Corner Glows */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-hearth-gold/10 rounded-full filter blur-[80px] pointer-events-none transition-opacity duration-500 group-hover:bg-hearth-gold/20" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-hearth-amber/5 rounded-full filter blur-[80px] pointer-events-none" />
        
        {/* Thick Accent strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-hearth-gold via-hearth-amber to-transparent shadow-[0_0_15px_rgba(250,204,21,0.5)] group-hover:w-2 transition-all duration-300" />

        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-hearth-gold/10 border border-hearth-gold/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.15)] relative z-10 group-hover:bg-hearth-gold/20 group-hover:border-hearth-gold group-hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] transition-all duration-500">
          <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-hearth-gold group-hover:scale-110 transition-transform duration-300" />
        </div>

        <div className="flex-1 relative z-10 text-center md:text-left space-y-3">
          <h3 className="text-sm font-display font-black tracking-widest uppercase flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3">
            <span className="bg-gradient-to-r from-hearth-gold to-[#fef08a] bg-clip-text text-transparent text-base sm:text-lg">BEHIND THE ENGINE</span>
            <span className="hidden md:inline text-hearth-gold/30">|</span>
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-400 font-mono tracking-wide">
              Forged with <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 fill-red-500 group-hover:animate-pulse shadow-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" /> in the engine room
            </span>
          </h3>
          
          <div className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed max-w-2xl mx-auto md:mx-0 space-y-3">
            <p>Emberfault is a solo project built from the ground up by a single developer. Because there is no big studio backing this, every single wishlist makes a massive difference.</p>
            <p>A little bit of support goes a long way here. Grab your hammer, hit the Wishlist button, and help an independent project break through the algorithm.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
