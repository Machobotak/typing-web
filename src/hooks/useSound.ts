"use client";

import { useEffect } from "react";
import { audioManager } from "@/components/audio/AudioManager";

export type VolumeStep = 0 | 25 | 50 | 75 | 100;

/** Binds sound toggle + volume step to the synth audio manager. */
export function useSound(enabled: boolean, step: VolumeStep): void {
  useEffect(() => {
    audioManager.unlock();
  }, []);

  useEffect(() => {
    audioManager.setEnabled(enabled);
    audioManager.setVolume01(step / 100);
  }, [enabled, step]);
}
