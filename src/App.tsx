import { useEffect, useRef, useState } from 'react';
import { GameState, GameSettings, LevelConfig, PlayerStats, Monster } from './types';
import { BUILTIN_LEVELS, generateProceduralLevel } from './dungeon/levelData';
import { GameEngine } from './three/gameEngine';
import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { PauseMenu } from './components/PauseMenu';
import { ShopModal } from './components/ShopModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { soundManager } from './audio/soundManager';

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [currentLevelConfig, setCurrentLevelConfig] = useState<LevelConfig>(BUILTIN_LEVELS[0]);

  const [stats, setStats] = useState<PlayerStats>({
    hp: 100,
    maxHp: 100,
    coins: 0,
    keys: { gold: 0, silver: 0, ruby: 0 },
    potions: 2,
    weaponDamage: 25,
    weaponName: 'Iron Shortsword',
    speedMultiplier: 1.0,
    defense: 0,
    torchRadius: 10,
    score: 0,
    monstersKilled: 0,
  });

  const [settings, setSettings] = useState<GameSettings>({
    cameraMode: 'first_person',
    soundVolume: 0.5,
    sfxVolume: 0.5,
    mouseSensitivity: 0.0025,
    showMinimap: true,
    touchControlsEnabled: true,
  });

  const [message, setMessage] = useState<string>('Welcome to Dungeon Escape!');
  const [playerPos, setPlayerPos] = useState<{ x: number; z: number }>({ x: 1, z: 1 });
  const [playerYaw, setPlayerYaw] = useState<number>(0);
  const [monsters, setMonsters] = useState<Monster[]>([]);

  // Update position sync interval for HUD minimap
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      if (engineRef.current) {
        setPlayerPos({ x: engineRef.current.playerPos.x, z: engineRef.current.playerPos.z });
        setPlayerYaw(engineRef.current.playerYaw);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [gameState]);

  // Start Level Engine
  const startLevel = (levelIdx: number, newRun: boolean = false) => {
    setCurrentLevelIdx(levelIdx);

    let level: LevelConfig;
    if (levelIdx < BUILTIN_LEVELS.length) {
      level = BUILTIN_LEVELS[levelIdx];
    } else {
      level = generateProceduralLevel(levelIdx + 1);
    }

    setCurrentLevelConfig(level);
    setMonsters(level.monsters.map((m) => ({ ...m, hp: m.maxHp, state: 'patrol', currentPatrolIdx: 0, attackCooldown: 0, lastAttackTime: 0, alerted: false })));

    let initialStats = stats;
    if (newRun) {
      initialStats = {
        hp: 100,
        maxHp: 100,
        coins: 0,
        keys: { gold: 0, silver: 0, ruby: 0 },
        potions: 2,
        weaponDamage: 25,
        weaponName: 'Iron Shortsword',
        speedMultiplier: 1.0,
        defense: 0,
        torchRadius: 10,
        score: 0,
        monstersKilled: 0,
      };
      setStats(initialStats);
    }

    setGameState('playing');

    // Timeout to ensure DOM container is rendered
    setTimeout(() => {
      if (containerRef.current) {
        if (engineRef.current) {
          engineRef.current.destroy();
        }

        const engine = new GameEngine(
          containerRef.current,
          {
            onStatsChange: (updatedStats) => setStats(updatedStats),
            onLevelComplete: () => setGameState('victory'),
            onGameOver: () => setGameState('gameover'),
            onMessage: (msg) => setMessage(msg),
          },
          initialStats
        );

        engine.cameraMode = settings.cameraMode;
        engine.mouseSensitivity = settings.mouseSensitivity;
        engine.loadLevel(level);

        engineRef.current = engine;
      }
    }, 50);
  };

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    soundManager.setVolume(newSettings.soundVolume);
    if (engineRef.current) {
      engineRef.current.cameraMode = newSettings.cameraMode;
      engineRef.current.mouseSensitivity = newSettings.mouseSensitivity;
    }
  };

  const handleToggleMute = () => {
    const newVol = settings.soundVolume > 0 ? 0 : 0.5;
    handleUpdateSettings({ ...settings, soundVolume: newVol });
  };

  const handleToggleCamera = () => {
    const newMode = settings.cameraMode === 'first_person' ? 'third_person' : 'first_person';
    handleUpdateSettings({ ...settings, cameraMode: newMode });
    if (engineRef.current) {
      engineRef.current.toggleCameraMode();
    }
  };

  const handleUsePotion = () => {
    if (engineRef.current) {
      engineRef.current.usePotion();
    }
  };

  const handleAttack = () => {
    if (engineRef.current) {
      engineRef.current.triggerAttack();
    }
  };

  const handleTouchMove = (dx: number, dz: number) => {
    if (engineRef.current) {
      engineRef.current.setTouchMove(dx, dz);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden font-sans select-none">
      
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Main Menu Overlay */}
      {gameState === 'menu' && (
        <MainMenu
          onStartGame={(levelIdx) => startLevel(levelIdx, true)}
          onOpenShop={() => setGameState('shop')}
        />
      )}

      {/* Active Playing HUD */}
      {gameState === 'playing' && (
        <HUD
          stats={stats}
          level={currentLevelConfig}
          settings={settings}
          playerPos={playerPos}
          playerYaw={playerYaw}
          monsters={monsters}
          message={message}
          onPause={() => setGameState('paused')}
          onUsePotion={handleUsePotion}
          onAttack={handleAttack}
          onToggleCamera={handleToggleCamera}
          onToggleMute={handleToggleMute}
          onTouchMove={handleTouchMove}
        />
      )}

      {/* Pause Menu Modal */}
      {gameState === 'paused' && (
        <PauseMenu
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResume={() => setGameState('playing')}
          onRestart={() => startLevel(currentLevelIdx, false)}
          onOpenShop={() => setGameState('shop')}
        />
      )}

      {/* Merchant Shop Modal */}
      {gameState === 'shop' && (
        <ShopModal
          stats={stats}
          onUpdateStats={(newStats) => {
            setStats(newStats);
            if (engineRef.current) {
              engineRef.current.playerStats = newStats;
            }
          }}
          onClose={() => setGameState('playing')}
        />
      )}

      {/* Victory Screen Modal */}
      {gameState === 'victory' && (
        <VictoryModal
          levelName={currentLevelConfig.name}
          stats={stats}
          onNextLevel={() => startLevel(currentLevelIdx + 1, false)}
          onOpenShop={() => setGameState('shop')}
        />
      )}

      {/* Game Over Screen Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          stats={stats}
          onRestart={() => startLevel(currentLevelIdx, true)}
          onOpenShop={() => setGameState('shop')}
        />
      )}

    </div>
  );
}
