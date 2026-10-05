'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export interface Key3DProps {
  id: string;
  label: string;
  x: number;
  z: number;
  w?: number;
  pressed: boolean;
  hint?: boolean;
  lit?: boolean;
  errorFlash?: boolean;
  dim?: boolean;
}

const ACCENT = new THREE.Color('#FFFFFF');
const ERROR_RED = new THREE.Color('#FF4D4D');
const BASE_Y = 0;
const PRESSED_Y = -0.16;
const DOWN_SPEED = 0.16 / 0.05;
const UP_SPEED = 0.16 / 0.08;
const SHAKE_DURATION = 0.1;
const SHAKE_AMPLITUDE = 0.05;
const SHAKE_OSCILLATIONS = 3;

let sharedGeometry: THREE.BoxGeometry | null = null;
function getSharedGeometry(): THREE.BoxGeometry {
  if (!sharedGeometry) {
    sharedGeometry = new THREE.BoxGeometry(0.9, 0.25, 0.9);
  }
  return sharedGeometry;
}

/**
 * Single 3D keycap. Press animation is driven inside `useFrame` with refs
 * only (no React re-render per frame): linear move to -0.16 in 50ms down,
 * 80ms release. Error triggers a 100ms x-shake instead of a plain dip.
 */
export function Key3D({
  id,
  label,
  x,
  z,
  w = 0.9,
  pressed,
  hint = false,
  lit = false,
  errorFlash = false,
  dim = false,
}: Key3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const pressedRef = useRef(pressed);
  const errorRef = useRef(errorFlash);
  const errorStartRef = useRef(-1);
  useEffect(() => {
    pressedRef.current = pressed;
  }, [pressed]);
  useEffect(() => {
    errorRef.current = errorFlash;
  }, [errorFlash]);

  const geometry = useMemo(() => getSharedGeometry(), []);
  const scaleX = w / 0.9;

  const baseColor = useMemo(
    () => new THREE.Color(dim ? '#0D0D0D' : '#1C1C1C'),
    [dim],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const isPressed = pressedRef.current;
    const target = isPressed ? PRESSED_Y : BASE_Y;
    const speed = isPressed ? DOWN_SPEED : UP_SPEED;
    const y = group.position.y;
    // Linear move toward target: full dip in 50ms down, 80ms release.
    group.position.y =
      y < target
        ? Math.min(y + speed * delta, target)
        : Math.max(y - speed * delta, target);

    if (errorRef.current && errorStartRef.current < 0) {
      errorStartRef.current = state.clock.elapsedTime;
    }
    if (errorStartRef.current >= 0) {
      const t =
        (state.clock.elapsedTime - errorStartRef.current) / SHAKE_DURATION;
      if (t >= 1) {
        group.position.x = x;
        if (errorRef.current) errorStartRef.current = state.clock.elapsedTime;
        else errorStartRef.current = -1;
      } else {
        group.position.x =
          x +
          Math.sin(t * SHAKE_OSCILLATIONS * Math.PI * 2) *
            SHAKE_AMPLITUDE *
            (1 - t);
      }
    } else if (group.position.x !== x) {
      group.position.x = x;
    }

    const mat = matRef.current;
    if (mat) {
      if (errorRef.current) {
        mat.emissive.copy(ERROR_RED);
        mat.emissiveIntensity = 0.9;
      } else if (isPressed || hint) {
        mat.emissive.copy(ACCENT);
        mat.emissiveIntensity = isPressed ? 0.9 : 0.55;
      } else if (lit) {
        mat.emissive.copy(ACCENT);
        mat.emissiveIntensity = 0.8;
      } else {
        mat.emissiveIntensity = 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={[x, 0, z]} name={id}>
      <mesh geometry={geometry} scale={[scaleX, 1, 1]}>
        <meshStandardMaterial
          ref={matRef}
          color={baseColor}
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>
      <Text
        position={[0, 0.14, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={label.length > 1 ? 0.18 : 0.28}
        color={dim ? '#555555' : '#FFFFFF'}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

export default Key3D;
