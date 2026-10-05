'use client';

import { useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Key3D } from './Key3D';
import { KeyboardControls, VIEW_POSITION } from './KeyboardControls';

export interface Keyboard3DProps {
  pressedIds: string[];
  hintId?: string | null;
  errorId?: string | null;
  capsLock?: boolean;
  force2d?: boolean;
}

const FIT_MARGIN = 0.95;

// BoxGeometry(0.9, 0.25, 0.9) from Key3D, and the label plane at y = 0.14.
const CAP_HALF_WIDTH = 0.45;
const CAP_HALF_DEPTH = 0.45;
const CAP_BOTTOM = -0.125;
const CAP_TOP = 0.14;

interface LayoutKey {
  id: string;
  label: string;
  x: number;
  z: number;
  w?: number;
  dim?: boolean;
}

function buildLayout(): LayoutKey[][] {
  const rows: LayoutKey[][] = [];
  const rowQ = 'QWERTYUIOP'.split('');
  const rowA = 'ASDFGHJKL'.split('');
  const rowZ = 'ZXCVBNM'.split('');

  rows.push(
    rowQ.map((ch, i) => ({ id: ch, label: ch, x: i - 4.5, z: 0 })),
  );
  rows.push(
    rowA.map((ch, i) => ({ id: ch, label: ch, x: i - 4 + 0.5, z: 1.1 })),
  );
  rows.push(
    rowZ.map((ch, i) => ({ id: ch, label: ch, x: i - 3 + 1.0, z: 2.2 })),
  );
  rows.push([
    { id: 'SHIFT', label: 'SHIFT', x: -4.5, z: 3.3, w: 2 },
    { id: 'SPACE', label: 'SPACE', x: 0, z: 3.3, w: 6 },
    { id: 'ENTER', label: 'ENTER', x: 4, z: 3.3, w: 1.5 },
    { id: 'BACKSPACE', label: 'BKSP', x: 5.75, z: 3.3, w: 2 },
  ]);
  rows.push([
    { id: 'ESC', label: 'ESC', x: -4, z: -1.1, dim: true },
    { id: 'TAB', label: 'TAB', x: -2, z: -1.1, dim: true },
    { id: 'CAPS', label: 'CAPS', x: 0, z: -1.1, dim: true },
    { id: 'CTRL', label: 'CTRL', x: 2, z: -1.1, dim: true },
    { id: 'ALT', label: 'ALT', x: 4, z: -1.1, dim: true },
  ]);
  return rows;
}

const LAYOUT: LayoutKey[][] = buildLayout();

function hasWebGL2(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return canvas.getContext('webgl2') !== null;
  } catch {
    return false;
  }
}

/**
 * Corners of every keycap box in keyboard space, used by `FitToView`. Sampling
 * the real keycaps rather than the layout bounding box matters: the bounding
 * box includes large empty corners (the notch left of ESC, right of SHIFT),
 * which would waste most of the fitted frame.
 */
const KEY_CORNERS: { x: number; y: number; z: number }[] = LAYOUT.flat().flatMap(
  (key) => {
    const corners: { x: number; y: number; z: number }[] = [];
    for (const dx of [-CAP_HALF_WIDTH, CAP_HALF_WIDTH]) {
      for (const dy of [CAP_BOTTOM, CAP_TOP]) {
        for (const dz of [-CAP_HALF_DEPTH, CAP_HALF_DEPTH]) {
          corners.push({
            x: key.x + dx * ((key.w ?? 0.9) / 0.9),
            y: dy,
            z: key.z + dz,
          });
        }
      }
    }
    return corners;
  },
);

/**
 * Fits the keycap layout to the viewport: scales the group until the projected
 * keycap extent fills `FIT_MARGIN`, and recenters it so the remaining margin is
 * split evenly instead of pooling. Both steps are fixed-point iterations under
 * perspective; they settle in a handful of frames, after which OrbitControls
 * orbiting/zooming stays under user control.
 */
function FitToView({ children }: { children: ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const settledRef = useRef(false);
  const camera = useThree((state) => state.camera);
  const corner = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const group = groupRef.current;
    if (!group || settledRef.current) return;
    const scale = group.scale.x;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const key of KEY_CORNERS) {
      const p = corner
        .set(key.x * scale, key.y * scale, key.z * scale)
        .add(group.position)
        .project(camera);
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
    const halfW = (maxX - minX) / 2;
    const halfH = (maxY - minY) / 2;
    if (!Number.isFinite(halfW) || !Number.isFinite(halfH) || halfW <= 0 || halfH <= 0) {
      settledRef.current = true;
      return;
    }
    const factor = Math.min(FIT_MARGIN / halfW, FIT_MARGIN / halfH);
    if (Math.abs(factor - 1) < 1e-3) {
      settledRef.current = true;
      return;
    }
    group.scale.multiplyScalar(factor);
    // Shift along the camera's screen axes by the world distance that maps to
    // the current screen-centre offset. m0/m5 are the projection matrix's x/y
    // focal scales, so this holds for any fov/aspect.
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    up.setFromMatrixColumn(camera.matrixWorld, 1);
    const m0 = camera.projectionMatrix.elements[0];
    const m5 = camera.projectionMatrix.elements[5];
    const depth = camera.position.distanceTo(group.position);
    const shiftX = (-((minX + maxX) / 2) * depth) / m0;
    const shiftY = (-((minY + maxY) / 2) * depth) / m5;
    group.position.addScaledVector(right, shiftX).addScaledVector(up, shiftY);
  });

  return <group ref={groupRef}>{children}</group>;
}
/**
 * 3D keyboard with a 2D button-grid fallback. Renders the 2D grid when
 * `force2d` is set or WebGL2 is unavailable; otherwise a single R3F Canvas
 * with code-built keycaps, press animations, and clamped orbit controls.
 */
export function Keyboard3D({
  pressedIds,
  hintId = null,
  errorId = null,
  capsLock = false,
  force2d = false,
}: Keyboard3DProps) {
  const [webgl2] = useState<boolean>(() => hasWebGL2());
  const [reduceMotion] = useState<boolean>(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const pressed = useMemo(() => new Set<string>(pressedIds), [pressedIds]);

  if (force2d || !webgl2) {
    return (
      <div
        className="flex h-full w-full flex-col justify-center gap-2"
        role="group"
        aria-label="Keyboard preview"
      >
        {LAYOUT.map((row, ri) => (
          <div key={ri} className="flex gap-2">
            {row.map((key) => {
              const isPressed = pressed.has(key.id);
              const isHint = hintId === key.id;
              const isError = errorId === key.id;
              const isLit = capsLock && key.id === 'CAPS';
              return (
                <button
                  key={key.id}
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  data-key={key.id}
                  data-pressed={isPressed}
                  data-hint={isHint}
                  // flex-grow carries the keycap width (SPACE = 6 units) so each
                  // row always spans the container, like the 3D fit does.
                  style={{ flexGrow: key.w ?? 0.9, flexBasis: 0 }}
                  className={[
                    'h-9 min-w-0 rounded-md border font-mono text-xs font-medium transition-transform duration-75',
                    isError
                      ? 'border-[#FF4D4D] bg-[#FF4D4D]/20 text-[#FF4D4D]'
                      : isPressed || isHint || isLit
                        ? 'border-white bg-white/15 text-white'
                        : key.dim
                          ? 'border-white/10 bg-white/5 text-[#555555]'
                          : 'border-white/10 bg-white/5 text-white',
                    isPressed ? 'translate-y-[4px]' : '',
                  ].join(' ')}
                >
                  {key.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: VIEW_POSITION, fov: 35 }}
      frameloop="always"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <FitToView>
        {LAYOUT.flat().map((key) => (
          <Key3D
            key={key.id}
            id={key.id}
            label={key.label}
            x={key.x}
            z={key.z}
            w={key.w ?? 0.9}
            pressed={pressed.has(key.id)}
            hint={hintId === key.id}
            lit={capsLock && key.id === 'CAPS'}
            errorFlash={errorId === key.id}
            dim={key.dim ?? false}
          />
        ))}
      </FitToView>
      <KeyboardControls reduceMotion={reduceMotion} />
    </Canvas>
  );
}

export default Keyboard3D;
