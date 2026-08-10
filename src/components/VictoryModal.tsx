import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PlayerStats } from '../types';
import { Trophy, Coins, Skull, ArrowRight, ShoppingBag } from 'lucide-react';

interface VictoryModalProps {
  levelName: string;
  stats: PlayerStats;
  onNextLevel: () => void;
  onOpenShop: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelName,
  stats,
  onNextLevel,
  onOpenShop,
}) => {
  useEffect(() => {
    // Fire confetti fireworks
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-black/80 border border-white/10 rounded-3xl shadow-2xl p-8 text-white text-center backdrop-blur-2xl">
        
        {/* Trophy Header */}
        <div className="mx-auto w-16 h-16 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Trophy className="w-8 h-8 text-emerald-400 animate-bounce" />
        </div>

        <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold mb-1">
          Mission Accomplished
        </div>
        <h2 className="text-3xl font-black italic tracking-wider text-white/90 uppercase">
          SECTOR ESCAPED!
        </h2>
        <p className="text-xs text-white/50 mt-1">
          Vault sector <span className="text-white font-bold">{levelName}</span> fully cleared!
        </p>

        {/* Stats Summary */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-white/60 font-medium">
              <Coins className="w-4 h-4 text-yellow-400" /> Total Gold Coins:
            </span>
            <span className="font-mono font-extrabold text-yellow-300 text-sm">{stats.coins}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-white/60 font-medium">
              <Skull className="w-4 h-4 text-red-400" /> Sentinels Destroyed:
            </span>
            <span className="font-mono font-extrabold text-red-400 text-sm">{stats.monstersKilled}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-white/80 font-bold uppercase tracking-wider text-[10px]">Total Score:</span>
            <span className="font-mono font-black text-emerald-400 text-lg">{stats.score} PTS</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={onOpenShop}
            className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl font-bold bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 transition-all text-xs uppercase tracking-wider"
          >
            <ShoppingBag className="w-4 h-4 text-yellow-400" />
            <span>Visit Merchant Armory</span>
          </button>

          <button
            onClick={onNextLevel}
            className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all text-xs uppercase tracking-widest border border-emerald-400/30 active:scale-95"
          >
            <span>Descend to Next Sector</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
