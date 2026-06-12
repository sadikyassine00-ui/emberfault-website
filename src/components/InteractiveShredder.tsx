import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { RotateCcw, Flame, Sparkles, Box } from "lucide-react";
import { GridBlock, Particle } from "../types";
import { useUIAudio } from "../hooks/useUIAudio";

export function InteractiveShredder() {
  const { playHover, playClick, playExplosion, playBuild, playDestroy, playGoldenDestroy } = useUIAudio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<"bomb" | "build">("build");
  const [stats, setStats] = useState({ blocksDestroyed: 0, particlesShredded: 0, blocksBuilt: 0 });
  const [shakeClass, setShakeClass] = useState("");

  const triggerCameraShake = (level: "light" | "heavy") => {
    setShakeClass("");
    setTimeout(() => {
      setShakeClass(level === "heavy" ? "animate-shake-heavy" : "animate-shake-light");
    }, 10);
  };

  // Canvas state references to avoid stale closures in requestAnimationFrame
  const blocksRef = useRef<GridBlock[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const isMouseDownRef = useRef<boolean>(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const embersRef = useRef<{x: number; y: number; speed: number; size: number; alpha: number}[]>(Array.from({ length: 40 }).map(() => ({
    x: Math.random() * 800,
    y: Math.random() * 600,
    speed: Math.random() * 0.5 + 0.1,
    size: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.5 + 0.1
  })));

  // Grid dimensions
  const cols = 20;
  const rows = 12;
  const blockSize = 24;
  const padding = 2;
  const gridWidth = cols * (blockSize + padding);
  const gridHeight = rows * (blockSize + padding);

  const initGrid = () => {
    const arr: GridBlock[] = [];
    const colors = ["#1a0b2e", "#2d1b4e", "#3b236d", "#4c2882"]; // Corrupted purples
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Create an organic cave shape with a hollow center
        const distanceToCenter = Math.sqrt(
          Math.pow(c - cols / 2, 2) + Math.pow(r - rows / 2, 2)
        );
        
        let hp = 0;
        let isEmissive = false;
        
        // Hollow center for building (no blocks in middle)
        if (distanceToCenter > 4.5 || r > rows - 3 || r < 2) {
           isEmissive = distanceToCenter < 8 && distanceToCenter >= 4.5 && Math.random() > 0.6;
           hp = isEmissive ? 1 : Math.floor(Math.random() * 2) + 1;
           // Add some noise / holes in the cavern walls
           if (Math.random() > 0.85 && r > 2 && r < rows - 2) hp = 0; 
        }

        const color = isEmissive
          ? Math.random() > 0.5
            ? "#ffd700" // Gold
            : "#facc15" // Amber
          : colors[Math.floor(Math.random() * 3)]; // Rock grays

        arr.push({
          id: `${r}-${c}`,
          x: c * (blockSize + padding),
          y: r * (blockSize + padding),
          color,
          maxHp: hp > 0 ? hp : 1, // Store maxHp correctly even if empty initially
          hp: hp,
          isEmissive,
        });
      }
    }
    blocksRef.current = arr;
    particlesRef.current = [];
  };

  const applyStructuralIntegrity = () => {
    const blocks = blocksRef.current;
    if (blocks.length === 0) return;

    const supported = new Array(blocks.length).fill(false);
    const queue: number[] = [];

    // Find anchors (bottom, left, right rows, and top row)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const block = blocks[idx];
        if (block && block.hp > 0) {
           if (r === rows - 1 || c === 0 || c === cols - 1 || r === 0 || block.isBuilt) {
              supported[idx] = true;
              queue.push(idx);
           }
        }
      }
    }

    // BFS for connected components to ground/anchors
    while (queue.length > 0) {
      const idx = queue.shift()!;
      const r = Math.floor(idx / cols);
      const c = idx % cols;

      const neighbors = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ];

      for (const [nr, nc] of neighbors) {
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const nIdx = nr * cols + nc;
          if (!supported[nIdx] && blocks[nIdx].hp > 0) {
            supported[nIdx] = true;
            queue.push(nIdx);
          }
        }
      }
    }

    let collapsedCount = 0;
    let changed = false;
    const newBlocks = [...blocks];

    for (let i = 0; i < newBlocks.length; i++) {
        const block = newBlocks[i];
        if (block.hp > 0 && !supported[i]) {
            // Visualizer: Turn unsupported blocks red to show structural failure (stress zones)
            if (block.color !== "#ef4444") {
                newBlocks[i] = { ...block, color: "#ef4444", isEmissive: false };
                changed = true;
            }
            
            // Cascading crumble chain reaction
            if (Math.random() < 0.15) {
                collapsedCount++;
                createExplosion(block.x + blockSize / 2, block.y + blockSize / 2, 5, false);
                newBlocks[i] = { ...newBlocks[i], hp: 0 };
                changed = true;
            }
        }
    }

    if (changed) {
        blocksRef.current = newBlocks;
    }
    if (collapsedCount > 0) {
        setStats((prev) => ({
            ...prev,
            blocksDestroyed: prev.blocksDestroyed + collapsedCount,
        }));
    }
  };

  // Initialize grid once on mount
  useEffect(() => {
    initGrid();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Clear with dark void color (#0a0a0c)
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw faint background tech grid
      ctx.strokeStyle = "rgba(63, 63, 70, 0.15)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw floating background embers
      embersRef.current.forEach((ember) => {
        ember.y -= ember.speed;
        ember.x += Math.sin(ember.y * 0.05) * 0.2;
        if (ember.y < -10) {
            ember.y = canvas.height + 10;
            ember.x = Math.random() * canvas.width;
        }
        
        ctx.fillStyle = `rgba(250, 204, 21, ${ember.alpha})`;
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Mouse cursor interactive ambient light
      const cx = mousePosRef.current.x;
      const cy = mousePosRef.current.y;
      if (cx > 0 && cy > 0) {
          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
          gradient.addColorStop(0, "rgba(250, 204, 21, 0.06)");
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.fillRect(cx - 120, cy - 120, 240, 240);
      }

      // Draw Blocks
      const blocks = blocksRef.current;
      blocks.forEach((block) => {
        if (block.hp <= 0) return;

        const hpRatio = block.hp / block.maxHp;

        const mx = mousePosRef.current.x;
        const my = mousePosRef.current.y;
        
        let drawX = block.x;
        let drawY = block.y;
        let drawSize = blockSize;
        let force = 0;

        // Apply interactive magnetic repulsion
        if (tool === "bomb" && mx > 0 && my > 0) {
            const bcx = block.x + blockSize / 2;
            const bcy = block.y + blockSize / 2;
            const dist = Math.sqrt(Math.pow(bcx - mx, 2) + Math.pow(bcy - my, 2));
            const maxDist = 96;
            if (dist < maxDist) {
                force = Math.pow((maxDist - dist) / maxDist, 1.5); // Easing
                const angle = Math.atan2(bcy - my, bcx - mx);
                drawX += Math.cos(angle) * force * 12; // Push outward
                drawY += Math.sin(angle) * force * 12;
                drawSize -= force * 4; // Shrink slightly
                drawX += (blockSize - drawSize) / 2; // Keep centered
                drawY += (blockSize - drawSize) / 2;
            }
        }

        const isHovered = mx >= block.x && mx <= block.x + blockSize && my >= block.y && my <= block.y + blockSize;

        if (block.isEmissive) {
          ctx.shadowBlur = 12 + force * 10;
          ctx.shadowColor = block.color;
        } else if (isHovered || force > 0.5) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#facc15";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = block.color;
        ctx.fillRect(drawX, drawY, drawSize, drawSize);

        // Block highlight / edge
        if (isHovered) {
          ctx.strokeStyle = "#ffd700";
          ctx.lineWidth = 2.5;
        } else {
          ctx.strokeStyle = block.isEmissive ? "#fff" : `rgba(255, 255, 255, ${0.1 + force * 0.4})`;
          ctx.lineWidth = 1.5;
        }
        ctx.strokeRect(drawX, drawY, drawSize, drawSize);

        // Cracks if damaged
        if (hpRatio < 1 && hpRatio > 0) {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(block.x + 4, block.y + 4);
          ctx.lineTo(block.x + blockSize - 4, block.y + blockSize - 4);
          ctx.moveTo(block.x + blockSize - 4, block.y + 4);
          ctx.lineTo(block.x + 4, block.y + blockSize - 4);
          ctx.stroke();
        }

        // Reset shadow
        ctx.shadowBlur = 0;
      });

      // Update and Draw Particles
      const particles = particlesRef.current;
      particlesRef.current = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.vx *= 0.98; // air resistance

        // Floor collision bounce
        if (p.y > canvas.height - 2) {
          p.y = canvas.height - 2;
          p.vy *= -0.6; // bounce
          p.vx *= 0.8;  // extra friction on ground
        }

        p.life -= 1;

        if (p.life <= 0) return false;

        const alpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.color.startsWith("#ff") ? 8 : 0;
        ctx.shadowColor = p.color;

        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;

        return true;
      });

      // Continuous interactions if mouse down
      if (isMouseDownRef.current) {
        if (tool === "build") buildAtMouse(16);
      }

      applyStructuralIntegrity();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [tool]);

  const createExplosion = (startX: number, startY: number, count = 20, isHearth = false) => {
    const newParticles: Particle[] = [];
    const particleColors = isHearth ? ["#facc15", "#fef08a", "#eab308", "#ffffff"] : ["#4c2882", "#3b236d", "#2d1b4e", "#3f3f46"]; // Purple and gold primitive cubes

    // Burst of 4-5 particles for standard debris, more for hearth explosions
    const burstCount = isHearth ? count * 2 : 4 + Math.floor(Math.random() * 2);

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      const size = Math.random() * 5 + 3; // a bit larger for prominent "primitive cubes"
      newParticles.push({
        id: Math.random() + i,
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // burst slightly upwards
        size,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        life: Math.floor(Math.random() * 30) + 20, // fade out quickly as requested
        maxLife: 50,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
    setStats((prev) => ({
      ...prev,
      particlesShredded: prev.particlesShredded + count,
    }));
  };

  const buildAtMouse = (radius: number) => {
    const mx = mousePosRef.current.x;
    const my = mousePosRef.current.y;
    let builtThisFrame = 0;

    blocksRef.current = blocksRef.current.map((block) => {
      const blockCenterX = block.x + blockSize / 2;
      const blockCenterY = block.y + blockSize / 2;
      const dist = Math.sqrt(Math.pow(blockCenterX - mx, 2) + Math.pow(blockCenterY - my, 2));

      if (dist <= radius && block.hp <= 0) {
        const isGolden = Math.random() < 0.05;
        builtThisFrame++;
        return { 
          ...block, 
          hp: 2, 
          maxHp: 2, 
          color: isGolden ? "#facc15" : "#3b236d", // Standard constructed wall or golden
          isEmissive: isGolden,
          isBuilt: true
        };
      }
      return block;
    });

    if (builtThisFrame > 0) {
      if (builtThisFrame > 1) {
        // limit audio spam
        if (Math.random() > 0.8) playBuild();
      } else {
        playBuild();
      }
      setStats((prev) => ({
        ...prev,
        blocksBuilt: prev.blocksBuilt + builtThisFrame,
      }));
    }
  }



  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Support pointer event types (includes touch and mouse)
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Scale coordinates properly considering CSS vs logical canvas resolution
    // Handles device pixel ratios and responsive flex scaling precisely
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent accidental scroll/pan on touch
    if (!canvasRef.current) return;
    canvasRef.current.setPointerCapture(e.pointerId);

    const pos = getPointerPos(e);
    mousePosRef.current = pos;
    isMouseDownRef.current = true;

    if (tool === "bomb") {
      triggerBomb(pos.x, pos.y);
    } else if (tool === "build") {
      buildAtMouse(16);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getPointerPos(e);
    mousePosRef.current = pos;
  };

  const handlePointerUpOrLeave = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (canvasRef.current && canvasRef.current.hasPointerCapture(e.pointerId)) {
        canvasRef.current.releasePointerCapture(e.pointerId);
    }
    isMouseDownRef.current = false;
  };

  const triggerBomb = (x: number, y: number) => {
    // Large explosion radius
    const radius = 64;
    let destroyed = 0;
    let destroyedGolden = false;

    blocksRef.current = blocksRef.current.map((block) => {
      if (block.hp <= 0) return block;

      const blockCenterX = block.x + blockSize / 2;
      const blockCenterY = block.y + blockSize / 2;
      const dist = Math.sqrt(Math.pow(blockCenterX - x, 2) + Math.pow(blockCenterY - y, 2));

      if (dist <= radius) {
        if (block.isEmissive) destroyedGolden = true;
        destroyed++;
        createExplosion(blockCenterX, blockCenterY, 6, block.isEmissive);
        return { ...block, hp: 0 };
      }
      return block;
    });

    // Epic bomb center ring of particles
    if (destroyedGolden) {
      createExplosion(x, y, 60, true);
      playGoldenDestroy();
    } else {
      createExplosion(x, y, 40, false);
      playExplosion();
    }
    triggerCameraShake("heavy");

    setStats((prev) => ({
      ...prev,
      blocksDestroyed: prev.blocksDestroyed + destroyed,
    }));
  };

  return (
    <div className={`w-full bg-bedrock rounded-sm border border-neutral-800 p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden ${shakeClass}`}>
      {/* Decorative tech pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-hearth-gold/10 to-transparent pointer-events-none" />

      {/* Main Sandbox Interactive Block */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h4 className="text-sm font-mono uppercase tracking-wider text-hearth-amber mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Live Interactive Sandbox
        </h4>
        <div className="relative border border-neutral-700 bg-void p-1 rounded-sm glow-hearth/5">
          <canvas
            ref={canvasRef}
            width={gridWidth}
            height={gridHeight}
            className="block w-full max-w-[520px] aspect-[520/312] touch-none select-none"
             style={{ 
              cursor: tool === "build"
                ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%23a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>') 16 16, crosshair`
                : `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-4 -4 32 32" fill="none" stroke="%23fef08a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0px%200px%208px%20%23fef08a)%20drop-shadow(0px%200px%2012px%20rgba(254,240,138,0.6))"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>') 16 16, crosshair`
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
            onPointerCancel={handlePointerUpOrLeave}
          />
        </div>
        <p className="text-[11px] font-mono text-zinc-500 mt-3 text-center px-4">
          {tool === "bomb"
            ? "CLICK ANYWHERE to trigger a high-yield controlled demolition."
            : "DRAG MOUSE over empty space to construct defensive walls."}
        </p>
      </div>

      {/* Controls & Statistics Console */}
      <div className="w-full md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-800 pt-6 md:pt-0 md:pl-6">
        <div>
          <h3 className="text-zinc-100 font-display font-bold text-lg uppercase tracking-tight mb-1">
            Tactical Editor
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            A core mechanic of Emberfault. Build fortresses or shatter the terrain to survive incoming swarms.
          </p>

          {/* Tool Selection */}
          <div className="space-y-2 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
              Active Tool
            </span>
            <button
              onClick={() => {
                playClick();
                setTool("build");
              }}
              onMouseEnter={playHover}
              className={`w-full py-2 px-3 text-xs font-mono rounded-sm flex items-center gap-3 border transition-all cursor-pointer ${
                tool === "build"
                  ? "bg-zinc-700/40 text-zinc-200 border-zinc-500 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  : "bg-void text-zinc-400 border-neutral-800 hover:text-zinc-200 hover:border-neutral-700"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Construct Wall</span>
            </button>
            <button
              onClick={() => {
                playClick();
                setTool("bomb");
              }}
              onMouseEnter={playHover}
              className={`w-full py-2 px-3 text-xs font-mono rounded-sm flex items-center gap-3 border transition-all cursor-pointer ${
                tool === "bomb"
                  ? "bg-hearth-amber/20 text-hearth-amber border-hearth-amber shadow-[0_0_10px_rgba(250,204,21,0.15)]"
                  : "bg-void text-zinc-400 border-neutral-800 hover:text-zinc-200 hover:border-neutral-700"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Demolition Mine</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Console */}
        <div className="space-y-4">
          <div className="bg-void/80 border border-neutral-950 p-3 rounded-sm font-mono text-xs">
            <span className="text-[9px] uppercase text-zinc-500 block mb-1">
              Engine Diagnostics
            </span>
            <div className="flex justify-between py-1 border-b border-neutral-900/40">
              <span className="text-zinc-400">Blocks Built:</span>
              <span className="text-zinc-100 font-bold">{stats.blocksBuilt}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-900/40">
              <span className="text-zinc-400">Blocks Shattered:</span>
              <span className="text-hearth-gold font-bold">{stats.blocksDestroyed}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Physics Elements:</span>
              <span className="text-hearth-amber font-bold">{stats.particlesShredded}</span>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              playBuild();
              initGrid();
            }}
            onMouseEnter={playHover}
            className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono rounded-sm text-zinc-300 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Map Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
