"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import OptionGroup from "@/components/ui/OptionGroup";
import { loadSettings, saveSettings } from "@/lib/storage";
import type { AppSettings } from "@/types/typing";

const ON_OFF = [
  { value: "on", label: "on" },
  { value: "off", label: "off" },
];

const VOLUME_OPTIONS = [
  { value: "0", label: "0" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "75", label: "75" },
  { value: "100", label: "100" },
];

const RESTART_OPTIONS = [
  { value: "Tab", label: "tab" },
  { value: "Backslash", label: "\\" },
  { value: "Backquote", label: "`" },
  { value: "Delete", label: "delete" },
];
export default function SettingsPage() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  const update = (patch: Partial<AppSettings>) => {
    setSettings((s) => {
      const next = { ...s, ...patch };
      saveSettings(next);
      return next;
    });
  };

  const boolRow = (
    label: string,
    value: boolean,
    onChange: (v: boolean) => void
  ) => (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-primary">{label}</span>
      <OptionGroup
        label={label}
        value={value ? "on" : "off"}
        options={ON_OFF}
        onChange={(v) => onChange(v === "on")}
      />
    </div>
  );

  if (!mounted) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8" aria-busy="true">
        <div className="h-6 w-24 animate-pulse rounded bg-white/10" />
        <div className="h-24 animate-pulse rounded bg-white/5" />
        <div className="h-24 animate-pulse rounded bg-white/5" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
      <header className="flex items-center gap-4">
        <Link
          href="/"
          className="font-mono text-lg font-semibold tracking-tight text-primary"
        >
          type3d
        </Link>
        <span className="font-mono text-sm text-secondary">settings</span>
      </header>

      <section aria-label="Sound settings">
        <h2 className="font-mono text-sm text-secondary">sound</h2>
        <div className="mt-2 divide-y divide-white/10 border-y border-white/10">
          {boolRow("Sound", settings.sound, (v) => update({ sound: v }))}
          <div className="flex items-center justify-between gap-4 py-3">
            <span className="text-sm text-primary">Volume</span>
            <OptionGroup
              label="Volume"
              value={String(settings.volume)}
              options={VOLUME_OPTIONS}
              onChange={(v) =>
                update({ volume: Number(v) as AppSettings["volume"] })
              }
            />
          </div>
        </div>
      </section>

      <section aria-label="Visual settings">
        <h2 className="font-mono text-sm text-secondary">visual</h2>
        <div className="mt-2 divide-y divide-white/10 border-y border-white/10">
          {boolRow("3D keyboard", settings.keyboard3d, (v) =>
            update({ keyboard3d: v })
          )}
          {boolRow("Key hint", settings.keyHint, (v) =>
            update({ keyHint: v })
          )}
          {boolRow("Reduce motion", settings.reduceMotion, (v) =>
            update({ reduceMotion: v })
          )}
        </div>
      </section>

      <section aria-label="Controls settings">
        <h2 className="font-mono text-sm text-secondary">controls</h2>
        <div className="mt-2 flex items-center justify-between gap-4 border-y border-white/10 py-3">
          <span className="text-sm text-primary">Restart key</span>
          <OptionGroup
            label="Restart key"
            value={settings.restartKey}
            options={RESTART_OPTIONS}
            onChange={(v) => update({ restartKey: v })}
          />
        </div>
      </section>

      <Link href="/" className="font-mono text-sm text-secondary hover:text-primary">
        ← back to test
      </Link>
    </div>
  );
}
