export interface DevlogFile {
  id: string;
  filename: string;
  title: string;
  date: string;
  language: "gdscript" | "shader" | "markdown";
  category: "Engine" | "AI" | "Graphics";
  content: string;
  summary: string;
}

export interface WishlistSubmission {
  email: string;
  platform: "steam" | "epic" | "gog";
  subscribedToNewsletter: boolean;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface GalleryEntry {
  id: string;
  url?: string;
  proceduralId?: string;
  title: string;
  subtitle: string;
  description: string;
  category: "Combat" | "Destruction" | "Atmosphere";
}

export interface GridBlock {
  id: string;
  x: number;
  y: number;
  color: string;
  maxHp: number;
  hp: number;
  isEmissive: boolean;
  isBuilt?: boolean;
}
