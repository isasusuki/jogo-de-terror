// High-fidelity procedural Web Audio API engine for gothic orchestral piano and ambient horror soundscapes

class GothicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  private isBgmPlaying: boolean = false;
  private bgmTimeoutId: number | null = null;
  private rainNode: AudioNode | null = null;
  private tensionLevel: number = 1; // 1 to 3

  private noteFrequencies: Record<string, number> = {
    C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, Ab5: 830.61, A5: 880.00, B5: 987.77,
  };

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.startRainAmbience();
    } catch {
      // AudioContext not allowed before user gesture
    }
  }

  public ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.85, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.ensureContext();
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setTension(level: number) {
    this.tensionLevel = Math.max(1, Math.min(3, level));
  }

  /**
   * Procedural grand piano note synthesis using multiple additive harmonics
   * and physical decay envelopes mimicking felt hammer strikes.
   */
  public playPianoNote(note: string, duration: number = 2.5, velocity: number = 0.8) {
    this.ensureContext();
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    const freq = this.noteFrequencies[note] || 440;
    const now = this.ctx.currentTime;

    // Fundamental + harmonics
    const harmonics = [
      { ratio: 1.0, gain: 0.85 },
      { ratio: 2.0, gain: 0.40 },
      { ratio: 3.0, gain: 0.22 },
      { ratio: 4.0, gain: 0.12 },
      { ratio: 5.0, gain: 0.05 },
    ];

    harmonics.forEach(({ ratio, gain }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = ratio === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq * ratio, now);

      // Natural hammer transient attack and exponential piano decay
      const peakAmp = gain * velocity * 0.45;
      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(peakAmp, now + 0.015);
      oscGain.gain.exponentialRampToValueAtTime(peakAmp * 0.4, now + 0.3);
      oscGain.gain.exponentialRampToValueAtTime(0.00001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(this.musicGain!);

      osc.start(now);
      osc.stop(now + duration);
    });

    // Subtle hammer thud
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.15));
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(450, now);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.12, now);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.musicGain);
    noiseSource.start(now);
  }

  /**
   * Continuous orchestral gothic piano soundtrack loop
   */
  public startSoundtrack() {
    this.ensureContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.playNextOrchestralPhrase(0);
  }

  private playNextOrchestralPhrase(step: number) {
    if (!this.isBgmPlaying || !this.ctx) return;

    // Gothic melancholic chord progressions:
    // C minor -> Ab major 7 -> F minor -> G7 / D dim
    const phrases = [
      // Phrase 0: C minor intro (Melancholy & longing)
      [
        { note: 'C3', delay: 0, dur: 4.0, vel: 0.6 },
        { note: 'G3', delay: 0.4, dur: 3.5, vel: 0.5 },
        { note: 'Eb4', delay: 0.8, dur: 3.0, vel: 0.7 },
        { note: 'G4', delay: 1.2, dur: 2.8, vel: 0.65 },
        { note: 'C5', delay: 1.6, dur: 3.2, vel: 0.75 },
        { note: 'Eb5', delay: 2.2, dur: 2.6, vel: 0.6 },
        { note: 'D5', delay: 2.8, dur: 2.0, vel: 0.55 },
      ],
      // Phrase 1: Ab Major 7 (Romantic tragedy)
      [
        { note: 'Ab3', delay: 0, dur: 4.0, vel: 0.6 },
        { note: 'Eb4', delay: 0.4, dur: 3.5, vel: 0.55 },
        { note: 'C4', delay: 0.8, dur: 3.2, vel: 0.6 },
        { note: 'G4', delay: 1.3, dur: 3.0, vel: 0.75 },
        { note: 'Ab4', delay: 1.8, dur: 3.0, vel: 0.7 },
        { note: 'C5', delay: 2.3, dur: 2.5, vel: 0.65 },
        { note: 'Bb4', delay: 2.9, dur: 2.0, vel: 0.5 },
      ],
      // Phrase 2: F minor / D dim (Growing tension)
      [
        { note: 'F3', delay: 0, dur: 4.0, vel: 0.65 },
        { note: 'C4', delay: 0.4, dur: 3.5, vel: 0.55 },
        { note: 'Ab4', delay: 0.8, dur: 3.0, vel: 0.7 },
        { note: 'D5', delay: 1.3, dur: 3.0, vel: 0.75 },
        { note: 'C5', delay: 1.9, dur: 2.6, vel: 0.7 },
        { note: 'Ab4', delay: 2.4, dur: 2.2, vel: 0.6 },
        { note: 'F4', delay: 2.9, dur: 2.0, vel: 0.55 },
      ],
      // Phrase 3: G Dominant 7th (Suspense & resolution)
      [
        { note: 'G3', delay: 0, dur: 4.5, vel: 0.7 },
        { note: 'D4', delay: 0.4, dur: 3.8, vel: 0.6 },
        { note: 'B4', delay: 0.9, dur: 3.5, vel: 0.75 },
        { note: 'F4', delay: 1.4, dur: 3.2, vel: 0.65 },
        { note: 'D5', delay: 1.9, dur: 3.0, vel: 0.7 },
        { note: 'Eb5', delay: 2.4, dur: 2.4, vel: 0.75 },
        { note: 'D5', delay: 2.8, dur: 2.0, vel: 0.6 },
        { note: 'B4', delay: 3.2, dur: 2.2, vel: 0.55 },
      ]
    ];

    const currentPhrase = phrases[step % phrases.length];
    currentPhrase.forEach(item => {
      window.setTimeout(() => {
        if (this.isBgmPlaying) {
          // Adjust velocity with tension level
          const adjustedVel = Math.min(1, item.vel * (1 + (this.tensionLevel - 1) * 0.25));
          this.playPianoNote(item.note, item.dur, adjustedVel);
        }
      }, item.delay * 1000);
    });

    // Schedule next phrase after ~4 seconds
    this.bgmTimeoutId = window.setTimeout(() => {
      this.playNextOrchestralPhrase(step + 1);
    }, 4100);
  }

  public stopSoundtrack() {
    this.isBgmPlaying = false;
    if (this.bgmTimeoutId) {
      clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  /**
   * Procedural rain ambience using pink noise
   */
  private startRainAmbience() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const rainSource = this.ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;

      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      rainSource.connect(rainFilter);
      rainFilter.connect(this.ambientGain);
      rainSource.start(0);
      this.rainNode = rainSource;
    } catch {
      // Audio fallback
    }
  }

  /**
   * Sound effects (SFX)
   */
  public playThunder() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const dur = 3.5;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const decay = Math.exp(-progress * 2.5);
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    source.start(now);
  }

  public playClockTick() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playTapSound() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.025);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  public playClockChime() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Cathedral / Victorian grandfather clock deep brass chime
    const fundamentals = [196.00, 392.00, 784.00, 1174.66];
    fundamentals.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = 0.35 / (idx + 1);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now);
      osc.stop(now + 4.2);
    });
  }

  public playDoorCreak() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.4);
    osc.frequency.linearRampToValueAtTime(120, now + 0.8);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, now);
    filter.Q.setValueAtTime(5, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.95);
  }

  public playLockUnlock() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Metallic latch click
    [520, 840, 1200].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.25, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.1);
    });
  }

  public playItemPickup() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const notes = [440, 554.37, 659.25]; // A major sparkle
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.18, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.35);
    });
  }

  public playPuzzleSolved() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Uplifting yet melancholic gothic reveal chord
    const chord = [261.63, 329.63, 392.00, 523.25, 659.25];
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.22, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 2.0);
    });
  }

  public playHeartbeat() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.14);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.2);

    // Second beat of the lub-dub
    window.setTimeout(() => {
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const t = this.ctx.currentTime;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(68, t);
      osc2.frequency.exponentialRampToValueAtTime(36, t + 0.16);

      gain2.gain.setValueAtTime(0.45, t);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(t);
      osc2.stop(t + 0.24);
    }, 180);
  }

  public playMusicBoxNote(freq: number) {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 1.3);
  }
}

export const audioEngine = new GothicAudioEngine();
