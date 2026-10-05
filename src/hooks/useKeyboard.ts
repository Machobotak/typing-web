'use client';

import { useCallback, useEffect, useState } from 'react';

const LETTER_RE = /^Key([A-Z])$/;
const DIGIT_RE = /^Digit([0-9])$/;

/**
 * Map a `KeyboardEvent.code` to a keyboard key id.
 * Letters/digits return their single char (`KeyX` -> `X`, `DigitN` -> `N`);
 * well-known codes return word ids; punctuation returns its single char.
 * Unknown codes return `null` (caller treats as no-op, never throws).
 */
export function codeToId(code: string): string | null {
  const letter = LETTER_RE.exec(code);
  if (letter) return letter[1];
  const digit = DIGIT_RE.exec(code);
  if (digit) return digit[1];

  switch (code) {
    case 'Space':
      return 'SPACE';
    case 'Backspace':
      return 'BACKSPACE';
    case 'Enter':
    case 'NumpadEnter':
      return 'ENTER';
    case 'ShiftLeft':
    case 'ShiftRight':
      return 'SHIFT';
    case 'Tab':
      return 'TAB';
    case 'CapsLock':
      return 'CAPS';
    case 'Escape':
      return 'ESC';
    case 'ControlLeft':
    case 'ControlRight':
      return 'CTRL';
    case 'AltLeft':
    case 'AltRight':
      return 'ALT';
    case 'Minus':
    case 'NumpadSubtract':
      return '-';
    case 'Equal':
      return '=';
    case 'BracketLeft':
      return '[';
    case 'BracketRight':
      return ']';
    case 'Semicolon':
      return ';';
    case 'Quote':
      return "'";
    case 'Backquote':
      return '`';
    case 'Backslash':
      return '\\';
    case 'Comma':
      return ',';
    case 'Period':
    case 'NumpadDecimal':
      return '.';
    case 'Slash':
    case 'NumpadDivide':
      return '/';
    case 'NumpadMultiply':
      return '*';
    case 'NumpadAdd':
      return '+';
    case 'Numpad0':
      return '0';
    case 'Numpad1':
      return '1';
    case 'Numpad2':
      return '2';
    case 'Numpad3':
      return '3';
    case 'Numpad4':
      return '4';
    case 'Numpad5':
      return '5';
    case 'Numpad6':
      return '6';
    case 'Numpad7':
      return '7';
    case 'Numpad8':
      return '8';
    case 'Numpad9':
      return '9';
    default:
      return null;
  }
}

export interface UseKeyboardResult {
  pressedIds: string[];
  press: (id: string) => void;
  release: (id: string) => void;
  hintId: string | null;
  setHintId: (id: string | null) => void;
  capsLock: boolean;
}

/**
 * Track pressed key ids in state (transitions only happen on key
 * events, never per animation frame). Also subscribes to window
 * keydown/keyup so releases are never missed, and clears on blur.
 * CapsLock is a toggle, not a held key, so its on/off state is read
 * from the OS via `getModifierState` and kept separately from
 * `pressedIds` (which only lives as long as the key is held).
 */
export function useKeyboard(): UseKeyboardResult {
  const [pressedIds, setPressedIds] = useState<string[]>([]);
  const [hintId, setHintId] = useState<string | null>(null);
  const [capsLock, setCapsLock] = useState(false);

  const press = useCallback((id: string) => {
    setPressedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const release = useCallback((id: string) => {
    setPressedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const id = codeToId(e.code);
      if (id !== null) press(id);
      setCapsLock(e.getModifierState('CapsLock'));
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const id = codeToId(e.code);
      if (id !== null) release(id);
      setCapsLock(e.getModifierState('CapsLock'));
    };
    const onBlur = () => {
      setPressedIds((prev) => (prev.length === 0 ? prev : []));
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [press, release]);

  return { pressedIds, press, release, hintId, setHintId, capsLock };
}
