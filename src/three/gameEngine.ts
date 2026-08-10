import * as THREE from 'three';
import { DungeonItem, KeyColor, LevelConfig, Monster, PlayerStats } from '../types';
import { soundManager } from '../audio/soundManager';
import {
  buildChestMesh,
  buildCoinMesh,
  buildDoorMesh,
  buildExitMesh,
  buildFloorMesh,
  buildKeyMesh,
  buildPlayerSwordMesh,
  buildPotionMesh,
  buildSkeletonMesh,
  buildTorchMesh,
  buildTrapMesh,
  buildWallMesh,
  CELL_SIZE,
  createFloorMaterial,
  createWallMaterial,
  WALL_HEIGHT,
} from './dungeonBuilder';

export interface GameEngineCallbacks {
  onStatsChange: (stats: PlayerStats) => void;
  onLevelComplete: () => void;
  onGameOver: () => void;
  onMessage: (msg: string) => void;
}

export class GameEngine {
  private container: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private level: LevelConfig | null = null;
  private callbacks: GameEngineCallbacks;

  // Player State
  public playerStats: PlayerStats;
  public playerPos: THREE.Vector3 = new THREE.Vector3();
  public playerYaw: number = 0; // Rotation Y
  public playerPitch: number = 0; // Rotation X
  private isSprinting: boolean = false;
  private isAttacking: boolean = false;
  private attackProgress: number = 0;
  private lastFootstepTime: number = 0;
  private lastHurtTime: number = 0;

  // Camera Settings
  public cameraMode: 'first_person' | 'third_person' = 'first_person';
  public mouseSensitivity: number = 0.0025;

  // Objects in Scene
  private torchLights: { light: THREE.PointLight; baseIntensity: number }[] = [];
  private animatedItems: { mesh: THREE.Group; type: string; id: string; initialY: number }[] = [];
  private doorMeshes: Map<string, THREE.Group> = new Map();
  private chestLids: Map<string, THREE.Mesh> = new Map();
  private trapAnims: Map<string, { group: THREE.Group; parts: THREE.Object3D[]; timer: number; type: string }> = new Map();
  private monsterMeshes: Map<string, { group: THREE.Group; bones: Record<string, THREE.Object3D>; data: Monster }> = new Map();

  private playerTorchLight: THREE.PointLight;
  private weaponGroup: THREE.Group;
  private weaponBlade: THREE.Mesh;

  // Active Level Data
  private grid: number[][] = [];
  private activeItems: DungeonItem[] = [];
  private activeMonsters: Monster[] = [];

  // Input State
  private keysPressed: Record<string, boolean> = {};
  public isPointerLocked: boolean = false;
  private touchVector = { dx: 0, dz: 0 };
  private animationFrameId: number | null = null;
  private clock = new THREE.Clock();

  constructor(container: HTMLDivElement, callbacks: GameEngineCallbacks, initialStats?: PlayerStats) {
    this.container = container;
    this.callbacks = callbacks;

    this.playerStats = initialStats || {
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

    // Three.js Core
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 50);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // Player Light & Weapon
    this.playerTorchLight = new THREE.PointLight(0xffaa44, 1.8, this.playerStats.torchRadius);
    this.scene.add(this.playerTorchLight);

    const { group: wGroup, blade: wBlade } = buildPlayerSwordMesh();
    this.weaponGroup = wGroup;
    this.weaponBlade = wBlade;
    this.camera.add(this.weaponGroup);
    this.scene.add(this.camera);

    this.weaponGroup.position.set(0.35, -0.3, -0.5);
    this.weaponGroup.rotation.set(0.2, -0.3, 0);

    // Window Listeners
    window.addEventListener('resize', this.onResize);
    this.setupInputs();
  }

  public loadLevel(levelConfig: LevelConfig) {
    this.level = levelConfig;
    this.grid = levelConfig.grid;
    this.activeItems = JSON.parse(JSON.stringify(levelConfig.items));
    this.activeMonsters = levelConfig.monsters.map((m) => ({
      ...m,
      hp: m.maxHp,
      state: 'patrol',
      currentPatrolIdx: 0,
      attackCooldown: 0,
      lastAttackTime: 0,
      alerted: false,
    }));

    // Clear old scene
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    this.scene.add(this.camera);
    this.torchLights = [];
    this.animatedItems = [];
    this.doorMeshes.clear();
    this.chestLids.clear();
    this.trapAnims.clear();
    this.monsterMeshes.clear();

    // Scene Environment
    this.scene.background = new THREE.Color(levelConfig.fogColor);
    this.scene.fog = new THREE.FogExp2(levelConfig.fogColor, levelConfig.fogDensity);

    const ambientLight = new THREE.AmbientLight(levelConfig.ambientColor, 1.2);
    this.scene.add(ambientLight);

    const wallMat = createWallMaterial(levelConfig.theme);
    const floorMat = createFloorMaterial(levelConfig.theme);

    // Build Grid Geometry
    for (let r = 0; r < levelConfig.height; r++) {
      for (let c = 0; c < levelConfig.width; c++) {
        const tile = this.grid[r][c];

        if (tile === 1) {
          // Wall
          const wall = buildWallMesh(c, r, wallMat);
          this.scene.add(wall);
        } else {
          // Floor
          const isLava = tile === 3;
          const floor = buildFloorMesh(c, r, floorMat, isLava);
          this.scene.add(floor);

          // Random Torch placement on walls next to floor
          if (tile === 0 && Math.random() < 0.15) {
            let side: 'north' | 'south' | 'east' | 'west' | null = null;
            if (r > 0 && this.grid[r - 1][c] === 1) side = 'north';
            else if (r < levelConfig.height - 1 && this.grid[r + 1][c] === 1) side = 'south';
            else if (c > 0 && this.grid[r][c - 1] === 1) side = 'west';
            else if (c < levelConfig.width - 1 && this.grid[r][c + 1] === 1) side = 'east';

            if (side) {
              const { group: torch, light } = buildTorchMesh(c, r, side);
              this.scene.add(torch);
              this.torchLights.push({ light, baseIntensity: light.intensity });
            }
          }
        }
      }
    }

    // Spawn Items
    for (const item of this.activeItems) {
      const posX = item.x * CELL_SIZE;
      const posZ = item.z * CELL_SIZE;

      if (item.type.startsWith('key_')) {
        const keyColor = item.type.replace('key_', '') as KeyColor;
        const keyMesh = buildKeyMesh(keyColor);
        keyMesh.position.set(posX, 0.6, posZ);
        this.scene.add(keyMesh);
        this.animatedItems.push({ mesh: keyMesh, type: item.type, id: item.id, initialY: 0.6 });
      } else if (item.type === 'coin') {
        const coinMesh = buildCoinMesh();
        coinMesh.position.set(posX, 0.5, posZ);
        this.scene.add(coinMesh);
        this.animatedItems.push({ mesh: coinMesh, type: 'coin', id: item.id, initialY: 0.5 });
      } else if (item.type === 'potion') {
        const potionMesh = buildPotionMesh();
        potionMesh.position.set(posX, 0.4, posZ);
        this.scene.add(potionMesh);
        this.animatedItems.push({ mesh: potionMesh, type: 'potion', id: item.id, initialY: 0.4 });
      } else if (item.type.startsWith('door_')) {
        const doorMesh = buildDoorMesh(item.type, item.keyRequired);
        doorMesh.position.set(posX, WALL_HEIGHT / 2, posZ);
        this.scene.add(doorMesh);
        this.doorMeshes.set(item.id, doorMesh);
      } else if (item.type === 'chest') {
        const { group: chestGroup, lid } = buildChestMesh();
        chestGroup.position.set(posX, 0, posZ);
        this.scene.add(chestGroup);
        this.chestLids.set(item.id, lid);
      } else if (item.type.startsWith('trap_')) {
        const trapType = item.type as 'trap_spikes' | 'trap_fire';
        const { group: trapGroup, animatedParts } = buildTrapMesh(trapType);
        trapGroup.position.set(posX, 0, posZ);
        this.scene.add(trapGroup);
        this.trapAnims.set(item.id, { group: trapGroup, parts: animatedParts, timer: Math.random() * 2, type: trapType });
      } else if (item.type === 'exit') {
        const exitMesh = buildExitMesh();
        exitMesh.position.set(posX, 0, posZ);
        this.scene.add(exitMesh);
        this.animatedItems.push({ mesh: exitMesh, type: 'exit', id: item.id, initialY: 0 });
      }
    }

    // Spawn Monsters
    for (const monster of this.activeMonsters) {
      const { group: mGroup, bones } = buildSkeletonMesh(monster.type);
      mGroup.position.set(monster.x * CELL_SIZE, 0, monster.z * CELL_SIZE);
      this.scene.add(mGroup);
      this.monsterMeshes.set(monster.id, { group: mGroup, bones, data: monster });
    }

    // Set Player Spawn
    this.playerPos.set(levelConfig.playerStart.x * CELL_SIZE, 1.4, levelConfig.playerStart.z * CELL_SIZE);
    this.playerYaw = 0;
    this.playerPitch = 0;
    this.updateCamera();

    soundManager.startAmbient();
    this.callbacks.onMessage(`Entered ${levelConfig.name}! ${levelConfig.subtitle}`);
    this.startLoop();
  }

  private setupInputs() {
    window.addEventListener('keydown', (e) => {
      this.keysPressed[e.code] = true;

      // Number keys for potions
      if (e.code === 'KeyE' || e.code === 'Digit1') {
        this.usePotion();
      }
      if (e.code === 'Space') {
        this.triggerAttack();
      }
      if (e.code === 'KeyV') {
        this.toggleCameraMode();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.code] = false;
    });

    // Pointer lock for smooth mouse look
    this.container.addEventListener('click', () => {
      if (!this.isPointerLocked) {
        this.container.requestPointerLock?.();
      } else {
        this.triggerAttack();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.container;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        this.playerYaw -= e.movementX * this.mouseSensitivity;
        this.playerPitch -= e.movementY * this.mouseSensitivity;
        this.playerPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.playerPitch));
      }
    });
  }

  public setTouchMove(dx: number, dz: number) {
    this.touchVector = { dx, dz };
  }

  public toggleCameraMode() {
    this.cameraMode = this.cameraMode === 'first_person' ? 'third_person' : 'first_person';
    if (this.cameraMode === 'first_person') {
      this.weaponGroup.visible = true;
    } else {
      this.weaponGroup.visible = false;
    }
  }

  public triggerAttack() {
    if (this.isAttacking) return;
    this.isAttacking = true;
    this.attackProgress = 0;
    soundManager.playSwordSwing();

    // Check hit cone in front of player
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerYaw);
    const attackRange = 2.2;

    let hitCount = 0;
    this.monsterMeshes.forEach(({ group: mGroup, data: monster }) => {
      if (monster.hp <= 0) return;

      const mPos = mGroup.position;
      const dist = this.playerPos.distanceTo(mPos);

      if (dist <= attackRange) {
        const toMonster = new THREE.Vector3().subVectors(mPos, this.playerPos).normalize();
        const angle = forward.angleTo(toMonster);

        if (angle < Math.PI / 3) {
          // HIT!
          hitCount++;
          const dmg = this.playerStats.weaponDamage + Math.floor(Math.random() * 5);
          monster.hp -= dmg;
          monster.alerted = true;
          monster.state = 'chase';
          soundManager.playHit();

          if (monster.hp <= 0) {
            monster.hp = 0;
            monster.state = 'dead';
            this.playerStats.coins += 15;
            this.playerStats.score += 100;
            this.playerStats.monstersKilled++;
            this.callbacks.onStatsChange({ ...this.playerStats });
            this.callbacks.onMessage(`Vanquished ${monster.type.replace('_', ' ')}! (+15 Coins)`);

            // Collapse skeleton bones animation
            mGroup.position.y = -0.5;
            mGroup.rotation.x = Math.PI / 2;
          } else {
            this.callbacks.onMessage(`Hit skeleton for ${dmg} DMG! (${monster.hp}/${monster.maxHp} HP)`);
          }
        }
      }
    });
  }

  public usePotion() {
    if (this.playerStats.potions > 0 && this.playerStats.hp < this.playerStats.maxHp) {
      this.playerStats.potions--;
      this.playerStats.hp = Math.min(this.playerStats.maxHp, this.playerStats.hp + 40);
      soundManager.playPotion();
      this.callbacks.onStatsChange({ ...this.playerStats });
      this.callbacks.onMessage(`Drank Health Potion! Restored 40 HP.`);
    }
  }

  private startLoop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const animate = () => {
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      this.updatePlayerMovement(delta);
      this.updateMonsters(delta);
      this.updateTrapsAndItems(delta, elapsed);
      this.updateWeaponAnimation(delta);
      this.updateLights(elapsed);
      this.updateCamera();

      this.renderer.render(this.scene, this.camera);
      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  private updatePlayerMovement(delta: number) {
    if (this.playerStats.hp <= 0) return;

    let moveX = 0;
    let moveZ = 0;

    if (this.keysPressed['KeyW'] || this.keysPressed['ArrowUp']) moveZ -= 1;
    if (this.keysPressed['KeyS'] || this.keysPressed['ArrowDown']) moveZ += 1;
    if (this.keysPressed['KeyA'] || this.keysPressed['ArrowLeft']) moveX -= 1;
    if (this.keysPressed['KeyD'] || this.keysPressed['ArrowRight']) moveX += 1;

    // Apply Touch Controls
    if (this.touchVector.dx !== 0 || this.touchVector.dz !== 0) {
      moveX = this.touchVector.dx;
      moveZ = this.touchVector.dz;
    }

    this.isSprinting = !!this.keysPressed['ShiftLeft'] || !!this.keysPressed['ShiftRight'];
    const speed = (this.isSprinting ? 5.2 : 3.5) * this.playerStats.speedMultiplier;

    if (moveX !== 0 || moveZ !== 0) {
      const dir = new THREE.Vector3(moveX, 0, moveZ).normalize();
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerYaw);

      const nextPosX = this.playerPos.x + dir.x * speed * delta;
      const nextPosZ = this.playerPos.z + dir.z * speed * delta;

      // Wall collision check
      if (this.canMoveTo(nextPosX, this.playerPos.z)) {
        this.playerPos.x = nextPosX;
      }
      if (this.canMoveTo(this.playerPos.x, nextPosZ)) {
        this.playerPos.z = nextPosZ;
      }

      // Footstep SFX
      const footstepInterval = this.isSprinting ? 0.3 : 0.45;
      if (this.clock.getElapsedTime() - this.lastFootstepTime > footstepInterval) {
        soundManager.playFootstep();
        this.lastFootstepTime = this.clock.getElapsedTime();
      }
    }

    // Check Lava floor damage
    const gridC = Math.floor((this.playerPos.x + CELL_SIZE / 2) / CELL_SIZE);
    const gridR = Math.floor((this.playerPos.z + CELL_SIZE / 2) / CELL_SIZE);
    if (this.grid[gridR] && this.grid[gridR][gridC] === 3) {
      this.damagePlayer(15 * delta, 'Lava Pit');
    }
  }

  private canMoveTo(x: number, z: number): boolean {
    const radius = 0.4;
    const checkPoints = [
      { x: x - radius, z: z - radius },
      { x: x + radius, z: z - radius },
      { x: x - radius, z: z + radius },
      { x: x + radius, z: z + radius },
    ];

    for (const pt of checkPoints) {
      const col = Math.floor((pt.x + CELL_SIZE / 2) / CELL_SIZE);
      const row = Math.floor((pt.z + CELL_SIZE / 2) / CELL_SIZE);

      if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) {
        return false;
      }

      if (this.grid[row][col] === 1) {
        return false; // Solid wall
      }

      // Check locked door collisions
      for (const item of this.activeItems) {
        if (item.type.startsWith('door_') && !item.opened) {
          if (item.x === col && item.z === row) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private updateMonsters(delta: number) {
    this.monsterMeshes.forEach(({ group: mGroup, bones, data: monster }) => {
      if (monster.hp <= 0) return;

      const mPos = mGroup.position;
      const distToPlayer = mPos.distanceTo(this.playerPos);

      // Detection & Chase logic
      if (distToPlayer < 6.5) {
        if (!monster.alerted) {
          monster.alerted = true;
          soundManager.playMonsterAlert();
          this.callbacks.onMessage(`A ${monster.type.replace('_', ' ')} spotted you!`);
        }
        monster.state = 'chase';
      }

      if (monster.state === 'chase') {
        // Move towards player
        const dir = new THREE.Vector3().subVectors(this.playerPos, mPos).normalize();
        mGroup.lookAt(this.playerPos.x, mPos.y, this.playerPos.z);

        if (distToPlayer > 1.3) {
          mPos.x += dir.x * monster.speed * delta;
          mPos.z += dir.z * monster.speed * delta;

          // Leg swing walking animation
          const swing = Math.sin(this.clock.getElapsedTime() * 8) * 0.4;
          if (bones.legL) bones.legL.rotation.x = swing;
          if (bones.legR) bones.legR.rotation.x = -swing;
        } else {
          // Attack range!
          const now = this.clock.getElapsedTime();
          if (now - monster.lastAttackTime > 1.5) {
            monster.lastAttackTime = now;
            this.damagePlayer(monster.damage, monster.type.replace('_', ' '));

            // Arm attack animation
            if (bones.armR) {
              bones.armR.rotation.x = -Math.PI / 2;
              setTimeout(() => {
                if (bones.armR) bones.armR.rotation.x = 0;
              }, 300);
            }
          }
        }
      } else if (monster.state === 'patrol' && monster.patrolPoints.length > 0) {
        const target = monster.patrolPoints[monster.currentPatrolIdx];
        const targetVec = new THREE.Vector3(target.x * CELL_SIZE, 0, target.z * CELL_SIZE);
        const distToTarget = mPos.distanceTo(targetVec);

        if (distToTarget < 0.3) {
          monster.currentPatrolIdx = (monster.currentPatrolIdx + 1) % monster.patrolPoints.length;
        } else {
          const dir = new THREE.Vector3().subVectors(targetVec, mPos).normalize();
          mGroup.lookAt(targetVec.x, mPos.y, targetVec.z);
          mPos.x += dir.x * (monster.speed * 0.6) * delta;
          mPos.z += dir.z * (monster.speed * 0.6) * delta;

          const swing = Math.sin(this.clock.getElapsedTime() * 5) * 0.3;
          if (bones.legL) bones.legL.rotation.x = swing;
          if (bones.legR) bones.legR.rotation.x = -swing;
        }
      }
    });
  }

  private damagePlayer(amount: number, source: string) {
    const now = this.clock.getElapsedTime();
    if (now - this.lastHurtTime < 0.4) return; // Invulnerability window
    this.lastHurtTime = now;

    const netDamage = Math.max(1, amount - this.playerStats.defense);
    this.playerStats.hp -= netDamage;
    soundManager.playPlayerHurt();

    this.callbacks.onStatsChange({ ...this.playerStats });
    this.callbacks.onMessage(`Took ${Math.round(netDamage)} damage from ${source}!`);

    if (this.playerStats.hp <= 0) {
      this.playerStats.hp = 0;
      soundManager.playGameOver();
      this.callbacks.onGameOver();
    }
  }

  private updateTrapsAndItems(delta: number, elapsed: number) {
    // Animate items (keys, coins floating)
    for (const item of this.animatedItems) {
      if (item.type.startsWith('key_') || item.type === 'coin') {
        item.mesh.rotation.y += delta * 2;
        item.mesh.position.y = item.initialY + Math.sin(elapsed * 4) * 0.08;
      } else if (item.type === 'exit') {
        const beam = item.mesh.getObjectByName('portal_beam');
        if (beam) beam.rotation.y += delta * 1.5;
      }
    }

    // Traps animation & damage check
    this.trapAnims.forEach((trap, id) => {
      trap.timer += delta;
      const cycle = trap.timer % 3; // 3 second cycle

      if (trap.type === 'trap_spikes') {
        const spikesExtended = cycle > 1.8 && cycle < 2.8;
        trap.parts.forEach((spike) => {
          spike.position.y = spikesExtended ? 0.3 : -0.3;
        });

        if (spikesExtended) {
          const trapItem = this.activeItems.find((i) => i.id === id);
          if (trapItem) {
            const trapPos = new THREE.Vector3(trapItem.x * CELL_SIZE, 0, trapItem.z * CELL_SIZE);
            if (this.playerPos.distanceTo(trapPos) < 1.2) {
              soundManager.playTrap();
              this.damagePlayer(20, 'Spike Trap');
            }
          }
        }
      } else if (trap.type === 'trap_fire') {
        const fireActive = cycle > 1.2 && cycle < 2.5;
        trap.parts.forEach((flame) => {
          (flame as THREE.Mesh).material = new THREE.MeshBasicMaterial({
            color: 0xff3300,
            transparent: true,
            opacity: fireActive ? 0.85 : 0,
          });
        });

        if (fireActive) {
          const trapItem = this.activeItems.find((i) => i.id === id);
          if (trapItem) {
            const trapPos = new THREE.Vector3(trapItem.x * CELL_SIZE, 0, trapItem.z * CELL_SIZE);
            if (this.playerPos.distanceTo(trapPos) < 1.2) {
              soundManager.playTrap();
              this.damagePlayer(25 * delta, 'Fire Jet');
            }
          }
        }
      }
    });

    // Check item pickups & interactions
    for (const item of this.activeItems) {
      if (item.collected || item.opened) continue;

      const itemPos = new THREE.Vector3(item.x * CELL_SIZE, 0, item.z * CELL_SIZE);
      const dist = this.playerPos.distanceTo(itemPos);

      if (dist < 1.2) {
        if (item.type.startsWith('key_')) {
          item.collected = true;
          const color = item.type.replace('key_', '') as KeyColor;
          this.playerStats.keys[color] = (this.playerStats.keys[color] || 0) + 1;
          this.playerStats.score += 50;
          soundManager.playKey();

          // Hide mesh
          const animItem = this.animatedItems.find((a) => a.id === item.id);
          if (animItem) animItem.mesh.visible = false;

          this.callbacks.onStatsChange({ ...this.playerStats });
          this.callbacks.onMessage(`Found the ${color.toUpperCase()} Key!`);
        } else if (item.type === 'coin') {
          item.collected = true;
          this.playerStats.coins += 10;
          this.playerStats.score += 20;
          soundManager.playCoin();

          const animItem = this.animatedItems.find((a) => a.id === item.id);
          if (animItem) animItem.mesh.visible = false;

          this.callbacks.onStatsChange({ ...this.playerStats });
        } else if (item.type === 'potion') {
          item.collected = true;
          this.playerStats.potions += 1;
          soundManager.playPotion();

          const animItem = this.animatedItems.find((a) => a.id === item.id);
          if (animItem) animItem.mesh.visible = false;

          this.callbacks.onStatsChange({ ...this.playerStats });
          this.callbacks.onMessage(`Picked up Health Potion!`);
        } else if (item.type === 'chest') {
          item.opened = true;
          const coins = item.coinsCount || 30;
          this.playerStats.coins += coins;
          this.playerStats.score += 150;
          soundManager.playChestOpen();

          const lid = this.chestLids.get(item.id);
          if (lid) lid.rotation.x = -Math.PI / 2;

          this.callbacks.onStatsChange({ ...this.playerStats });
          this.callbacks.onMessage(`Opened Chest! Found +${coins} Gold Coins!`);
        } else if (item.type.startsWith('door_')) {
          const keyRequired = item.keyRequired || 'silver';
          if (this.playerStats.keys[keyRequired] > 0) {
            item.opened = true;
            this.playerStats.keys[keyRequired]--;
            soundManager.playDoorOpen();

            const doorMesh = this.doorMeshes.get(item.id);
            if (doorMesh) doorMesh.position.y = -WALL_HEIGHT; // Slide down into floor

            this.callbacks.onStatsChange({ ...this.playerStats });
            this.callbacks.onMessage(`Unlocked ${keyRequired.toUpperCase()} Door!`);
          } else {
            this.callbacks.onMessage(`Locked! Requires ${keyRequired.toUpperCase()} Key.`);
          }
        } else if (item.type === 'exit') {
          soundManager.playVictory();
          this.callbacks.onLevelComplete();
        }
      }
    }
  }

  private updateWeaponAnimation(delta: number) {
    if (this.isAttacking) {
      this.attackProgress += delta * 8;
      if (this.attackProgress >= Math.PI) {
        this.attackProgress = 0;
        this.isAttacking = false;
        this.weaponGroup.rotation.set(0.2, -0.3, 0);
      } else {
        const swing = Math.sin(this.attackProgress);
        this.weaponGroup.rotation.x = 0.2 + swing * 0.8;
        this.weaponGroup.rotation.z = swing * -0.6;
      }
    }
  }

  private updateLights(elapsed: number) {
    // Torch flicker
    this.torchLights.forEach(({ light, baseIntensity }) => {
      light.intensity = baseIntensity + Math.sin(elapsed * 12 + light.position.x) * 0.3 + (Math.random() - 0.5) * 0.2;
    });

    // Player torch position & light
    this.playerTorchLight.position.copy(this.playerPos);
    this.playerTorchLight.distance = this.playerStats.torchRadius;
  }

  private updateCamera() {
    if (this.cameraMode === 'first_person') {
      this.camera.position.copy(this.playerPos);
      this.camera.rotation.set(0, 0, 0);
      this.camera.rotation.y = this.playerYaw;
      this.camera.rotation.x = this.playerPitch;
    } else {
      // Third Person over-the-shoulder
      const offset = new THREE.Vector3(0, 1.8, 2.5);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerYaw);

      this.camera.position.copy(this.playerPos).add(offset);
      this.camera.lookAt(this.playerPos.x, this.playerPos.y + 0.8, this.playerPos.z);
    }
  }

  private onResize = () => {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  };

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    soundManager.stopAmbient();
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
