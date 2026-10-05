export type SoundType = "key" | "space" | "enter" | "backspace" | "error";

type OscillatorKind = OscillatorType;

function resolveAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

class AudioManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = true;
  private volume01 = 0.5;

  /** Pre-create context + master gain and play a 1ms silent buffer (call on mount/gesture). */
  unlock(): void {
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      if (ctx.state === "suspended") {
        void ctx.resume().catch(() => {
          /* silent */
        });
      }
      // 1ms silent buffer to unlock mobile Safari without audible output.
      const len = Math.max(1, Math.floor(ctx.sampleRate * 0.001));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(this.master as GainNode);
      src.start();
    } catch {
      /* silent no-op: audio must never break typing */
    }
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
  }

  setVolume01(v: number): void {
    const clamped = Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
    this.volume01 = clamped;
    try {
      if (this.master && this.ctx) {
        this.master.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.01);
      }
    } catch {
      /* silent */
    }
  }

  /** Fire-and-forget synth blip. Never awaits; silent no-op on any failure. */
  play(type: SoundType): void {
    try {
      if (typeof window === "undefined") return;
      if (!this.enabled) return;
      const ctx = this.ensureContext();
      if (!ctx || !this.master) return;
      if (ctx.state === "suspended") {
        void ctx.resume().catch(() => {
          /* silent */
        });
      }
      switch (type) {
        case "key":
          this.playKey(ctx);
          break;
        case "space":
          this.tone(ctx, 300, "sine", 0.06, 0.4);
          break;
        case "enter":
          this.tone(ctx, 600, "square", 0.04, 0.18);
          break;
        case "backspace":
          this.tone(ctx, 900, "sine", 0.03, 0.2);
          break;
        case "error":
          this.tone(ctx, 140, "sawtooth", 0.08, 0.12);
          break;
      }
    } catch {
      /* silent */
    }
  }

  private ensureContext(): AudioContext | null {
    if (this.ctx && this.master) return this.ctx;
    const Ctor = resolveAudioContextCtor();
    if (!Ctor) return null;
    if (!this.ctx) {
      this.ctx = new Ctor();
    }
    if (!this.master && this.ctx) {
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume01;
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  /** Short enveloped oscillator blip through the master gain. */
  private tone(
    ctx: AudioContext,
    freqHz: number,
    kind: OscillatorKind,
    durSec: number,
    peak: number,
  ): void {
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = kind;
    osc.frequency.setValueAtTime(freqHz, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + durSec);
    osc.connect(g);
    g.connect(this.master as GainNode);
    osc.start(t0);
    osc.stop(t0 + durSec + 0.02);
  }

  /** Mechanical click: filtered noise burst layered with an 1800Hz triangle blip (30ms). */
  private playKey(ctx: AudioContext): void {
    const dur = 0.03;
    const t0 = ctx.currentTime;
    const master = this.master as GainNode;

    // Noise burst through a bandpass around 1800Hz.
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1800, t0);
    bp.Q.setValueAtTime(1, t0);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0, t0);
    ng.gain.linearRampToValueAtTime(0.22, t0 + 0.002);
    ng.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp);
    bp.connect(ng);
    ng.connect(master);
    src.start(t0);

    // 1800Hz triangle body under the noise.
    this.tone(ctx, 1800, "triangle", dur, 0.14);
  }
}

export const audioManager = new AudioManager();
