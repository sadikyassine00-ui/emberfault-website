import { useState } from "react";
import { Flame, Gamepad, Menu, X } from "lucide-react";
import { useUIAudio } from "../hooks/useUIAudio";

interface NavbarProps {
  onWishlistClick: () => void;
}

export function Navbar({ onWishlistClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { playHover, playClick } = useUIAudio();

  const handleLinkClick = () => {
    playClick();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-void/90 backdrop-blur-md border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#" 
          onClick={handleLinkClick}
          onMouseEnter={playHover}
          className="flex items-center group cursor-pointer h-14 md:h-16"
        >
          <img 
            src="/logo.png" 
            alt="Emberfault Logo" 
            className="h-full w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" 
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-8 font-mono text-xs text-zinc-400">
          <a
            href="#features"
            onClick={handleLinkClick}
            onMouseEnter={playHover}
            className="hover:text-hearth-gold transition"
          >
            // FEATURES
          </a>
          <a
            href="#gallery"
            onClick={handleLinkClick}
            onMouseEnter={playHover}
            className="hover:text-hearth-amber transition"
          >
            // GALLERY
          </a>
          <a
            href="#shredder"
            onClick={handleLinkClick}
            onMouseEnter={playHover}
            className="hover:text-swarm-purple transition"
          >
            // SANDBOX
          </a>
          <a
            href="#community"
            onClick={handleLinkClick}
            onMouseEnter={playHover}
            className="hover:text-zinc-200 transition"
          >
            // COMMUNITY
          </a>
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => {
              playClick();
              onWishlistClick();
            }}
            onMouseEnter={playHover}
            className="relative py-2 px-4 bg-hearth-gold hover:bg-hearth-amber font-mono font-bold text-xs uppercase tracking-wider text-black rounded-sm transition animate-breathe-glow active:scale-95 flex items-center gap-2 glow-hearth shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:shadow-[0_0_25px_rgba(250,204,21,0.8)] group"
          >
            <div className="relative flex items-center justify-center">
              <Gamepad className="w-4 h-4 group-hover:animate-pulse" strokeWidth={2.5} />
            </div>
            <span>Wishlist Now</span>
          </button>
        </div>

        {/* Mobile Hamburger toggle controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => {
              playClick();
              setIsOpen(!isOpen);
            }}
            onMouseEnter={playHover}
            className="p-2 border border-neutral-850 hover:border-neutral-700 bg-void rounded-sm text-zinc-300 transition"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown menu */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-900 bg-void/95 backdrop-blur-lg px-6 py-4 flex flex-col gap-4">
          <nav className="flex flex-col gap-3 font-mono text-xs text-zinc-400">
            <a
              href="#features"
              onClick={handleLinkClick}
              className="py-2 hover:text-hearth-gold border-b border-neutral-950 transition"
            >
              // FEATURES
            </a>
            <a
              href="#gallery"
              onClick={handleLinkClick}
              className="py-2 hover:text-hearth-amber border-b border-neutral-950 transition"
            >
              // GALLERY
            </a>
            <a
              href="#shredder"
              onClick={handleLinkClick}
              className="py-2 hover:text-swarm-purple border-b border-neutral-950 transition"
            >
              // SANDBOX
            </a>
            <a
              href="#community"
              onClick={handleLinkClick}
              className="py-2 hover:text-zinc-200 border-b border-neutral-950 transition"
            >
              // COMMUNITY
            </a>
          </nav>

          <button
            onClick={() => {
              playClick();
              setIsOpen(false);
              onWishlistClick();
            }}
            onMouseEnter={playHover}
            className="w-full relative py-2.5 px-4 bg-hearth-gold hover:bg-hearth-amber font-mono font-bold text-xs uppercase tracking-wider text-black rounded-sm transition animate-breathe-glow flex items-center justify-center gap-2 glow-hearth shadow-[0_0_15px_rgba(250,204,21,0.5)]"
          >
            <div className="relative flex items-center justify-center">
              <Gamepad className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <span>Wishlist Now</span>
          </button>
        </div>
      )}
    </header>
  );
}
