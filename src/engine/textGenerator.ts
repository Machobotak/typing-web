import type { Lang, Mode } from "@/types/typing";
import enData from "@/data/en/words.json";
import idData from "@/data/id/words.json";

const FALLBACK = "type to begin ".repeat(50).trim();
const TIME_BUFFER_WORDS = 200;

function wordList(lang: Lang): string[] {
  const data = lang === "id" ? idData : enData;
  const words = (data as { words?: unknown } | null | undefined)?.words;
  if (!Array.isArray(words)) return [];
  return words.filter((w): w is string => typeof w === "string" && w.length > 0);
}

function shuffled<T>(items: T[]): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

function buffer(lang: Lang, count: number): string {
  const words = shuffled(wordList(lang));
  if (words.length === 0) return FALLBACK;
  return words.slice(0, count).join(" ");
}

export function generateText(lang: Lang, mode: Mode): string {
  if (mode.kind === "words") return buffer(lang, mode.count);
  return buffer(lang, TIME_BUFFER_WORDS);
}

export function extendText(current: string, lang: Lang): string {
  const extra = buffer(lang, TIME_BUFFER_WORDS);
  if (!current) return extra;
  if (!extra) return current;
  return `${current} ${extra}`;
}
