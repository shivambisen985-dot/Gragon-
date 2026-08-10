import React, { useState } from 'react';
import { GameSettings, LevelConfig, Monster, PlayerStats } from '../types';
import { Minimap } from './Minimap';
import {
  Heart,
  Shield,
  Coins,
  Key,
  Crosshair,
  Pause,
  Eye,
  PlusCircle,
  Zap,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface HUDProps {
  stats: PlayerStats;
  level: LevelConfig;
  settings: GameSettings;
  playerPos: { x: number; z: number };
  playerYaw: number;
  monsters: Monster[];
  message: string;
  onPause: () => void;
  onUsePotion: () => void;
  onAttack: () => void;
  onToggleCamera: () => void;
  onToggleMute: () => void;
  onTouchMove: (dx: number, dz: number) => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  level,
  settings,
  playerPos,
  playerYaw,
  monsters,
  message,
  onPause,
  onUsePotion,
  onAttack,
  onToggleCamera,
  onToggleMute,
  onTouchMove,
}) => {
  const [touchActive, setTouchActive] = useState(false);

  const hpPercent = Math.max(0, Math.min(100, (stats.hp / stats.maxHp) * 100));

  const handleTouchStart = (dx: number, dz: number) => {
    setTouchActive(true);
    onTouchMove(dx, dz);
  };

  const handleTouchEnd = () => {
    setTouchActive(false);
    onTouchMove(0, 0);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-6 overflow-hidden font-sans">
      
      {/* Top Header Bar */}
      <div className="flex items-start justify-between">
        
        {/* Left: Vitality Core, Defense & Weapon */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          
          {/* Vitality Core (Health Bar) */}
          <div className="flex items-center gap-3 bg-black/60 border border-white/10 p-3 px-4 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className="w-10 h-10 bg-red-950/40 border border-red-500/50 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)] shrink-0">
              <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
            </div>
            <div className="flex flex-col w-44 sm:w-56">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-red-400 font-bold mb-1">
                <span>Vitality Core</span>
                <span className="font-mono text-white/80">{Math.round(stats.hp)} / {stats.maxHp} HP</span>
              </div>
              <div className="w-full h-3 bg-gray-900/90 rounded-full border border-white/5 overflow-hidden p-[2px]">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-300"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Defense & Weapon Pills */}
          <div className="flex items-center gap-2">
            {stats.defense > 0 && (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-mono tracking-wider text-blue-200">DEF +{stats.defense}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-mono tracking-wider text-amber-200">{stats.weaponName} ({stats.weaponDamage} DMG)</span>
            </div>
          </div>

        </div>

        {/* Center: Active Mission & Level Title */}
        <div className="hidden md:flex flex-col items-center">
          <div className="bg-black/60 border border-white/10 px-6 py-2.5 rounded-2xl shadow-2xl text-center backdrop-blur-xl max-w-md">
            <div className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em]">
              {level.name}
            </div>
            {message ? (
              <div className="text-xs text-white/90 font-medium mt-1 animate-fade-in tracking-wide">
                {message}
              </div>
            ) : (
              <div className="text-xs text-white/60 font-medium mt-0.5">
                Navigate chambers, recover keycards & defeat guardians.
              </div>
            )}
          </div>
        </div>

        {/* Right: Title Branding, Coins, Keys & Minimap Controls */}
        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          
          <div className="text-right hidden sm:block">
            <div className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white/90">
              DUNGEON<span className="text-red-600">ESCAPE</span>
            </div>
            <div className="text-[9px] uppercase tracking-[0.4em] text-white/40">
              {level.subtitle || 'Tactical Vault Run'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Coin Counter */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-lg">
              <Coins className="w-4 h-4 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
              <span className="text-xs font-mono tracking-widest text-yellow-200 font-bold">{stats.coins}</span>
            </div>

            {/* Keys Count */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-full backdrop-blur-md shadow-lg">
              {stats.keys.silver > 0 && (
                <Key className="w-4 h-4 text-slate-300" title="Silver Key" />
              )}
              {stats.keys.gold > 0 && (
                <Key className="w-4 h-4 text-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" title="Gold Key" />
              )}
              {stats.keys.ruby > 0 && (
                <Key className="w-4 h-4 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" title="Ruby Key" />
              )}
              {stats.keys.silver === 0 && stats.keys.gold === 0 && stats.keys.ruby === 0 && (
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">No Keycards</span>
              )}
            </div>

            {/* Controls Toggle Buttons */}
            <button
              onClick={onToggleCamera}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 hover:text-white transition-all shadow-lg backdrop-blur-md"
              title="Toggle Camera View"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleMute}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 hover:text-white transition-all shadow-lg backdrop-blur-md"
              title="Mute/Unmute Audio"
            >
              {settings.soundVolume > 0 ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/40" />
              )}
            </button>

            <button
              onClick={onPause}
              className="p-2.5 bg-red-950/40 border border-red-500/50 hover:bg-red-900/60 rounded-xl text-red-400 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] backdrop-blur-md"
              title="Pause Menu"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>

          {/* Minimap Radar */}
          {settings.showMinimap && (
            <div className="mt-1">
              <Minimap
                level={level}
                playerPos={playerPos}
                playerYaw={playerYaw}
                monsters={monsters}
              />
            </div>
          )}

        </div>

      </div>

      {/* Center Screen Tactical Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Crosshair className="w-5 h-5 text-red-500/60 stroke-[1.5]" />
      </div>

      {/* Mobile / Screen Action Controls */}
      <div className="flex items-end justify-between pointer-events-auto pb-2">
        
        {/* Sleek D-Pad */}
        <div className="relative w-36 h-36 bg-black/60 border border-white/10 rounded-full p-2 grid grid-cols-3 grid-rows-3 gap-1 backdrop-blur-xl sm:w-40 sm:h-40">
          <div />
          <button
            onTouchStart={() => handleTouchStart(0, -1)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchStart(0, -1)}
            onMouseUp={handleTouchEnd}
            className="bg-white/5 hover:bg-white/15 active:bg-red-600/40 border border-white/10 text-white/80 font-bold rounded-t-2xl text-xs flex items-center justify-center transition-all"
          >
            ▲
          </button>
          <div />

          <button
            onTouchStart={() => handleTouchStart(-1, 0)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchStart(-1, 0)}
            onMouseUp={handleTouchEnd}
            className="bg-white/5 hover:bg-white/15 active:bg-red-600/40 border border-white/10 text-white/80 font-bold rounded-l-2xl text-xs flex items-center justify-center transition-all"
          >
            ◄
          </button>
          <div className="flex items-center justify-center text-[9px] text-white/30 font-bold uppercase tracking-widest">NAV</div>
          <button
            onTouchStart={() => handleTouchStart(1, 0)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchStart(1, 0)}
            onMouseUp={handleTouchEnd}
            className="bg-white/5 hover:bg-white/15 active:bg-red-600/40 border border-white/10 text-white/80 font-bold rounded-r-2xl text-xs flex items-center justify-center transition-all"
          >
            ►
          </button>

          <div />
          <button
            onTouchStart={() => handleTouchStart(0, 1)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchStart(0, 1)}
            onMouseUp={handleTouchEnd}
            className="bg-white/5 hover:bg-white/15 active:bg-red-600/40 border border-white/10 text-white/80 font-bold rounded-b-2xl text-xs flex items-center justify-center transition-all"
          >
            ▼
          </button>
          <div />
        </div>

        {/* Action Buttons: Attack & Potion */}
        <div className="flex items-center gap-3">
          
          {/* Health Potion Button */}
          <button
            onClick={onUsePotion}
            className="relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-black/60 border border-white/10 hover:border-red-500/50 hover:bg-red-950/30 active:scale-95 transition-all shadow-xl backdrop-blur-xl group"
            title="Drink Health Potion [E]"
          >
            <PlusCircle className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-bold text-white/70 tracking-widest mt-0.5">HEAL</span>
            <span className="absolute -top-2 -right-2 bg-red-600 text-white font-mono font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              {stats.potions}
            </span>
          </button>

          {/* SWORD ATTACK BUTTON */}
          <button
            onClick={onAttack}
            className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/60 active:scale-90 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] backdrop-blur-xl text-red-400 hover:text-red-300"
            title="Attack with Sword [Space / Left Click]"
          >
            <Zap className="w-8 h-8 fill-red-400 text-red-400" />
            <span className="text-[10px] font-bold tracking-widest mt-1 uppercase">ATTACK</span>
          </button>

        </div>

      </div>

    </div>
  );
};
