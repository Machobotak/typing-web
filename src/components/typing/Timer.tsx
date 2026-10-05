"use client";

interface TimerProps {
  elapsedSec: number;
}

export function formatTime(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${m}:${rest.toString().padStart(2, "0")}`;
}

export default function Timer({ elapsedSec }: TimerProps) {
  return (
    <span aria-label="Elapsed time" className="tabular-nums">
      {formatTime(elapsedSec)}
    </span>
  );
}
