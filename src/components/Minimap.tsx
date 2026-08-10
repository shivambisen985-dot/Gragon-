import React, { useEffect, useRef } from 'react';
import { LevelConfig, Monster, PlayerStats } from '../types';
import { CELL_SIZE } from '../three/dungeonBuilder';

interface MinimapProps {
  level: LevelConfig;
  playerPos: { x: number; z: number };
  playerYaw: number;
  monsters: Monster[];
}

export const Minimap: React.FC<MinimapProps> = ({ level, playerPos, playerYaw, monsters }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const mapW = level.width;
    const mapH = level.height;
    const cellSize = Math.min(width / mapW, height / mapH);

    // Draw Background
    ctx.fillStyle = '#0f141a';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Tiles
    for (let r = 0; r < mapH; r++) {
      for (let c = 0; c < mapW; c++) {
        const tile = level.grid[r][c];
        const x = c * cellSize;
        const y = r * cellSize;

        if (tile === 1) {
          ctx.fillStyle = '#2d3748'; // Wall
          ctx.fillRect(x, y, cellSize, cellSize);
        } else if (tile === 3) {
          ctx.fillStyle = '#e53e3e'; // Lava
          ctx.fillRect(x, y, cellSize, cellSize);
        } else {
          ctx.fillStyle = '#1a202c'; // Floor
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeStyle = '#2d3748';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    }

    // Draw Items (Keys, Exit, Doors)
    for (const item of level.items) {
      if (item.collected || item.opened) continue;
      const x = item.x * cellSize + cellSize / 2;
      const y = item.z * cellSize + cellSize / 2;

      if (item.type.startsWith('key_')) {
        ctx.fillStyle = item.type.includes('gold') ? '#f6e05e' : item.type.includes('ruby') ? '#f56565' : '#e2e8f0';
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.type.startsWith('door_')) {
        ctx.fillStyle = item.type.includes('gold') ? '#ecc94b' : '#a0aec0';
        ctx.fillRect(x - cellSize * 0.4, y - cellSize * 0.2, cellSize * 0.8, cellSize * 0.4);
      } else if (item.type === 'exit') {
        ctx.fillStyle = '#4299e1';
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#63b3ed';
        ctx.stroke();
      }
    }

    // Draw Monsters (Radar Dots)
    for (const monster of monsters) {
      if (monster.hp <= 0) continue;
      const mx = (monster.x * CELL_SIZE + CELL_SIZE / 2) / CELL_SIZE * cellSize;
      const my = (monster.z * CELL_SIZE + CELL_SIZE / 2) / CELL_SIZE * cellSize;

      ctx.fillStyle = '#f56565';
      ctx.beginPath();
      ctx.arc(mx, my, cellSize * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Player Position & Orientation
    const px = (playerPos.x + CELL_SIZE / 2) / CELL_SIZE * cellSize;
    const py = (playerPos.z + CELL_SIZE / 2) / CELL_SIZE * cellSize;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-playerYaw);

    // Player Direction Arrow
    ctx.fillStyle = '#48bb78';
    ctx.beginPath();
    ctx.moveTo(0, -cellSize * 0.6);
    ctx.lineTo(cellSize * 0.4, cellSize * 0.4);
    ctx.lineTo(-cellSize * 0.4, cellSize * 0.4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }, [level, playerPos, playerYaw, monsters]);

  return (
    <div className="w-32 h-32 bg-black/60 border border-white/20 rounded-full relative overflow-hidden flex items-center justify-center backdrop-blur-xl shadow-2xl p-1">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
      <div className="w-full h-[1px] bg-red-500/30 absolute top-1/2 pointer-events-none" />
      <div className="h-full w-[1px] bg-red-500/30 absolute left-1/2 pointer-events-none" />
      <canvas ref={canvasRef} width={116} height={116} className="rounded-full" />
      <div className="text-[8px] font-bold uppercase absolute bottom-1.5 tracking-[0.2em] text-white/40 pointer-events-none">
        Radar Range
      </div>
    </div>
  );
};
