'use client';

import { OrbitControls } from '@react-three/drei';

export interface KeyboardControlsProps {
  reduceMotion?: boolean;
}

/**
 * The keyboard's resting camera pose. `Keyboard3D` fits the keycap layout from
 * exactly this pose, so the polar clamp below must contain `VIEW_POLAR`:
 * OrbitControls snaps the camera onto the clamp the moment it mounts, and a
 * snap would leave the fitted scale calibrated for a pose no longer in use.
 */
export const VIEW_TARGET: [number, number, number] = [0.625, 0, 1.1];
export const VIEW_ELEVATION = (65 * Math.PI) / 180;
export const VIEW_DISTANCE = 11.1;
/** Polar angle (from +Y) of the resting pose. */
export const VIEW_POLAR = Math.PI / 2 - VIEW_ELEVATION;

export const VIEW_POSITION: [number, number, number] = [
  VIEW_TARGET[0],
  VIEW_TARGET[1] + VIEW_DISTANCE * Math.sin(VIEW_ELEVATION),
  VIEW_TARGET[2] + VIEW_DISTANCE * Math.cos(VIEW_ELEVATION),
];

/**
 * Clamped orbit for the keyboard view: small azimuth/polar swing around the
 * resting pose, no panning, zoom pinned to a narrow band. The clamps are
 * expressed relative to `VIEW_POLAR` so they can never exclude it. When
 * `reduceMotion` is on, controls are omitted entirely and the camera stays
 * fixed.
 */
export function KeyboardControls({ reduceMotion = false }: KeyboardControlsProps) {
  if (reduceMotion) return null;
  return (
    <OrbitControls
      target={VIEW_TARGET}
      minAzimuthAngle={-0.4}
      maxAzimuthAngle={0.4}
      minPolarAngle={VIEW_POLAR - 0.18}
      maxPolarAngle={VIEW_POLAR + 0.22}
      enablePan={false}
      minDistance={VIEW_DISTANCE - 3}
      maxDistance={VIEW_DISTANCE + 3}
    />
  );
}

export default KeyboardControls;
