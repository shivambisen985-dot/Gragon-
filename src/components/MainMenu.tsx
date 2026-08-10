import React, { useState } from 'react';
import { BUILTIN_LEVELS } from '../dungeon/levelData';
import { Play, Shield, Compass, Eye, Sparkles, Volume2 } from 'lucide-react';

interface MainMenuProps {
  onStartGame: (levelIndex: number) => void;
  onOpenShop: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onOpenShop }) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(0);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 overflow-hidden select-none font-sans">
      
      {/* Background Radial Glow & Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2a2a35_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#1a1a20] to-transparent" />
      </div>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-3xl bg-black/60 border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-2xl flex flex-col items-center text-center">
        
        {/* Badge Header */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/40 border border-red-500/40 text-red-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span>Tactical 3D Dungeon Vaults</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white/90 uppercase drop-shadow-2xl">
          DUNGEON<span className="text-red-600">ESCAPE</span>
        </h1>
        <p className="mt-3 text-white/60 text-sm md:text-base max-w-xl font-medium leading-relaxed">
          Infiltrate subterranean catacombs, decipher security keycards, avoid spike hazards, and defeat skeleton sentinels to claim the golden vault key!
        </p>

        {/* Level Selector */}
        <div className="mt-8 w-full text-left">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-3">
            Active Mission Sector
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BUILTIN_LEVELS.map((lvl, idx) => {
              const isSelected = selectedLevel === idx;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.25)] text-white'
                      : 'bg-white/5 border-white/10 hover:border-white/30 text-white/70'
                  }`}
                >
                  <div className="text-[9px] uppercase tracking-[0.2em] text-red-400 font-bold mb-1">
                    Sector 0{idx + 1}
                  </div>
                  <div className="font-extrabold text-sm text-white">{lvl.name}</div>
                  <div className="text-xs text-white/40 mt-1 line-clamp-2">{lvl.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tactical Features Grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 w-full text-xs text-white/70 text-left">
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <Eye className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-medium">FPS & TPS Tactical Camera</span>
          </div>
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <Shield className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="font-medium">Real-Time Sword Combat</span>
          </div>
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <Compass className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="font-medium">Radar Map & Keycards</span>
          </div>
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">Spatial Dungeon Audio</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full">
          <button
            onClick={onOpenShop}
            className="w-full sm:w-1/3 py-4 rounded-2xl font-bold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-all text-sm tracking-wider uppercase"
          >
            Merchant Armory
          </button>

          <button
            onClick={() => onStartGame(selectedLevel)}
            className="w-full sm:w-2/3 py-4 rounded-2xl font-black text-white bg-red-600 hover:bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2 text-base tracking-widest uppercase active:scale-95 border border-red-400/30"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Initiate Mission Run</span>
          </button>
        </div>

      </div>

    </div>
  );
};
