export type KeyColor = 'gold' | 'silver' | 'ruby';

export interface Position {
  x: number;
  y: number;
  z: number;
}

export type ItemType = 
  | 'key_gold'
  | 'key_silver'
  | 'key_ruby'
  | 'coin'
  | 'potion'
  | 'chest'
  | 'trap_spikes'
  | 'trap_fire'
  | 'door_gold'
  | 'door_silver'
  | 'door_ruby'
  | 'door_wooden'
  | 'exit';

export interface DungeonItem {
  id: string;
  type: ItemType;
  x: number;
  z: number;
  collected?: boolean;
  opened?: boolean;
  active?: boolean; // For traps
  keyRequired?: KeyColor;
  coinsCount?: number;
}

export type MonsterType = 'skeleton_warrior' | 'skeleton_brute' | 'skeleton_archer';

export interface Monster {
  id: string;
  type: MonsterType;
  x: number;
  z: number;
  hp: number;
  maxHp: number;
  damage: number;
  speed: number;
  state: 'idle' | 'patrol' | 'chase' | 'attack' | 'dead';
  patrolPoints: { x: number; z: number }[];
  currentPatrolIdx: number;
  attackCooldown: number;
  lastAttackTime: number;
  alerted: boolean;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  coins: number;
  keys: Record<KeyColor, number>;
  potions: number;
  weaponDamage: number;
  weaponName: string;
  speedMultiplier: number;
  defense: number;
  torchRadius: number;
  score: number;
  monstersKilled: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  grid: number[][]; // 0 = Empty/Floor, 1 = Wall, 2 = Decorative Pillar, 3 = Water/Lava pit
  playerStart: { x: number; z: number };
  items: DungeonItem[];
  monsters: Omit<Monster, 'hp' | 'state' | 'currentPatrolIdx' | 'attackCooldown' | 'lastAttackTime' | 'alerted'>[];
  theme: 'dungeon' | 'crypt' | 'inferno' | 'mossy';
  ambientColor: number;
  fogColor: number;
  fogDensity: number;
}

export type GameState = 'menu' | 'playing' | 'paused' | 'shop' | 'gameover' | 'victory' | 'level_complete';

export interface GameSettings {
  cameraMode: 'first_person' | 'third_person';
  soundVolume: number;
  sfxVolume: number;
  mouseSensitivity: number;
  showMinimap: boolean;
  touchControlsEnabled: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  iconName: string;
  apply: (stats: PlayerStats) => PlayerStats;
}
