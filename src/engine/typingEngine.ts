import type { CharState, TestStatus } from "@/types/typing";

export interface EngineState {
  text: string;
  index: number;
  states: CharState[];
  correctTyped: number;
  totalTyped: number;
  errors: number;
  status: TestStatus;
  startedAt: number | null;
}

export function createTest(text: string): EngineState {
  return {
    text,
    index: 0,
    states: new Array<CharState>(text.length).fill("pending"),
    correctTyped: 0,
    totalTyped: 0,
    errors: 0,
    status: "idle",
    startedAt: null,
  };
}

/**
 * Lowest index the caret may backspace to. A word is frozen the moment it has
 * been typed completely and correctly, so finished text cannot be erased; the
 * trailing space is frozen once it is typed too. The word currently being typed
 * stays freely editable, and a finished word that still holds a mistake is not
 * frozen, so the typo can be corrected.
 */
export function frozenFloor(state: EngineState): number {
  const text = state.text;
  const states = state.states;
  let floor = 0;
  let i = 0;
  while (i < text.length) {
    const space = text.indexOf(" ", i);
    const wordEnd = space === -1 ? text.length : space;
    if (state.index < wordEnd) break;
    let correct = true;
    for (let j = i; j < wordEnd; j++) {
      if (states[j] !== "correct") {
        correct = false;
        break;
      }
    }
    if (!correct) break;
    floor = wordEnd;
    if (space === -1 || state.index <= space) break;
    floor = space + 1;
    i = space + 1;
  }
  return floor;
}

export function handleKey(state: EngineState, key: string, nowSec: number): EngineState {
  if (state.status === "finished" || state.index >= state.text.length) return state;
  if (key === "Backspace") {
    const target = state.index - 1;
    if (target < frozenFloor(state)) return state;
    const prev = state.states[target];
    const states = state.states.slice();
    states[target] = "pending";
    if (prev !== "correct" && prev !== "incorrect") return { ...state, index: target, states };
    return {
      ...state,
      index: target,
      states,
      totalTyped: state.totalTyped - 1,
      correctTyped: prev === "correct" ? state.correctTyped - 1 : state.correctTyped,
      errors: prev === "incorrect" ? state.errors - 1 : state.errors,
    };
  }
  if (key.length !== 1) return state;
  const match = key === state.text[state.index];
  const states = state.states.slice();
  states[state.index] = match ? "correct" : "incorrect";
  return {
    ...state,
    index: state.index + 1,
    states,
    totalTyped: state.totalTyped + 1,
    correctTyped: match ? state.correctTyped + 1 : state.correctTyped,
    errors: match ? state.errors : state.errors + 1,
    status: "running",
    startedAt: state.status === "idle" ? nowSec : state.startedAt,
  };
}
