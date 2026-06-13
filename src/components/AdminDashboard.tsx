import { useState, useEffect } from "react";
import { Download, Search, RefreshCw, Layers, Mail, Calendar, Server, Trash2, ArrowLeft, TrendingUp, Users, CheckSquare, Edit2, LogOut, Eye } from "lucide-react";
import { useUIAudio } from "../hooks/useUIAudio";
import { useAuth } from "../lib/contexts/AuthContext";
import { collection, getDocs, doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface LeadRecord {
  id: string;
  email: string;
  date: string;
  source: string;
  platform: string;
}

// Seamless mock seed data for demonstration
const SEED_RECORDS: LeadRecord[] = [
  { id: "lead-1", email: "yassinesadik0@gmail.com", date: "2026-06-08T11:24:00Z", source: "Hero Direct Hook", platform: "PC // STEAM" },
  { id: "lead-2", email: "gamedev_sam@gmail.com", date: "2026-06-08T10:15:32Z", source: "Final CTA Incentive", platform: "PC // STEAM" },
  { id: "lead-3", email: "pixel_shredder@outlook.com", date: "2026-06-08T09:44:11Z", source: "Wishlist Modal", platform: "PC // EPIC" },
  { id: "lead-4", email: "swarmslayer99@yahoo.com", date: "2026-06-07T18:20:00Z", source: "Hero Direct Hook", platform: "PC // STEAM" },
  { id: "lead-5", email: "luminous_monolith@gmx.com", date: "2026-06-07T15:10:04Z", source: "Final CTA Incentive", platform: "PC // GOG" },
  { id: "lead-6", email: "destructo_terrain@fastmail.com", date: "2026-06-06T20:30:45Z", source: "Wishlist Modal", platform: "PC // STEAM" },
  { id: "lead-7", email: "voxel_architect@proton.me", date: "2026-06-06T12:05:00Z", source: "Hero Direct Hook", platform: "PC // EPIC" },
  { id: "lead-8", email: "aurora_tactics@icloud.com", date: "2026-06-05T21:40:15Z", source: "Final CTA Incentive", platform: "PC // STEAM" }
];

const SEED_GALLERY: any[] = [
  { id: "seed-1", proceduralId: "screen-1", title: "The Core Furnace", subtitle: "Heart of the Cavern", category: "Atmosphere", description: "Secure and defend the radiant central hearth. This ancient gold core pulses warmth and illumination across the bedrock corridors, serving as the ultimate line of defense against the shadow-dwelling swarms.", url: "" },
  { id: "seed-2", proceduralId: "screen-2", title: "Bedrock Cataclysm", subtitle: "Tactical Cave-ins", category: "Destruction", description: "Demolish unstable cavern support beams to trigger a devastating, physical landslide. Use the falling stone blocks to crush high-density crawler packs or build makeshift blockades.", url: "" },
  { id: "seed-3", proceduralId: "screen-3", title: "Horde Containment", subtitle: "Funneling the Terror", category: "Combat", description: "When the dynamic danger scales to dangerous heights, force thousands of rushing enemies through custom-carved narrow tunnels of death. Maximize explosive payload value.", url: "" },
  { id: "seed-4", proceduralId: "screen-4", title: "Prism Burst Fire", subtitle: "Banish the Shadows", category: "Combat", description: "Discharge luminous golden spell strikes directly into the cavernous void. Every ray of energy illuminates dark rock layers and exposes creeping flankers before they strike from above.", url: "" },
  { id: "seed-5", proceduralId: "screen-5", title: "Chipping Outposts", subtitle: "Cavalry Trenches", category: "Destruction", description: "Chisel protective trench fortifications in strategic bottlenecks. Reinforce stone block borders with active defense units, allowing you to sustain gunfire on waves of enemies.", url: "" },
  { id: "seed-6", proceduralId: "screen-6", title: "Luminous Shrines", subtitle: "Mysterious Altars", category: "Atmosphere", description: "Locate golden glowing monuments nested deep within the obsidian stone tunnels. Activate these radiant monoliths to trigger heavy spell powers and massive area-of-effect flash attacks.", url: "" }
];

interface AdminDashboardProps {
  onBackToLanding: () => void;
}

export function AdminDashboard({ onBackToLanding }: AdminDashboardProps) {
  const { playHover, playClick } = useUIAudio();
  const { logout } = useAuth();
  const [records, setRecords] = useState<LeadRecord[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState("all");
  const [notification, setNotification] = useState("");
  
  const [trailerUrl, setTrailerUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

  // Form states for gallery items
  const [newImageForm, setNewImageForm] = useState({
    url: "",
    title: "",
    subtitle: "",
    description: ""
  });

  // Load and seed local storage records and Firestore config
  const loadRecords = async () => {
    try {
      const snapshot = await getDocs(collection(db, "leads"));
      const leads: LeadRecord[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LeadRecord));
      
      setRecords(leads);
      
      const visitsSnap = await getDocs(collection(db, "visits"));
      setVisitorCount(visitsSnap.docs.length);

      // Fetch dynamic configuration from Firestore
      const docRef = doc(db, "config", "landing");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.trailerUrl) setTrailerUrl(data.trailerUrl);
        if (data.heroImageUrl) setHeroImageUrl(data.heroImageUrl);
        if (data.gallery) setGalleryImages(data.gallery);
      } else {
        // Fallback to localStorage
        const storedTrailer = localStorage.getItem("voxel-hearth-trailer");
        if (storedTrailer) setTrailerUrl(storedTrailer);
        
        const storedHeroImage = localStorage.getItem("voxel-hearth-hero-image");
        if (storedHeroImage) setHeroImageUrl(storedHeroImage);
        
        const storedGallery = localStorage.getItem("voxel-hearth-gallery-v2");
        if (storedGallery) {
          setGalleryImages(JSON.parse(storedGallery));
        } else {
          localStorage.setItem("voxel-hearth-gallery-v2", JSON.stringify(SEED_GALLERY));
          setGalleryImages(SEED_GALLERY);
        }
      }
      
    } catch (err) {
      console.error("Could not read database", err);
      setRecords([]);
    }
  };

  const saveConfigToFirestore = async (heroUrl: string, trailer: string, gallery: any[]) => {
    try {
      const docRef = doc(db, "config", "landing");
      await setDoc(docRef, {
        heroImageUrl: heroUrl,
        trailerUrl: trailer,
        gallery: gallery.map(({ id, proceduralId, title, subtitle, category, description, url }) => {
          const item: any = { id, title, subtitle, category, description };
          if (proceduralId) item.proceduralId = proceduralId;
          if (url) item.url = url;
          return item;
        })
      }, { merge: true });
      return true;
    } catch (err) {
      console.error("Failed to save config to Firestore", err);
      showNotice("Database sync error (saved locally only).");
      return false;
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // Standard JS CSV Exporter Code (Takes JSON, maps to rows, initiates anchor click download)
  const handleExportToCSV = () => {
    playClick();
    if (records.length === 0) {
      showNotice("No records available to export!");
      return;
    }

    try {
      // Create headers
      const csvHeaders = ["ID", "Email Address", "Captured Date", "Source Channel", "Target Platform"];
      
      // Map data rows
      const csvRows = records.map(r => [
        `"${r.id}"`,
        `"${r.email.replace(/"/g, '""')}"`,
        `"${r.date}"`,
        `"${r.source}"`,
        `"${r.platform}"`
      ]);

      // Combine into strings
      const csvContent = [csvHeaders.join(","), ...csvRows.map(row => row.join(","))].join("\n");
      
      // Standard Browser Blob anchor download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.setAttribute("href", url);
      link.setAttribute("download", `voxel_hearth_player_leads_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotice("Leads exported successfully to Excel/CSV!");
    } catch (err) {
      console.error("CSV Export failure:", err);
      showNotice("Export failed. Please try again.");
    }
  };

  const handleDeleteRecord = async (id: string) => {
    playClick();
    try {
      await deleteDoc(doc(db, "leads", id));
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      showNotice("Record removed from sandbox registry.");
    } catch (err) {
      console.error(err);
      showNotice("Failed to wipe record.");
    }
  };

  const handleResetToSeeds = async () => {
    playClick();
    try {
      localStorage.setItem("voxel-hearth-emails", JSON.stringify(SEED_RECORDS));
      setRecords(SEED_RECORDS);
      localStorage.setItem("voxel-hearth-gallery-v2", JSON.stringify(SEED_GALLERY));
      setGalleryImages(SEED_GALLERY);
      
      localStorage.removeItem("voxel-hearth-hero-image");
      localStorage.removeItem("voxel-hearth-trailer");
      setHeroImageUrl("");
      setTrailerUrl("");

      const success = await saveConfigToFirestore("", "", SEED_GALLERY);
      if (success) {
        showNotice("Database seeded back to template leads and gallery.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTrailer = async () => {
    playClick();
    if (!trailerUrl) {
      localStorage.removeItem("voxel-hearth-trailer");
    } else {
      localStorage.setItem("voxel-hearth-trailer", trailerUrl);
    }
    const success = await saveConfigToFirestore(heroImageUrl, trailerUrl, galleryImages);
    if (success) {
      showNotice("Trailer configuration updated.");
    }
  };

  const handleSaveHeroImage = async () => {
    playClick();
    if (!heroImageUrl) {
      localStorage.removeItem("voxel-hearth-hero-image");
    } else {
      localStorage.setItem("voxel-hearth-hero-image", heroImageUrl);
    }
    const success = await saveConfigToFirestore(heroImageUrl, trailerUrl, galleryImages);
    if (success) {
      showNotice("Hero media configuration updated.");
    }
  };

  const handleAddImage = async () => {
    playClick();
    if (!newImageForm.url.trim()) return;
    try {
      const updated = [...galleryImages, { ...newImageForm, url: newImageForm.url.trim() }];
      setGalleryImages(updated);
      localStorage.setItem("voxel-hearth-gallery-v2", JSON.stringify(updated));
      setNewImageForm({ url: "", title: "", subtitle: "", description: "" });
      const success = await saveConfigToFirestore(heroImageUrl, trailerUrl, updated);
      if (success) {
        showNotice("Image added to gallery.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditImage = (index: number) => {
    playClick();
    setEditingImageIndex(index);
    setNewImageForm(galleryImages[index]);
  };

  const handleUpdateImage = async () => {
    playClick();
    if (!newImageForm.url.trim() || editingImageIndex === null) return;
    try {
      const updated = [...galleryImages];
      updated[editingImageIndex] = { ...newImageForm, url: newImageForm.url.trim() };
      setGalleryImages(updated);
      localStorage.setItem("voxel-hearth-gallery-v2", JSON.stringify(updated));
      setNewImageForm({ url: "", title: "", subtitle: "", description: "" });
      setEditingImageIndex(null);
      const success = await saveConfigToFirestore(heroImageUrl, trailerUrl, updated);
      if (success) {
        showNotice("Image updated in gallery.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    playClick();
    setNewImageForm({ url: "", title: "", subtitle: "", description: "" });
    setEditingImageIndex(null);
  };

  const handleDeleteImage = async (index: number) => {
    playClick();
    try {
      const updated = [...galleryImages];
      updated.splice(index, 1);
      setGalleryImages(updated);
      localStorage.setItem("voxel-hearth-gallery-v2", JSON.stringify(updated));
      const success = await saveConfigToFirestore(heroImageUrl, trailerUrl, updated);
      if (success) {
        showNotice("Image removed from gallery.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  // Searching & Filtering pipeline
  const filteredRecords = records.filter(item => {
    const matchesSearch = item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === "all" || item.source.toLowerCase().includes(filterSource.toLowerCase());
    return matchesSearch && matchesSource;
  });

  // Calculate high-resolution metrics
  const totalLeads = records.length;
  const heroLeadsCount = records.filter(r => r.source.includes("Hero")).length;
  const ctaLeadsCount = records.filter(r => r.source.includes("Final")).length;
  const conversionRateRatio = totalLeads > 0 ? ((heroLeadsCount + ctaLeadsCount) / totalLeads * 100).toFixed(0) : "0";

  return (
    <div className="min-h-screen bg-void text-zinc-300 py-8 px-6 font-mono selection:bg-swarm-purple selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-900 pb-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-swarm-purple rounded-full animate-ping" />
              <span className="text-[10px] text-swarm-purple uppercase tracking-widest font-black">SYSTEM OVERVIEW PANEL</span>
            </div>
            <h2 className="text-2xl font-display font-black text-white tracking-widest">
              VOXEL_HEARTH // CONVERSION INTEGRATIONS
            </h2>
            <p className="text-xs text-zinc-500">
              Live database monitoring lead channels, player metrics, structures registration & telemetry exports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Logout button */}
            <button
              onClick={async () => {
                playClick();
                await logout();
              }}
              onMouseEnter={playHover}
              className="py-2 px-4 bg-red-950/30 hover:bg-red-900 border border-red-900/50 hover:border-red-600 text-red-500 hover:text-white text-xs rounded-sm transition cursor-pointer flex items-center gap-2"
              title="Terminate Secure Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Terminate</span>
            </button>
            {/* Back button */}
            <button
              onClick={() => {
                playClick();
                onBackToLanding();
              }}
              onMouseEnter={playHover}
              className="py-2 px-4 bg-bedrock hover:bg-neutral-850 hover:text-white text-zinc-400 border border-neutral-850 hover:border-neutral-700 text-xs rounded-sm transition cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Landing</span>
            </button>

            {/* Seed reset */}
            <button
              onClick={handleResetToSeeds}
              onMouseEnter={playHover}
              className="py-2 px-3 bg-[#0d0d10] hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-700 hover:text-hearth-amber text-zinc-500 text-xs rounded-sm transition cursor-pointer flex items-center gap-2"
              title="Reset Database to Seed Template Records"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Seeds</span>
            </button>
          </div>
        </div>

        {/* Floating notifications */}
        {notification && (
          <div className="bg-swarm-purple/10 border-2 border-swarm-purple/40 text-swarm-purple p-3 rounded-sm text-xs flex items-center gap-2.5 animate-bounce">
            <CheckSquare className="w-4 h-4 text-swarm-purple" />
            <span>{notification}</span>
          </div>
        )}

        {/* Dynamic Statistics Widgets (Utilitarian Minimalist cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 0: Visitors */}
          <div className="bg-bedrock/40 p-4 border border-neutral-900 rounded-sm space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-400" /> Unique Site Visitors
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-display font-black text-white">{visitorCount}</span>
              <span className="text-[10px] text-blue-500">logged</span>
            </div>
          </div>

          {/* Card 1 */}
          <div className="bg-bedrock/40 p-4 border border-neutral-900 rounded-sm space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-hearth-gold" /> Total Registered Pilots
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-display font-black text-white">{totalLeads}</span>
              <span className="text-[10px] text-emerald-500">+100% active</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-bedrock/40 p-4 border border-neutral-900 rounded-sm space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-swarm-purple" /> Direct Hero Conversion
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-display font-black text-white">{heroLeadsCount}</span>
              <span className="text-[10px] text-zinc-500">leads generated</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-bedrock/40 p-4 border border-neutral-900 rounded-sm space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-hearth-amber" /> Incentive CTA Signups
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-display font-black text-white">{ctaLeadsCount}</span>
              <span className="text-[10px] text-hearth-amber uppercase">skin allocated</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-bedrock/40 p-4 border border-neutral-900 rounded-sm space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-500" /> Channel Influence Ratio
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-display font-black text-emerald-400">{conversionRateRatio}%</span>
              <span className="text-[10px] text-zinc-550 text-zinc-500">primary tunnels</span>
            </div>
          </div>
        </div>

        {/* Media Management Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <div className="bg-bedrock p-4 border border-neutral-900 rounded-sm space-y-4">
              <h3 className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Trailer Configuration</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="YouTube Embed URL..."
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                  className="flex-grow bg-void border border-neutral-800 text-zinc-200 text-xs py-2 px-3 rounded-sm font-mono outline-none focus:border-slate-700"
                />
                <button 
                  onClick={handleSaveTrailer}
                  className="bg-hearth-gold hover:bg-hearth-amber text-black font-bold text-xs px-4 rounded-sm tracking-wider uppercase transition"
                >
                  Save
                </button>
              </div>
            </div>
            
            <div className="bg-bedrock p-4 border border-neutral-900 rounded-sm space-y-4">
              <h3 className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Hero Background Media</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Image URL or GIF URL..."
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  className="flex-grow bg-void border border-neutral-800 text-zinc-200 text-xs py-2 px-3 rounded-sm font-mono outline-none focus:border-slate-700"
                />
                <button 
                  onClick={handleSaveHeroImage}
                  className="bg-hearth-gold hover:bg-hearth-amber text-black font-bold text-xs px-4 rounded-sm tracking-wider uppercase transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="bg-bedrock p-4 border border-neutral-900 rounded-sm space-y-4">
            <h3 className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Gallery Images ({galleryImages.length})</h3>
            <div className="flex flex-col gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Image URL..."
                value={newImageForm.url}
                onChange={(e) => setNewImageForm({...newImageForm, url: e.target.value})}
                className="w-full bg-void border border-neutral-800 text-zinc-200 text-xs py-2 px-3 rounded-sm font-mono outline-none focus:border-slate-700"
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Title (e.g. Swarm Attack)"
                  value={newImageForm.title}
                  onChange={(e) => setNewImageForm({...newImageForm, title: e.target.value})}
                  className="flex-1 bg-void border border-neutral-800 text-zinc-200 text-xs py-2 px-3 rounded-sm font-mono outline-none focus:border-slate-700"
                />
                <input 
                  type="text" 
                  placeholder="Subtitle (e.g. Action Core)"
                  value={newImageForm.subtitle}
                  onChange={(e) => setNewImageForm({...newImageForm, subtitle: e.target.value})}
                  className="flex-1 bg-void border border-neutral-800 text-zinc-200 text-xs py-2 px-3 rounded-sm font-mono outline-none focus:border-slate-700"
                />
              </div>
              <textarea
                placeholder="Description string..."
                value={newImageForm.description}
                onChange={(e) => setNewImageForm({...newImageForm, description: e.target.value})}
                className="w-full h-16 bg-void border border-neutral-800 text-zinc-200 text-xs py-2 px-3 rounded-sm font-mono outline-none focus:border-slate-700 resize-none"
              />
              <div className="flex gap-2 justify-end mt-1">
              {editingImageIndex !== null ? (
                <>
                  <button 
                    onClick={handleUpdateImage}
                    className="bg-hearth-gold hover:bg-hearth-amber text-black font-bold text-xs px-4 py-2 rounded-sm tracking-wider uppercase transition"
                  >
                    Save
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2 rounded-sm tracking-wider uppercase transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleAddImage}
                  className="bg-swarm-purple hover:bg-[#9d00ff] text-white font-bold text-xs px-4 py-2 rounded-sm tracking-wider uppercase transition"
                >
                  Add To Gallery
                </button>
              )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
               {galleryImages.map((img, i) => (
                 <div key={i} className="relative aspect-[16/10] bg-[#0d0d10] border border-neutral-800 rounded-xs group overflow-hidden flex flex-col items-center justify-center text-center">
                    {img.url ? (
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                        <span className="font-mono text-[9px] text-zinc-500 uppercase px-1">Procedural: {img.proceduralId}</span>
                      </div>
                    )}
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleEditImage(i)} className="p-1.5 bg-black/80 hover:bg-hearth-gold transition text-white hover:text-black rounded-xs">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDeleteImage(i)} className="p-1.5 bg-red-900/80 hover:bg-red-600 transition text-white rounded-xs">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Database Search & Actions Layer */}
        <div className="bg-bedrock rounded-sm border border-neutral-850 p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow max-w-2xl">
              {/* Search input */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Query pilots by email addresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-void border border-neutral-800 focus:border-slate-700 text-zinc-200 text-xs py-2.5 pl-10 pr-3 rounded-sm font-mono outline-none transition"
                />
              </div>

              {/* Source filtering */}
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="bg-void border border-neutral-800 text-zinc-400 text-xs py-2.5 px-3 rounded-sm font-mono outline-none cursor-pointer focus:border-slate-700"
              >
                <option value="all">ANY CHANNEL SOURCES</option>
                <option value="Hero">HERO DIRECT HOOK</option>
                <option value="Final">FINAL CTA INCENTIVE</option>
                <option value="Wishlist">WISHLIST MODAL</option>
              </select>
            </div>

            {/* Export trigger button */}
            <button
              onClick={handleExportToCSV}
              onMouseEnter={playHover}
              className="py-2.5 px-5 bg-hearth-gold hover:bg-hearth-amber text-black font-bold text-xs uppercase tracking-wider rounded-sm shadow-md flex items-center justify-center gap-2.5 transition active:scale-97 cursor-pointer border border-transparent whitespace-nowrap"
            >
              <Download className="w-4 h-4 fill-black" />
              <span>Export Excel / CSV</span>
            </button>
          </div>

          {/* Database Grid Table */}
          <div className="overflow-x-auto border border-neutral-900 rounded-xs">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-void text-zinc-500 border-b border-neutral-900">
                  <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Pilot Email coordinates</th>
                  <th className="py-3 px-4 uppercase tracking-wider text-[10px] hidden sm:table-cell">Acquisition Source</th>
                  <th className="py-3 px-4 uppercase tracking-wider text-[10px] hidden md:table-cell">Subscribed On</th>
                  <th className="py-3 px-4 uppercase tracking-wider text-[10px] hidden lg:table-cell">Targeting Platform</th>
                  <th className="py-3 px-4 uppercase tracking-wider text-[10px] text-right">Database Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-905 divide-neutral-900">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-void/45 transition-all">
                      {/* Email */}
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                        <span className="truncate max-w-[220px] sm:max-w-none">{item.email}</span>
                      </td>
                      {/* Source */}
                      <td className="py-3.5 px-4 text-zinc-400 hidden sm:table-cell font-mono">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] ${
                          item.source.includes("Hero")
                            ? "bg-slate-900 text-hearth-gold border border-hearth-gold/20"
                            : item.source.includes("Final")
                            ? "bg-slate-900 text-hearth-amber border border-hearth-amber/20"
                            : "bg-slate-900 text-swarm-purple border border-swarm-purple/20"
                        }`}>
                          {item.source.toUpperCase()}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="py-3.5 px-4 text-zinc-500 hidden md:table-cell font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-zinc-655 text-zinc-500" />
                          <span>{new Date(item.date).toLocaleString()}</span>
                        </div>
                      </td>
                      {/* Platform */}
                      <td className="py-3.5 px-4 text-zinc-500 hidden lg:table-cell font-mono">
                        <div className="flex items-center gap-1.5">
                          <Server className="w-3 h-3 text-zinc-655 text-zinc-500" />
                          <span>{item.platform}</span>
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteRecord(item.id)}
                          onMouseEnter={playHover}
                          className="p-1 px-2.5 text-red-500 hover:text-white hover:bg-red-950/40 border border-neutral-900 hover:border-red-900 rounded-sm transition cursor-pointer"
                          title="Purge lead coordinates"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                          <span className="hidden sm:inline ml-1.5 text-[10px]">WIPE</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-600 font-mono">
                      No matching registered email logs found inside the tunnels.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-2">
            <span>SHOWING {filteredRecords.length} OF {records.length} ACTIVE DRIVER COORDINATES</span>
            <span>ENCRYPTED SANDBOX SECURITY // AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
}
