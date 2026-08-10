import * as THREE from 'three';
import { ItemType, KeyColor, MonsterType } from '../types';

export const CELL_SIZE = 3;
export const WALL_HEIGHT = 3.5;

// Shared Procedural Canvas Textures for realistic low-poly look without external asset loads
function createStoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = '#2d3238';
  ctx.fillRect(0, 0, 256, 256);

  // Draw brick pattern
  ctx.strokeStyle = '#181a1d';
  ctx.lineWidth = 4;

  const rows = 8;
  const cols = 4;
  const rowH = 256 / rows;
  const colW = 256 / cols;

  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * rowH);
    ctx.lineTo(256, r * rowH);
    ctx.stroke();

    const offset = (r % 2) * (colW / 2);
    for (let c = 0; c <= cols + 1; c++) {
      ctx.beginPath();
      ctx.moveTo(c * colW - offset, r * rowH);
      ctx.lineTo(c * colW - offset, (r + 1) * rowH);
      ctx.stroke();
    }
  }

  // Add random speckles/noise
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const val = Math.floor(Math.random() * 50);
    ctx.fillStyle = `rgba(${val}, ${val}, ${val}, 0.15)`;
    ctx.fillRect(x, y, 3, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e2124';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#111315';
  ctx.lineWidth = 3;

  // Grid tiles
  const size = 64;
  for (let x = 0; x <= 256; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  // Noise
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const val = Math.floor(Math.random() * 40);
    ctx.fillStyle = `rgba(${val}, ${val}, ${val}, 0.12)`;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

const stoneTex = createStoneTexture();
const floorTex = createFloorTexture();

// Materials
export function createWallMaterial(theme: string = 'dungeon'): THREE.Material {
  let color = 0x5a626a;
  if (theme === 'crypt') color = 0x424950;
  if (theme === 'inferno') color = 0x5a3228;
  if (theme === 'mossy') color = 0x3b4a3e;

  const mat = new THREE.MeshStandardMaterial({
    color,
    map: stoneTex,
    roughness: 0.85,
    metalness: 0.1,
  });
  return mat;
}

export function createFloorMaterial(theme: string = 'dungeon'): THREE.Material {
  let color = 0x34383d;
  if (theme === 'crypt') color = 0x22262a;
  if (theme === 'inferno') color = 0x3d2218;
  if (theme === 'mossy') color = 0x28362b;

  return new THREE.MeshStandardMaterial({
    color,
    map: floorTex,
    roughness: 0.9,
    metalness: 0.05,
  });
}

// Build Wall Mesh
export function buildWallMesh(x: number, z: number, material: THREE.Material): THREE.Mesh {
  const geo = new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT, CELL_SIZE);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x * CELL_SIZE, WALL_HEIGHT / 2, z * CELL_SIZE);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Build Floor Mesh
export function buildFloorMesh(x: number, z: number, material: THREE.Material, isLava: boolean = false): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(CELL_SIZE, CELL_SIZE);
  geo.rotateX(-Math.PI / 2);

  let mat = material;
  if (isLava) {
    mat = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      emissive: 0xff2200,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
  }

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x * CELL_SIZE, 0, z * CELL_SIZE);
  mesh.receiveShadow = true;
  return mesh;
}

// Build Wall Torch
export function buildTorchMesh(x: number, z: number, side: 'north' | 'south' | 'east' | 'west'): { group: THREE.Group; light: THREE.PointLight } {
  const group = new THREE.Group();

  // Wood holder
  const holderGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.6, 8);
  const holderMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.9 });
  const holder = new THREE.Mesh(holderGeo, holderMat);
  holder.rotation.z = Math.PI / 6;

  // Metal bracket
  const bracketGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 8);
  const bracketMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
  const bracket = new THREE.Mesh(bracketGeo, bracketMat);
  bracket.position.y = 0.2;

  // Flame mesh
  const flameGeo = new THREE.ConeGeometry(0.12, 0.3, 8);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xff8800 });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.y = 0.4;
  flame.name = 'flame';

  group.add(holder);
  group.add(bracket);
  group.add(flame);

  // Position on wall
  const offset = CELL_SIZE / 2 - 0.1;
  let posX = x * CELL_SIZE;
  let posZ = z * CELL_SIZE;

  if (side === 'north') posZ -= offset;
  if (side === 'south') posZ += offset;
  if (side === 'east') posX += offset;
  if (side === 'west') posX -= offset;

  group.position.set(posX, WALL_HEIGHT * 0.6, posZ);

  // Point light
  const light = new THREE.PointLight(0xff7722, 1.8, 8, 1.5);
  light.position.set(0, 0.4, 0);
  light.castShadow = true;
  group.add(light);

  return { group, light };
}

// Build Door Mesh
export function buildDoorMesh(type: ItemType, keyColor?: KeyColor): THREE.Group {
  const group = new THREE.Group();

  let doorColor = 0x6b4423; // Wood
  let lightColor = 0xffaa00;

  if (keyColor === 'silver' || type === 'door_silver') {
    doorColor = 0x7f8c8d;
    lightColor = 0x3498db;
  } else if (keyColor === 'gold' || type === 'door_gold') {
    doorColor = 0xd4ac0d;
    lightColor = 0xf1c40f;
  } else if (keyColor === 'ruby' || type === 'door_ruby') {
    doorColor = 0xb03a2e;
    lightColor = 0xe74c3c;
  }

  // Frame
  const frameGeo = new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT, 0.3);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.8 });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  group.add(frame);

  // Door leaf
  const leafGeo = new THREE.BoxGeometry(CELL_SIZE * 0.85, WALL_HEIGHT * 0.85, 0.15);
  const leafMat = new THREE.MeshStandardMaterial({
    color: doorColor,
    roughness: 0.6,
    metalness: keyColor ? 0.6 : 0.2,
  });
  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.name = 'door_leaf';
  leaf.position.y = 0;
  group.add(leaf);

  // Glowing Keyhole lock
  const lockGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 12);
  const lockMat = new THREE.MeshStandardMaterial({
    color: lightColor,
    emissive: lightColor,
    emissiveIntensity: 0.8,
  });
  const lock = new THREE.Mesh(lockGeo, lockMat);
  lock.rotation.x = Math.PI / 2;
  lock.position.set(0, 0, 0.1);
  group.add(lock);

  return group;
}

// Build Chest Mesh
export function buildChestMesh(): { group: THREE.Group; lid: THREE.Mesh } {
  const group = new THREE.Group();

  // Base
  const baseGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x5c3818, roughness: 0.7 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.25;
  group.add(base);

  // Metal bands
  const bandGeo = new THREE.BoxGeometry(0.82, 0.52, 0.1);
  const bandMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.8, roughness: 0.3 });
  const band1 = new THREE.Mesh(bandGeo, bandMat);
  band1.position.set(0, 0.25, -0.2);
  const band2 = new THREE.Mesh(bandGeo, bandMat);
  band2.position.set(0, 0.25, 0.2);
  group.add(band1);
  group.add(band2);

  // Lid (Rotatable)
  const lidGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12, 1, false, 0, Math.PI);
  const lidMat = new THREE.MeshStandardMaterial({ color: 0x5c3818, roughness: 0.7 });
  const lid = new THREE.Mesh(lidGeo, lidMat);
  lid.rotation.z = Math.PI / 2;
  lid.position.set(0, 0.5, 0);
  lid.name = 'chest_lid';
  group.add(lid);

  return { group, lid };
}

// Build Key Mesh
export function buildKeyMesh(color: KeyColor): THREE.Group {
  const group = new THREE.Group();

  let matColor = 0xf1c40f;
  if (color === 'silver') matColor = 0xbdc3c7;
  if (color === 'ruby') matColor = 0xe74c3c;

  const mat = new THREE.MeshStandardMaterial({
    color: matColor,
    metalness: 0.9,
    roughness: 0.2,
    emissive: matColor,
    emissiveIntensity: 0.3,
  });

  // Ring top
  const ringGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 16);
  const ring = new THREE.Mesh(ringGeo, mat);
  ring.position.y = 0.3;

  // Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8);
  const shaft = new THREE.Mesh(shaftGeo, mat);
  shaft.position.y = 0.05;

  // Teeth
  const toothGeo = new THREE.BoxGeometry(0.1, 0.08, 0.025);
  const tooth = new THREE.Mesh(toothGeo, mat);
  tooth.position.set(0.05, -0.1, 0);

  group.add(ring);
  group.add(shaft);
  group.add(tooth);

  group.position.y = 0.6;
  return group;
}

// Build Coin Mesh
export function buildCoinMesh(): THREE.Group {
  const group = new THREE.Group();

  const geo = new THREE.CylinderGeometry(0.15, 0.15, 0.04, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xf1c40f,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0xf39c12,
    emissiveIntensity: 0.4,
  });

  const coin = new THREE.Mesh(geo, mat);
  coin.rotation.x = Math.PI / 2;
  group.add(coin);

  group.position.y = 0.5;
  return group;
}

// Build Health Potion
export function buildPotionMesh(): THREE.Group {
  const group = new THREE.Group();

  // Glass bottle
  const bottleGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const bottleMat = new THREE.MeshStandardMaterial({
    color: 0xe74c3c,
    emissive: 0xc0392b,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    transparent: true,
    opacity: 0.9,
  });
  const bottle = new THREE.Mesh(bottleGeo, bottleMat);
  bottle.position.y = 0.2;

  // Cork
  const corkGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8);
  const corkMat = new THREE.MeshStandardMaterial({ color: 0x8e5123 });
  const cork = new THREE.Mesh(corkGeo, corkMat);
  cork.position.y = 0.4;

  group.add(bottle);
  group.add(cork);
  group.position.y = 0.4;
  return group;
}

// Build Trap Mesh
export function buildTrapMesh(type: 'trap_spikes' | 'trap_fire'): { group: THREE.Group; animatedParts: THREE.Object3D[] } {
  const group = new THREE.Group();
  const animatedParts: THREE.Object3D[] = [];

  // Plate
  const plateGeo = new THREE.BoxGeometry(2, 0.05, 2);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.y = 0.025;
  group.add(plate);

  if (type === 'trap_spikes') {
    // Metal spikes
    const spikeGeo = new THREE.ConeGeometry(0.08, 0.6, 6);
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, metalness: 0.9 });

    for (let x = -0.6; x <= 0.6; x += 0.4) {
      for (let z = -0.6; z <= 0.6; z += 0.4) {
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(x, -0.3, z); // Start hidden below plate
        group.add(spike);
        animatedParts.push(spike);
      }
    }
  } else {
    // Fire jet grate
    const flameGeo = new THREE.ConeGeometry(0.3, 1.2, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 0.6;
    group.add(flame);
    animatedParts.push(flame);
  }

  return { group, animatedParts };
}

// Build Exit Staircase / Portal
export function buildExitMesh(): THREE.Group {
  const group = new THREE.Group();

  // Glowing base ring
  const ringGeo = new THREE.TorusGeometry(1.0, 0.12, 12, 32);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x3498db,
    emissive: 0x2980b9,
    emissiveIntensity: 1.0,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.1;
  group.add(ring);

  // Vertical swirling light beam
  const beamGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.5, 16, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x5dade2,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.y = 1.75;
  beam.name = 'portal_beam';
  group.add(beam);

  // Light
  const light = new THREE.PointLight(0x3498db, 2.5, 8);
  light.position.y = 1.5;
  group.add(light);

  return group;
}

// Build Skeleton Monster Mesh
export function buildSkeletonMesh(type: MonsterType): { group: THREE.Group; bones: Record<string, THREE.Object3D> } {
  const group = new THREE.Group();
  const bones: Record<string, THREE.Object3D> = {};

  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xdfdfdf,
    roughness: 0.7,
  });

  const scale = type === 'skeleton_brute' ? 1.4 : 1.0;

  // Skull
  const skullGeo = new THREE.BoxGeometry(0.35 * scale, 0.35 * scale, 0.35 * scale);
  const skull = new THREE.Mesh(skullGeo, boneMat);
  skull.position.y = 1.6 * scale;
  group.add(skull);
  bones.skull = skull;

  // Glowing red eyes
  const eyeGeo = new THREE.SphereGeometry(0.04 * scale, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.08 * scale, 1.62 * scale, 0.17 * scale);
  eyeR.position.set(0.08 * scale, 1.62 * scale, 0.17 * scale);
  group.add(eyeL);
  group.add(eyeR);

  // Ribcage / Spine
  const spineGeo = new THREE.CylinderGeometry(0.05 * scale, 0.05 * scale, 0.7 * scale, 8);
  const spine = new THREE.Mesh(spineGeo, boneMat);
  spine.position.y = 1.1 * scale;
  group.add(spine);

  const ribsGeo = new THREE.BoxGeometry(0.5 * scale, 0.4 * scale, 0.25 * scale);
  const ribs = new THREE.Mesh(ribsGeo, boneMat);
  ribs.position.y = 1.25 * scale;
  group.add(ribs);

  // Arms
  const armL = new THREE.Group();
  armL.position.set(-0.32 * scale, 1.35 * scale, 0);
  const armGeo = new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 0.6 * scale, 8);
  const armMeshL = new THREE.Mesh(armGeo, boneMat);
  armMeshL.position.y = -0.3 * scale;
  armL.add(armMeshL);
  group.add(armL);
  bones.armL = armL;

  const armR = new THREE.Group();
  armR.position.set(0.32 * scale, 1.35 * scale, 0);
  const armMeshR = new THREE.Mesh(armGeo, boneMat);
  armMeshR.position.y = -0.3 * scale;
  armR.add(armMeshR);

  // Weapon: Sword attached to Right Arm
  const swordGeo = new THREE.BoxGeometry(0.06 * scale, 0.9 * scale, 0.02 * scale);
  const swordMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6, metalness: 0.9 });
  const sword = new THREE.Mesh(swordGeo, swordMat);
  sword.position.set(0, -0.6 * scale, 0.2 * scale);
  sword.rotation.x = Math.PI / 3;
  armR.add(sword);

  group.add(armR);
  bones.armR = armR;

  // Legs
  const legL = new THREE.Group();
  legL.position.set(-0.15 * scale, 0.75 * scale, 0);
  const legGeo = new THREE.CylinderGeometry(0.05 * scale, 0.04 * scale, 0.75 * scale, 8);
  const legMeshL = new THREE.Mesh(legGeo, boneMat);
  legMeshL.position.y = -0.37 * scale;
  legL.add(legMeshL);
  group.add(legL);
  bones.legL = legL;

  const legR = new THREE.Group();
  legR.position.set(0.15 * scale, 0.75 * scale, 0);
  const legMeshR = new THREE.Mesh(legGeo, boneMat);
  legMeshR.position.y = -0.37 * scale;
  legR.add(legMeshR);
  group.add(legR);
  bones.legR = legR;

  return { group, bones };
}

// Build Player First-Person / Third-Person Weapon (Sword)
export function buildPlayerSwordMesh(): { group: THREE.Group; blade: THREE.Mesh } {
  const group = new THREE.Group();

  // Blade
  const bladeGeo = new THREE.BoxGeometry(0.06, 0.8, 0.02);
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0xecf0f1,
    metalness: 0.95,
    roughness: 0.1,
  });
  const blade = new THREE.Mesh(bladeGeo, bladeMat);
  blade.position.y = 0.4;
  group.add(blade);

  // Crossguard
  const guardGeo = new THREE.BoxGeometry(0.25, 0.04, 0.05);
  const guardMat = new THREE.MeshStandardMaterial({ color: 0xd4ac0d, metalness: 0.8 });
  const guard = new THREE.Mesh(guardGeo, guardMat);
  guard.position.y = 0.02;
  group.add(guard);

  // Handle
  const handleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.2, 8);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.position.y = -0.1;
  group.add(handle);

  return { group, blade };
}
