import React from "react";
import { Lock, ShieldAlert, ArrowRight, User, LogOut } from "lucide-react";
import { useUIAudio } from "../hooks/useUIAudio";
import { motion } from "motion/react";
import { useAuth } from "../lib/contexts/AuthContext";

interface LoginWrapperProps {
  children: React.ReactNode;
}

export function LoginWrapper({ children }: LoginWrapperProps) {
  const { playHover, playClick } = useUIAudio();
  const { user, loading, signInWithGoogle, logout } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    await signInWithGoogle();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-6 text-zinc-300 font-mono font-bold tracking-widest uppercase">
        <div className="animate-pulse">INITIALIZING SECURE CONNECTION...</div>
      </div>
    );
  }

  if (user) {
    const isAuthorized = user.email === "yassinesadik0@gmail.com";
    
    if (!isAuthorized) {
      return (
        <div className="min-h-[100vh] bg-void flex items-center justify-center p-6 text-zinc-300 font-mono relative overflow-hidden">
          {/* Background noise and grid */}
          <div className="absolute inset-0 bg-[#070709] bg-[radial-gradient(#18181c_1px,transparent_1px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-900/10 rounded-full filter blur-[100px] pointer-events-none z-0" />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative z-10 w-full max-w-md bg-bedrock border border-neutral-800 rounded-sm p-8 shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-red-950/30 border border-red-900/50 rounded-sm flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-2 mb-8 border-b border-neutral-850 pb-6">
              <h2 className="text-xl font-display font-black text-white tracking-widest uppercase">
                ACCESS REVOKED
              </h2>
              <p className="text-xs text-red-500 font-bold uppercase tracking-wider">
                UNAUTHORIZED OPERATOR
              </p>
              <p className="text-zinc-550 text-xs text-zinc-450 leading-relaxed pt-3">
                Operator credentials at <span className="text-zinc-300 font-bold">{user.email}</span> lack appropriate privileges to command the EMBERFAULT main uplink terminal. Only designated personnel may enter.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={async () => {
                  playClick();
                  await logout();
                }}
                onMouseEnter={playHover}
                className="w-full py-4 bg-red-950/40 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/50 hover:border-red-600 font-bold text-[10px] uppercase tracking-widest rounded-sm transition flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span>TERMINATE ACTIVE SESSION</span>
              </button>
            </div>
          </motion.div>
        </div>
      );
    }
    
    return <>{children}</>;
  }

  return (
    <div className="min-h-[100vh] bg-void flex items-center justify-center p-6 text-zinc-300 font-mono relative overflow-hidden">
      {/* Background noise and grid */}
      <div className="absolute inset-0 bg-[#070709] bg-[radial-gradient(#18181c_1px,transparent_1px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-900/10 rounded-full filter blur-[100px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-sm bg-bedrock border border-neutral-800 rounded-sm p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-red-950/30 border border-red-900/50 rounded-sm flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
        </div>

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-xl font-display font-black text-white tracking-widest uppercase">
            RESTRICTED ACCESS
          </h2>
          <p className="text-xs text-zinc-500">
            HQ ADMIN COMMAND TERMINAL
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            onMouseEnter={playHover}
            className="w-full py-4 bg-zinc-100 hover:bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded-sm transition flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <User className="w-4 h-4" />
            <span>AUTHENTICATE VIA OAUTH</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
