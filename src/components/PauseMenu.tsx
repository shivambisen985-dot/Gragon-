import React from 'react';
import { GameSettings } from '../types';
import { Volume2, VolumeX, Eye, MousePointer, Shield, RotateCcw, Play, X, Compass } from 'lucide-react';

interface PauseMenuProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResume: () => void;
  onRestart: () => void;
  onOpenShop: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  settings,
  onUpdateSettings,
  onResume,
  onRestart,
  onOpenShop,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl font-sans animate-fade-in">
      <div className="relative w-full max-w-lg bg-black/80 border border-white/10 rounded-3xl shadow-2xl p-8 text-white backdrop-blur-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-bold mb-0.5">
              System Standby
            </div>
            <h2 className="text-2xl font-black italic tracking-wider text-white/90 uppercase">
              TACTICAL PAUSE
            </h2>
          </div>
          <button
            onClick={onResume}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="mt-6 space-y-4">
          
          {/* Camera View Mode */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-sm text-white/90">Camera Mode</span>
            </div>
            <div className="flex bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => onUpdateSettings({ ...settings, cameraMode: 'first_person' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  settings.cameraMode === 'first_person'
                    ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                1st Person
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, cameraMode: 'third_person' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  settings.cameraMode === 'third_person'
                    ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                3rd Person
              </button>
            </div>
          </div>

          {/* Sound Volume Slider */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {settings.soundVolume === 0 ? (
                  <VolumeX className="w-5 h-5 text-white/40" />
                ) : (
                  <Volume2 className="w-5 h-5 text-red-400" />
                )}
                <span className="font-semibold text-sm text-white/90">Spatial Audio Volume</span>
              </div>
              <span className="text-xs font-mono font-bold text-red-400">
                {Math.round(settings.soundVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.soundVolume}
              onChange={(e) => onUpdateSettings({ ...settings, soundVolume: parseFloat(e.target.value) })}
              className="w-full accent-red-500 cursor-pointer h-1.5 bg-black/60 rounded-lg"
            />
          </div>

          {/* Mouse Sensitivity Slider */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MousePointer className="w-5 h-5 text-red-400" />
                <span className="font-semibold text-sm text-white/90">Aim Sensitivity</span>
              </div>
              <span className="text-xs font-mono font-bold text-red-400">
                {(settings.mouseSensitivity * 1000).toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.006"
              step="0.0005"
              value={settings.mouseSensitivity}
              onChange={(e) => onUpdateSettings({ ...settings, mouseSensitivity: parseFloat(e.target.value) })}
              className="w-full accent-red-500 cursor-pointer h-1.5 bg-black/60 rounded-lg"
            />
          </div>

          {/* Controls Overview */}
          <div className="p-4 bg-black/40 rounded-2xl border border-white/10 text-xs text-white/60 space-y-1.5">
            <div className="font-bold text-red-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Compass className="w-3.5 h-3.5" /> Directives:
            </div>
            <div>• <span className="text-white/90 font-semibold">WASD / Arrows</span>: Traverse corridors</div>
            <div>• <span className="text-white/90 font-semibold">Mouse Drag / Aim</span>: Camera orientation</div>
            <div>• <span className="text-white/90 font-semibold">Left Click / Space</span>: Strike with equipped weapon</div>
            <div>• <span className="text-white/90 font-semibold">Shift</span>: Tactical sprint</div>
            <div>• <span className="text-white/90 font-semibold">E / 1 Key</span>: Inject vitality potion</div>
            <div>• <span className="text-white/90 font-semibold">V Key</span>: Switch perspective</div>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3 pt-5 border-t border-white/10">
          <button
            onClick={onOpenShop}
            className="flex items-center justify-center space-x-2 py-3.5 rounded-2xl font-bold bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 text-xs uppercase tracking-wider transition-all"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Armory Shop</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center justify-center space-x-2 py-3.5 rounded-2xl font-bold bg-white/5 hover:bg-white/10 text-red-400 border border-red-500/30 text-xs uppercase tracking-wider transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Abort & Restart</span>
          </button>
        </div>

        <button
          onClick={onResume}
          className="mt-3 w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-black text-white bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all uppercase tracking-widest text-sm border border-red-400/30"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Resume Mission</span>
        </button>

      </div>
    </div>
  );
};
