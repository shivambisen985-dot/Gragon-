import { LevelConfig } from '../types';

/*
Grid legend:
0 = Empty space / Floor
1 = Solid Stone Wall
2 = Decorative Pillar
3 = Lava / Acid Pit (Damaging floor)
*/

export const LEVEL_1: LevelConfig = {
  id: 1,
  name: 'Floor 1: The Dark Crypts',
  subtitle: 'Find the Silver Key to unlock the gate and escape the entrance crypt.',
  width: 11,
  height: 11,
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 2, 0, 2, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  playerStart: { x: 1, z: 1 },
  theme: 'crypt',
  ambientColor: 0x111122,
  fogColor: 0x070712,
  fogDensity: 0.08,
  items: [
    { id: 'c1', type: 'coin', x: 2, z: 1 },
    { id: 'c2', type: 'coin', x: 3, z: 1 },
    { id: 'c3', type: 'coin', x: 1, z: 3 },
    { id: 'c4', type: 'coin', x: 9, z: 1 },
    { id: 'c5', type: 'coin', x: 9, z: 3 },
    { id: 'key_silver_1', type: 'key_silver', x: 1, z: 9 },
    { id: 'door_silver_1', type: 'door_silver', x: 7, z: 4, keyRequired: 'silver' },
    { id: 'chest_1', type: 'chest', x: 9, z: 8, coinsCount: 25 },
    { id: 'potion_1', type: 'potion', x: 5, z: 8 },
    { id: 'trap_1', type: 'trap_spikes', x: 5, z: 3 },
    { id: 'trap_2', type: 'trap_spikes', x: 3, z: 7 },
    { id: 'exit_1', type: 'exit', x: 9, z: 9 },
  ],
  monsters: [
    {
      id: 'm1',
      type: 'skeleton_warrior',
      x: 5,
      z: 5,
      maxHp: 30,
      damage: 10,
      speed: 1.8,
      patrolPoints: [
        { x: 5, z: 5 },
        { x: 5, z: 7 },
        { x: 3, z: 7 },
      ],
    },
    {
      id: 'm2',
      type: 'skeleton_warrior',
      x: 8,
      z: 2,
      maxHp: 35,
      damage: 12,
      speed: 2.0,
      patrolPoints: [
        { x: 8, z: 2 },
        { x: 8, z: 4 },
      ],
    },
  ],
};

export const LEVEL_2: LevelConfig = {
  id: 2,
  name: 'Floor 2: Skeleton Keep',
  subtitle: 'Find Silver and Gold keys. Dodge deadly traps and vanquish patrolling guards.',
  width: 13,
  height: 13,
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 2, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 2, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  playerStart: { x: 1, z: 1 },
  theme: 'dungeon',
  ambientColor: 0x221100,
  fogColor: 0x0e0a05,
  fogDensity: 0.07,
  items: [
    { id: 'c1', type: 'coin', x: 2, z: 1 },
    { id: 'c2', type: 'coin', x: 3, z: 1 },
    { id: 'c3', type: 'coin', x: 1, z: 5 },
    { id: 'c4', type: 'coin', x: 7, z: 1 },
    { id: 'c5', type: 'coin', x: 11, z: 1 },
    { id: 'key_silver_2', type: 'key_silver', x: 11, z: 11 },
    { id: 'door_silver_2', type: 'door_silver', x: 3, z: 6, keyRequired: 'silver' },
    { id: 'key_gold_2', type: 'key_gold', x: 1, z: 11 },
    { id: 'door_gold_2', type: 'door_gold', x: 9, z: 8, keyRequired: 'gold' },
    { id: 'chest_2a', type: 'chest', x: 1, z: 7, coinsCount: 35 },
    { id: 'chest_2b', type: 'chest', x: 11, z: 3, coinsCount: 50 },
    { id: 'potion_2a', type: 'potion', x: 7, z: 7 },
    { id: 'potion_2b', type: 'potion', x: 11, z: 7 },
    { id: 'trap_2a', type: 'trap_spikes', x: 5, z: 1 },
    { id: 'trap_2b', type: 'trap_fire', x: 7, z: 3 },
    { id: 'trap_2c', type: 'trap_spikes', x: 9, z: 5 },
    { id: 'exit_2', type: 'exit', x: 11, z: 9 },
  ],
  monsters: [
    {
      id: 'm2_1',
      type: 'skeleton_warrior',
      x: 5,
      z: 3,
      maxHp: 40,
      damage: 12,
      speed: 2.0,
      patrolPoints: [{ x: 5, z: 3 }, { x: 9, z: 3 }],
    },
    {
      id: 'm2_2',
      type: 'skeleton_warrior',
      x: 11,
      z: 5,
      maxHp: 45,
      damage: 14,
      speed: 2.2,
      patrolPoints: [{ x: 11, z: 5 }, { x: 11, z: 7 }],
    },
    {
      id: 'm2_3',
      type: 'skeleton_brute',
      x: 5,
      z: 11,
      maxHp: 75,
      damage: 20,
      speed: 1.5,
      patrolPoints: [{ x: 5, z: 11 }, { x: 7, z: 11 }],
    },
  ],
};

export const LEVEL_3: LevelConfig = {
  id: 3,
  name: 'Floor 3: Inferno Chamber',
  subtitle: 'Beware burning lava pits, ruby doors, and fierce skeleton brutes.',
  width: 15,
  height: 15,
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 3, 0, 1, 0, 1, 1, 1, 0, 1, 0, 3, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 3, 0, 3, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 3, 3, 3, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 3, 0, 2, 0, 1, 0, 1, 0, 2, 0, 3, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  playerStart: { x: 1, z: 1 },
  theme: 'inferno',
  ambientColor: 0x330d00,
  fogColor: 0x1a0500,
  fogDensity: 0.08,
  items: [
    { id: 'c1', type: 'coin', x: 2, z: 1 },
    { id: 'c2', type: 'coin', x: 3, z: 1 },
    { id: 'key_ruby_3', type: 'key_ruby', x: 13, z: 1 },
    { id: 'door_ruby_3', type: 'door_ruby', x: 7, z: 4, keyRequired: 'ruby' },
    { id: 'key_gold_3', type: 'key_gold', x: 1, z: 13 },
    { id: 'door_gold_3', type: 'door_gold', x: 7, z: 10, keyRequired: 'gold' },
    { id: 'chest_3a', type: 'chest', x: 13, z: 13, coinsCount: 100 },
    { id: 'potion_3a', type: 'potion', x: 5, z: 5 },
    { id: 'potion_3b', type: 'potion', x: 9, z: 5 },
    { id: 'trap_3a', type: 'trap_fire', x: 5, z: 1 },
    { id: 'trap_3b', type: 'trap_fire', x: 9, z: 1 },
    { id: 'trap_3c', type: 'trap_spikes', x: 7, z: 7 },
    { id: 'exit_3', type: 'exit', x: 7, z: 12 },
  ],
  monsters: [
    {
      id: 'm3_1',
      type: 'skeleton_warrior',
      x: 7,
      z: 1,
      maxHp: 50,
      damage: 15,
      speed: 2.2,
      patrolPoints: [{ x: 7, z: 1 }, { x: 7, z: 3 }],
    },
    {
      id: 'm3_2',
      type: 'skeleton_brute',
      x: 1,
      z: 9,
      maxHp: 100,
      damage: 25,
      speed: 1.6,
      patrolPoints: [{ x: 1, z: 9 }, { x: 3, z: 9 }],
    },
    {
      id: 'm3_3',
      type: 'skeleton_brute',
      x: 13,
      z: 9,
      maxHp: 110,
      damage: 28,
      speed: 1.7,
      patrolPoints: [{ x: 13, z: 9 }, { x: 11, z: 9 }],
    },
  ],
};

export const BUILTIN_LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3];

// Generate Procedural Dungeon Level for levels 4+
export function generateProceduralLevel(levelNum: number): LevelConfig {
  const width = 15 + Math.min(10, Math.floor(levelNum * 2));
  const height = 15 + Math.min(10, Math.floor(levelNum * 2));
  
  // Initialize grid with all walls
  const grid: number[][] = Array.from({ length: height }, () => Array(width).fill(1));

  // Recursive backtracker maze generation
  const stack: { x: number; z: number }[] = [];
  grid[1][1] = 0;
  stack.push({ x: 1, z: 1 });

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors: { x: number; z: number; nx: number; nz: number }[] = [];

    const dirs = [
      { dx: 0, dz: -2 },
      { dx: 0, dz: 2 },
      { dx: -2, dz: 0 },
      { dx: 2, dz: 0 },
    ];

    for (const d of dirs) {
      const nx = current.x + d.dx;
      const nz = current.z + d.dz;
      if (nx > 0 && nx < width - 1 && nz > 0 && nz < height - 1 && grid[nz][nx] === 1) {
        neighbors.push({ x: nx, z: nz, nx: current.x + d.dx / 2, nz: current.z + d.dz / 2 });
      }
    }

    if (neighbors.length > 0) {
      const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
      grid[chosen.nz][chosen.nx] = 0;
      grid[chosen.z][chosen.x] = 0;
      stack.push({ x: chosen.x, z: chosen.z });
    } else {
      stack.pop();
    }
  }

  // Add some open rooms
  for (let i = 0; i < levelNum * 2; i++) {
    const rx = Math.floor(Math.random() * (width - 4)) + 2;
    const rz = Math.floor(Math.random() * (height - 4)) + 2;
    grid[rz][rx] = 0;
  }

  // Identify empty tiles
  const emptyTiles: { x: number; z: number }[] = [];
  for (let z = 1; z < height - 1; z++) {
    for (let x = 1; x < width - 1; x++) {
      if (grid[z][x] === 0 && !(x === 1 && z === 1)) {
        emptyTiles.push({ x, z });
      }
    }
  }

  // Shuffle empty tiles
  emptyTiles.sort(() => Math.random() - 0.5);

  const items: LevelConfig['items'] = [];
  const monsters: LevelConfig['monsters'] = [];

  // Exit portal far from start
  const exitTile = emptyTiles.pop() || { x: width - 2, z: height - 2 };
  items.push({ id: `exit_${levelNum}`, type: 'exit', x: exitTile.x, z: exitTile.z });

  // Key & Door
  const keyTile = emptyTiles.pop() || { x: width - 3, z: height - 3 };
  items.push({ id: `key_gold_${levelNum}`, type: 'key_gold', x: keyTile.x, z: keyTile.z });

  // Place door near exit
  items.push({
    id: `door_gold_${levelNum}`,
    type: 'door_gold',
    x: Math.max(1, exitTile.x - 1),
    z: exitTile.z,
    keyRequired: 'gold',
  });

  // Coins & Chests
  const numCoins = 8 + levelNum * 2;
  for (let i = 0; i < numCoins && emptyTiles.length > 0; i++) {
    const tile = emptyTiles.pop()!;
    items.push({ id: `coin_${levelNum}_${i}`, type: 'coin', x: tile.x, z: tile.z });
  }

  const numChests = 2 + Math.floor(levelNum / 2);
  for (let i = 0; i < numChests && emptyTiles.length > 0; i++) {
    const tile = emptyTiles.pop()!;
    items.push({ id: `chest_${levelNum}_${i}`, type: 'chest', x: tile.x, z: tile.z, coinsCount: 30 + levelNum * 10 });
  }

  // Traps
  const numTraps = 3 + levelNum;
  for (let i = 0; i < numTraps && emptyTiles.length > 0; i++) {
    const tile = emptyTiles.pop()!;
    const type = Math.random() > 0.5 ? 'trap_spikes' : 'trap_fire';
    items.push({ id: `trap_${levelNum}_${i}`, type, x: tile.x, z: tile.z });
  }

  // Monsters
  const numMonsters = 3 + Math.floor(levelNum * 1.5);
  for (let i = 0; i < numMonsters && emptyTiles.length > 0; i++) {
    const tile = emptyTiles.pop()!;
    const isBrute = Math.random() < 0.35;
    monsters.push({
      id: `m_${levelNum}_${i}`,
      type: isBrute ? 'skeleton_brute' : 'skeleton_warrior',
      x: tile.x,
      z: tile.z,
      maxHp: isBrute ? 80 + levelNum * 15 : 35 + levelNum * 10,
      damage: isBrute ? 20 + levelNum * 3 : 10 + levelNum * 2,
      speed: isBrute ? 1.6 : 2.0,
      patrolPoints: [
        { x: tile.x, z: tile.z },
        { x: Math.min(width - 2, tile.x + (Math.random() > 0.5 ? 2 : -2)), z: tile.z },
      ],
    });
  }

  const themes: ('dungeon' | 'crypt' | 'inferno' | 'mossy')[] = ['dungeon', 'crypt', 'inferno', 'mossy'];
  const theme = themes[(levelNum - 1) % themes.length];

  return {
    id: levelNum,
    name: `Floor ${levelNum}: Catacombs of Doom`,
    subtitle: `Procedurally generated labyrinth floor. Find the Gold Key to reach the exit portal.`,
    width,
    height,
    grid,
    playerStart: { x: 1, z: 1 },
    theme,
    ambientColor: theme === 'inferno' ? 0x330d00 : 0x111122,
    fogColor: theme === 'inferno' ? 0x1a0500 : 0x080812,
    fogDensity: 0.07,
    items,
    monsters,
  };
}
