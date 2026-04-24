/**
 * Audio utilities for Gemini Live API
 *
 * Gemini Live expects:
 * - Input:  PCM 16-bit, 16 kHz, mono
 * - Output: PCM 16-bit, 24 kHz, mono
 */

const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

/** Float32 [-1, 1] → Int16 [-32768, 32767] */
export function float32ToInt16(f32: Float32Array): Int16Array {
  const out = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    const s = Math.max(-1, Math.min(1, f32[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

/** Base64 PCM 24kHz Int16 → Float32 at 24kHz */
export function base64ToFloat32(b64: string): Float32Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const dv = new DataView(bytes.buffer);
  const f32 = new Float32Array(bytes.length / 2);
  for (let i = 0; i < f32.length; i++) {
    f32[i] = dv.getInt16(i * 2, true) / 0x8000;
  }
  return f32;
}

/** ArrayBuffer → base64 (for sending mic audio) */
export function arrayBufferToBase64(buf: ArrayBufferLike): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

/**
 * Starts microphone capture, produces base64-encoded 16 kHz PCM chunks.
 * Returns a stopper function.
 */
export async function startMicCapture(
  onChunk: (b64Pcm16k: string) => void
): Promise<() => void> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: INPUT_SAMPLE_RATE,
  });
  const source = audioCtx.createMediaStreamSource(stream);

  // Use ScriptProcessor fallback (wide browser compat).
  // Buffer size 2048 ≈ 128ms at 16kHz — good latency/perf balance.
  const processor = audioCtx.createScriptProcessor(2048, 1, 1);
  processor.onaudioprocess = (e) => {
    const input = e.inputBuffer.getChannelData(0);
    const pcm16 = float32ToInt16(input);
    onChunk(arrayBufferToBase64(pcm16.buffer));
  };

  source.connect(processor);
  processor.connect(audioCtx.destination);

  return () => {
    try {
      processor.disconnect();
      source.disconnect();
      stream.getTracks().forEach((t) => t.stop());
      audioCtx.close();
    } catch {
      /* no-op */
    }
  };
}

/**
 * Audio playback queue for Gemini's 24 kHz PCM chunks.
 * Keeps chunks in sequence so playback doesn't crack.
 */
export class AudioPlaybackQueue {
  private ctx: AudioContext | null = null;
  private nextStartTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private _onPlaybackChange?: (isPlaying: boolean) => void;
  private _playing = false;

  onPlaybackChange(cb: (isPlaying: boolean) => void) {
    this._onPlaybackChange = cb;
  }

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)({
        sampleRate: OUTPUT_SAMPLE_RATE,
      });
    }
    // Resume if suspended (required after user gesture on some browsers)
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  enqueuePcm24k(b64: string) {
    const ctx = this.ensureCtx();
    const f32 = base64ToFloat32(b64);
    if (f32.length === 0) return;
    const buffer = ctx.createBuffer(1, f32.length, OUTPUT_SAMPLE_RATE);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (buffer.copyToChannel as any)(f32, 0);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    const startAt = Math.max(now, this.nextStartTime);
    source.start(startAt);
    this.nextStartTime = startAt + buffer.duration;

    this.activeSources.push(source);
    source.onended = () => {
      this.activeSources = this.activeSources.filter((s) => s !== source);
      if (this.activeSources.length === 0) {
        this._playing = false;
        this._onPlaybackChange?.(false);
      }
    };

    if (!this._playing) {
      this._playing = true;
      this._onPlaybackChange?.(true);
    }
  }

  flush() {
    this.activeSources.forEach((s) => {
      try {
        s.stop();
      } catch {
        /* no-op */
      }
    });
    this.activeSources = [];
    this.nextStartTime = this.ctx?.currentTime ?? 0;
    this._playing = false;
    this._onPlaybackChange?.(false);
  }

  close() {
    this.flush();
    try {
      this.ctx?.close();
    } catch {
      /* no-op */
    }
    this.ctx = null;
  }
}
