import React from 'react';
import { PlayerStats } from '../types';
import { Skull, RotateCcw, Shield } from 'lucide-react';

interface GameOverModalProps {
  stats: PlayerStats;
  onRestart: () => void;
  onOpenShop: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onRestart,
  onOpenShop,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-black/80 border border-white/10 rounded-3xl shadow-2xl p-8 text-white text-center backdrop-blur-2xl">
        
        {/* Skull Header */}
        <div className="mx-auto w-16 h-16 bg-red-950/40 border border-red-500/50 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <Skull className="w-8 h-8 text-red-500 animate-pulse" />
        </div>

        <div className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-bold mb-1">
          Signal Terminated
        </div>
        <h2 className="text-3xl font-black italic tracking-wider text-white/90 uppercase">
          YOU PERISHED
        </h2>
        <p className="text-xs text-white/50 mt-1">
          Your vitality core failed in the dark subterranean vaults...
        </p>

        {/* Stats */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2.5 text-xs">
          <div className="flex justify-between text-white/60">
            <span>Sentinels Defeated:</span>
            <span className="font-mono font-bold text-white">{stats.monstersKilled}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Gold Recovered:</span>
            <span className="font-mono font-bold text-yellow-300">{stats.coins}</span>
          </div>
          <div className="flex justify-between text-white/80 font-bold pt-3 border-t border-white/10">
            <span className="uppercase tracking-wider text-[10px]">Final Score:</span>
            <span className="font-mono font-black text-red-400 text-lg">{stats.score} PTS</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={onOpenShop}
            className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl font-bold bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 transition-all text-xs uppercase tracking-wider"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Visit Merchant Armory</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-black text-white bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all text-xs uppercase tracking-widest border border-red-400/30 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Re-Initiate Mission Run</span>
          </button>
        </div>

      </div>
    </div>
  );
};
