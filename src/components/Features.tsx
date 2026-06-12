import { ReactNode } from "react";
import { Pickaxe, Skull, Flame, Shield, Award, Terminal } from "lucide-react";
import { motion } from "motion/react";

interface FeatureCardProps {
  key?: string;
  title: string;
  sub: string;
  desc: string;
  techDesc: string;
  icon: ReactNode;
  emissiveStyles: string;
  borderColor: string;
}

function FeatureCard({ title, sub, desc, techDesc, icon, emissiveStyles, borderColor }: FeatureCardProps) {
  return (
    <div className={`h-full relative bg-bedrock rounded-sm p-6 border-2 ${borderColor} transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between group overflow-hidden`}>
      {/* Dynamic diagonal background wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none group-hover:from-white/[0.03] transition-all" />

      <div>
        {/* Animated Icon Box */}
        <div className={`w-10 h-10 rounded-sm mb-4 flex items-center justify-center transition-transform group-hover:scale-105 ${emissiveStyles}`}>
          {icon}
        </div>

        {/* Feature Title */}
        <h4 className="text-xl font-display font-black tracking-tight text-white mb-1 uppercase group-hover:text-zinc-200 transition">
          {title}
        </h4>
        <p className="text-xs font-mono tracking-wide text-zinc-500 uppercase mb-3">
          {sub}
        </p>
        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
          {desc}
        </p>
      </div>

      {/* Tech Spec Box */}
      <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center gap-2 font-mono text-[10px] text-zinc-500">
        <Terminal className="w-3.5 h-3.5 text-zinc-600 group-hover:text-hearth-amber transition" />
        <span className="group-hover:text-zinc-400 transition">{techDesc}</span>
      </div>
    </div>
  );
}

export function Features() {
  const featList = [
    {
      title: "Kinetic Voxel Destruction",
      sub: "Physical Excavation",
      desc: "Every swing matters. Deform the earth in real-time to create deep craters and watch massive enemy swarms crumble into the abyss. This isn't building—it’s pure, satisfying destruction.",
      techDesc: "Shape the cave to build choke points",
      borderColor: "border-neutral-900 hover:border-hearth-gold/40",
      emissiveStyles: "bg-hearth-gold/10 border border-hearth-gold/30 text-hearth-gold glow-hearth/40",
      icon: <Pickaxe className="w-5 h-5" />,
    },
    {
      title: "Choke-Point Warfare",
      sub: "Tactical Redirection",
      desc: "You don't just fight the horde; you control them. Shatter narrow land bridges, dig tactical trenches, and force dense enemy waves into tight ravines to maximize your explosive damage.",
      techDesc: "Face thousands of coordinated predators",
      borderColor: "border-neutral-900 hover:border-swarm-purple/40",
      emissiveStyles: "bg-swarm-purple/10 border border-swarm-purple/30 text-swarm-purple glow-swarm/40",
      icon: <Skull className="w-5 h-5" />,
    },
    {
      title: "Maximum Chaos. Zero Lag.",
      sub: "Flawless Performance",
      desc: "Built from the ground up to run like absolute butter on almost any PC. Experience massive, screen-filling hordes and spectacular physics-based destruction without your frame rate ever taking a hit. All action, zero compromise.",
      techDesc: "Illuminate pitch-black tactical fields",
      borderColor: "border-neutral-900 hover:border-hearth-amber/40",
      emissiveStyles: "bg-hearth-amber/10 border border-hearth-amber/30 text-hearth-amber glow-hearth/40",
      icon: <Flame className="w-5 h-5 animate-pulse" />,
    },
  ];

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
            <span className="font-mono text-xs text-hearth-amber uppercase tracking-widest font-bold">TACTICAL ACTION REVOLUTION</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white uppercase leading-none">
            USE LANDSCAPES AS WEAPONS
          </h3>
        </div>
        <p className="max-w-md text-xs text-zinc-400 font-mono leading-relaxed border-l-2 border-neutral-800 pl-4">
          Built bottom-up for fully destructive tactics. Shatter, breach, and collapse surrounding terrain to dominate high-tension swarms. Your geological footprint stays etched on the grid.
        </p>
      </motion.div>

      {/* 3-Column Features Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featList.map((feat) => (
          <motion.div variants={itemVariants} key={feat.title}>
            <FeatureCard
              title={feat.title}
              sub={feat.sub}
              desc={feat.desc}
              techDesc={feat.techDesc}
              icon={feat.icon}
              emissiveStyles={feat.emissiveStyles}
              borderColor={feat.borderColor}
            />
          </motion.div>
        ))}
      </div>

      {/* Secondary Quick Specs bar */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-bedrock/40 p-4 border border-neutral-900 font-mono text-xs text-center">
        <div className="flex items-center justify-center gap-2.5">
          <Shield className="w-4 h-4 text-hearth-gold" />
          <span className="text-zinc-400"><strong className="text-zinc-200">Responsive</strong> Real-time Controls</span>
        </div>
        <div className="flex items-center justify-center gap-2.5 border-t sm:border-t-0 sm:border-x border-neutral-950 py-3 sm:py-0">
          <Award className="w-4 h-4 text-swarm-purple" />
          <span className="text-zinc-400"><strong className="text-zinc-200">Intense</strong> Destruction Debris</span>
        </div>
        <div className="flex items-center justify-center gap-2.5">
          <Terminal className="w-4 h-4 text-hearth-amber" />
          <span className="text-zinc-400"><strong className="text-zinc-200">Breathtaking</strong> Cavern Atmosphere</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
