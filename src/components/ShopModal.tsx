import React from 'react';
import { PlayerStats, ShopItem } from '../types';
import { Shield, Heart, Zap, Sun, Crosshair, PlusCircle, X, Coins } from 'lucide-react';

interface ShopModalProps {
  stats: PlayerStats;
  onUpdateStats: (newStats: PlayerStats) => void;
  onClose: () => void;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'hp_boost',
    name: 'Vitality Elixir',
    description: '+25 Max HP & Full Heal',
    cost: 40,
    iconName: 'Heart',
    apply: (s) => ({
      ...s,
      maxHp: s.maxHp + 25,
      hp: s.maxHp + 25,
    }),
  },
  {
    id: 'weapon_upgrade',
    name: 'Runic Blade Polish',
    description: '+10 Weapon Damage',
    cost: 50,
    iconName: 'Zap',
    apply: (s) => ({
      ...s,
      weaponDamage: s.weaponDamage + 10,
      weaponName: s.weaponName.includes('Sharp') ? 'Master Rune Blade' : 'Sharp Iron Sword',
    }),
  },
  {
    id: 'armor_boost',
    name: 'Iron Plate Armor',
    description: '+3 Damage Defense',
    cost: 45,
    iconName: 'Shield',
    apply: (s) => ({
      ...s,
      defense: s.defense + 3,
    }),
  },
  {
    id: 'speed_boots',
    name: 'Boots of Haste',
    description: '+15% Walk & Sprint Speed',
    cost: 35,
    iconName: 'Crosshair',
    apply: (s) => ({
      ...s,
      speedMultiplier: s.speedMultiplier + 0.15,
    }),
  },
  {
    id: 'torch_expand',
    name: 'Radiant Fire Gem',
    description: '+4 Torch Illumination Radius',
    cost: 30,
    iconName: 'Sun',
    apply: (s) => ({
      ...s,
      torchRadius: s.torchRadius + 4,
    }),
  },
  {
    id: 'buy_potion',
    name: 'Health Potion Pack',
    description: '+2 Health Potions',
    cost: 25,
    iconName: 'PlusCircle',
    apply: (s) => ({
      ...s,
      potions: s.potions + 2,
    }),
  },
];

export const ShopModal: React.FC<ShopModalProps> = ({ stats, onUpdateStats, onClose }) => {
  const handleBuy = (item: ShopItem) => {
    if (stats.coins >= item.cost) {
      const updated = item.apply({
        ...stats,
        coins: stats.coins - item.cost,
      });
      onUpdateStats(updated);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-6 h-6 text-red-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Shield': return <Shield className="w-6 h-6 text-blue-400" />;
      case 'Crosshair': return <Crosshair className="w-6 h-6 text-emerald-400" />;
      case 'Sun': return <Sun className="w-6 h-6 text-yellow-300" />;
      case 'PlusCircle': return <PlusCircle className="w-6 h-6 text-pink-400" />;
      default: return <Coins className="w-6 h-6 text-amber-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-black/80 border border-white/10 rounded-3xl shadow-2xl p-8 text-white backdrop-blur-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-bold mb-0.5">
              Tactical Outfitter
            </div>
            <h2 className="text-2xl font-black italic tracking-wider text-white/90 uppercase">
              DUNGEON ARMORY & MERCHANT
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              Acquire field upgrades using gold recovered from vaults and guardians.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coin Balance Pill */}
        <div className="mt-5 flex items-center justify-between bg-white/5 px-5 py-3.5 rounded-2xl border border-white/10">
          <div className="flex items-center space-x-2.5">
            <Coins className="w-5 h-5 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white/70">Purse Balance:</span>
          </div>
          <span className="text-lg font-mono font-extrabold text-yellow-300">{stats.coins} Gold Coins</span>
        </div>

        {/* Items Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[55vh] overflow-y-auto pr-1">
          {SHOP_ITEMS.map((item) => {
            const canAfford = stats.coins >= item.cost;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  canAfford
                    ? 'bg-white/5 border-white/10 hover:border-red-500/50'
                    : 'bg-black/40 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-black/60 rounded-xl border border-white/10 shrink-0">
                    {getIcon(item.iconName)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{item.name}</div>
                    <div className="text-xs text-white/50">{item.description}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford}
                  className={`px-3.5 py-2 rounded-xl font-mono font-bold text-xs transition-all shrink-0 ml-2 ${
                    canAfford
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)] active:scale-95'
                      : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {item.cost} Gold
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-400/30 transition-all"
          >
            Return to Mission
          </button>
        </div>

      </div>
    </div>
  );
};
