export function calcWPM(correctChars: number, elapsedSec: number): number {
  if (elapsedSec <= 0) return 0;
  return Math.round(((correctChars / 5) / (elapsedSec / 60)) * 10) / 10;
}

export function calcAccuracy(correct: number, total: number): number {
  if (!total) return 100;
  return Math.round(((correct / total) * 100) * 10) / 10;
}
