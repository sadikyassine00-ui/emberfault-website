import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Mail, Gamepad, Radio, HelpCircle } from "lucide-react";
import { WishlistSubmission } from "../types";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "alpha" | "wishlist";
}

export function WishlistModal({ isOpen, onClose, type }: WishlistModalProps) {
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState<"steam" | "epic" | "gog">("steam");
  const [newsletter, setNewsletter] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const listKey = type === "alpha" ? "voxel_hearth_alpha" : "voxel_hearth_wishlist";
  const submissions: WishlistSubmission[] = JSON.parse(localStorage.getItem(listKey) || "[]");
  const currentCount = 4562 + submissions.length;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please input a valid email address.");
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Invalid email format.");
      return;
    }

    setError("");
    
    try {
      await addDoc(collection(db, "leads"), {
        email: email.trim(),
        platform: platform,
        subscribedToNewsletter: newsletter,
        date: new Date().toISOString(),
        source: type === "alpha" ? "Wishlist Modal Alpha" : "Wishlist Modal",
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Network error. Could not connect to HQ.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop glass */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-void/90 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-bedrock rounded-sm border border-neutral-800 shadow-[0_0_40px_rgba(157,0,255,0.15)] flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-900 bg-[#121215]">
            <div className="flex items-center gap-3">
              <h3 className="font-display font-black text-white hover:text-hearth-gold tracking-wider text-sm uppercase">
                {type === "alpha" ? "JOIN THE TESTING RUN" : "REGISTER WISHLIST"}
              </h3>
              {type === "wishlist" && (
                <span className="font-mono text-[10px] bg-hearth-gold/10 text-hearth-gold border border-hearth-gold/30 px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <Gamepad className="w-3 h-3" />
                  {currentCount.toLocaleString()}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-xs font-mono border border-neutral-800 bg-void hover:bg-neutral-800 rounded-sm text-zinc-400 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                {type === "alpha" 
                  ? "Receive instructions to join the upcoming private matches. Enter, play, break support structures, and help steer gameplay balancing."
                  : "Save your slot to retrieve dynamic early whistleblower perks, custom glowing player characters, and server launch codes."}
              </p>

              {/* Email Input */}
              <div className="space-y-1.5 animate-pulse-ring/5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                  <input
                    type="email"
                    placeholder="explorer@voxelhearth.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-neutral-800 focus:border-hearth-gold text-zinc-100 text-xs py-2 px-3 pl-10 rounded-sm font-mono outline-none transition"
                  />
                </div>
              </div>

              {/* Target Platform Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Select Target Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["steam", "epic", "gog"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={`py-2 px-3 border rounded-sm font-mono text-[10px] uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                        platform === p
                          ? "bg-swarm-purple/10 border-swarm-purple text-swarm-purple shadow-[0_0_10px_rgba(157,0,255,0.1)]"
                          : "bg-void border-neutral-800 text-zinc-500 hover:text-zinc-300 hover:border-neutral-700"
                      }`}
                    >
                      <Gamepad className="w-4 h-4" />
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Opt-in */}
              <label className="flex items-start gap-2.5 cursor-pointer text-zinc-400 select-none">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="mt-0.5 rounded-xs border-neutral-800 text-hearth-gold bg-void focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] font-mono leading-tight">
                  I wish to enlist in tactical dispatch correspondence (Devlogs, Beta Alerts, Lore updates)
                </span>
              </label>

              {error && (
                <span className="text-[10px] font-mono text-hearth-gold bg-hearth-gold/10 border border-hearth-gold/20 p-2 rounded-sm uppercase tracking-wider">
                  ⚠️ {error}
                </span>
              )}

              {/* CTA Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-hearth-gold hover:bg-hearth-amber font-mono font-bold text-xs uppercase tracking-widest text-black rounded-sm transition glow-hearth shadow-lg border border-transparent active:scale-98 cursor-pointer"
              >
                {type === "alpha" ? "Request Access Code" : "Register Priority Slot"}
              </button>
            </form>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-5">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500 rounded-sm flex items-center justify-center text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)] animate-float">
                <Check className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-display font-black text-white uppercase tracking-wider text-lg mb-1">
                  SECURED PRE-SLOT
                </h4>
                <p className="font-mono text-zinc-500 text-[10px]">
                  CONNECTION STATUS: ACTIVE
                </p>
              </div>

              <p className="text-xs text-zinc-400 font-mono leading-relaxed bg-void/50 border border-neutral-900 p-4 rounded-sm">
                Congratulations. A synchronization code has been locked to <strong className="text-zinc-200">{email}</strong>. Launch parameters are being compiled. Stay calibrated.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 font-mono text-xs uppercase text-zinc-300 rounded-sm transition border border-neutral-850"
              >
                Return to Core
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
