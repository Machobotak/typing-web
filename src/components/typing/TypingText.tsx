"use client";

import type { CharState } from "@/types/typing";

interface TypingTextProps {
  chars: string[];
  states: CharState[];
  index: number;
}

const STATE_CLASSES: Record<CharState, string> = {
  pending: "text-secondary",
  current: "text-secondary",
  correct: "text-primary",
  incorrect:
    "text-incorrect underline decoration-wavy decoration-incorrect underline-offset-4",
};

export default function TypingText({ chars, states, index }: TypingTextProps) {
  return (
    <p
      aria-label="Typing text"
      className="font-mono text-2xl leading-relaxed tracking-normal whitespace-pre-wrap select-none text-center"
    >
      {chars.map((ch, i) => {
        const visual: CharState =
          i === index ? "current" : (states[i] ?? "pending");
        return (
          <span
            key={`${i}-${ch}`}
            data-state={visual}
            className={`relative ${STATE_CLASSES[visual]}`}
          >
            {i === index ? (
              <span
                data-caret="true"
                aria-hidden="true"
                className="absolute -left-px top-0 h-full w-[2px] bg-white"
              />
            ) : null}
            {ch}
          </span>
        );
      })}
    </p>
  );
}
