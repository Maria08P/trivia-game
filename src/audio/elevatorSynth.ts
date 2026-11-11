/**
 * Velvet Elevator Music Synthesizer
 * Built with the Web Audio API for zero-dependency, zero-network, authentic lounge elevator music.
 * Features mellow Rhodes-style jazz chords, walking double bass, gentle bossa percussion, and floor chimes.
 */

export interface ElevatorTrack {
  id: string;
  name: string;
  bpm: number;
  description: string;
  chordProgression: number[][]; // MIDI note arrays
  bassNotes: number[];
  melodyNotes: Array<{ note: number; beat: number; duration: number }>;
}

// Frequencies for MIDI note numbers
function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Track definitions: classic smooth elevator lounge progressions
export const ELEVATOR_TRACKS: ElevatorTrack[] = [
  {
    id: 'bossa',
    name: 'Velvet Penthouse Bossa',
    bpm: 108,
    description: 'Warm electric piano with syncopated Latin lounge bossa rhythm',
    // Fmaj9 -> Em7 -> Dm9 -> Cmaj7 (timeless breezy elevator jazz)
    chordProgression: [
      [53, 60, 64, 67, 69], // Fmaj9 (F3, C4, E4, G4, A4)
      [52, 59, 64, 67],     // Em7   (E3, B3, E4, G4)
      [50, 57, 60, 64, 69], // Dm9   (D3, A3, C4, E4, A4)
      [48, 55, 59, 64, 67], // Cmaj7 (C3, G3, B3, E4, G4)
    ],
    bassNotes: [41, 48, 40, 47, 38, 45, 36, 43], // F2, C3, E2, B2, D2, A2, C2, G2
    melodyNotes: [
      { note: 72, beat: 0.5, duration: 0.4 }, // C5
      { note: 74, beat: 1.5, duration: 0.4 }, // D5
      { note: 76, beat: 2.0, duration: 0.8 }, // E5
      { note: 79, beat: 3.5, duration: 0.6 }, // G5
      { note: 76, beat: 4.5, duration: 0.4 }, // E5
      { note: 74, beat: 5.5, duration: 0.4 }, // D5
      { note: 72, beat: 6.0, duration: 1.2 }, // C5
      { note: 69, beat: 7.5, duration: 0.6 }, // A4
    ],
  },
  {
    id: 'lounge',
    name: 'Gilded Mezzanine Chill',
    bpm: 96,
    description: 'Relaxed slow elevator stroll with lush major seventh voicings',
    // Ebmaj7 -> Fm7 -> Gm7 -> Abmaj7
    chordProgression: [
      [51, 58, 62, 65, 70], // Ebmaj9
      [53, 60, 63, 68],     // Fm7
      [55, 62, 65, 70],     // Gm7
      [56, 63, 67, 72],     // Abmaj7
    ],
    bassNotes: [39, 46, 41, 48, 43, 50, 44, 51],
    melodyNotes: [
      { note: 70, beat: 1.0, duration: 0.8 },
      { note: 72, beat: 2.5, duration: 0.5 },
      { note: 75, beat: 4.0, duration: 1.0 },
      { note: 74, beat: 5.5, duration: 0.6 },
      { note: 70, beat: 6.5, duration: 1.0 },
    ],
  },
  {
    id: 'groove',
    name: 'Golden Hour Express',
    bpm: 116,
    description: 'Upbeat penthouse ascent with vibraphone sparkle',
    // Am9 -> D9 -> Gmaj7 -> Cmaj7
    chordProgression: [
      [57, 64, 67, 71],     // Am9
      [50, 58, 62, 66],     // D9
      [55, 62, 66, 71],     // Gmaj7
      [48, 55, 59, 64],     // Cmaj7
    ],
    bassNotes: [45, 52, 38, 45, 43, 50, 36, 43],
    melodyNotes: [
      { note: 76, beat: 0.5, duration: 0.4 },
      { note: 79, beat: 1.5, duration: 0.4 },
      { note: 81, beat: 2.0, duration: 0.8 },
      { note: 78, beat: 3.5, duration: 0.6 },
      { note: 74, beat: 5.0, duration: 0.7 },
      { note: 71, beat: 6.5, duration: 1.0 },
    ],
  },
];

class ElevatorMusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  private isPlaying = false;
  private isMuted = false;
  private volume = 0.6;
  private currentTrackIndex = 0;

  private schedulerTimer: number | null = null;
  private currentStep = 0; // 16th note steps
  private nextStepTime = 0;
  private lookaheadMs = 25;
  private scheduleAheadSec = 0.15;

  // Listeners for UI state sync
  private subscribers: Array<(state: { isPlaying: boolean; volume: number; isMuted: boolean; currentTrack: ElevatorTrack }) => void> = [];

  constructor() {
    // Lazy audio context init on first user gesture
  }

  private initAudio() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtxClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.8;

    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  public subscribe(cb: (state: { isPlaying: boolean; volume: number; isMuted: boolean; currentTrack: ElevatorTrack }) => void) {
    this.subscribers.push(cb);
    this.notify();
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== cb);
    };
  }

  private notify() {
    const currentTrack = ELEVATOR_TRACKS[this.currentTrackIndex];
    for (const cb of this.subscribers) {
      cb({
        isPlaying: this.isPlaying,
        volume: this.volume,
        isMuted: this.isMuted,
        currentTrack,
      });
    }
  }

  public async start(): Promise<boolean> {
    this.initAudio();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // user interaction needed
      }
    }

    if (this.isPlaying) return true;

    this.isPlaying = true;
    this.currentStep = 0;
    this.nextStepTime = this.ctx.currentTime + 0.05;
    this.runScheduler();
    this.notify();
    return true;
  }

  public pause() {
    this.isPlaying = false;
    if (this.schedulerTimer !== null) {
      window.clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    this.notify();
  }

  public toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.pause();
      return Promise.resolve(false);
    } else {
      return this.start();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.03);
    }
    this.notify();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.03);
    }
    this.notify();
  }

  public setTrack(trackId: string) {
    const idx = ELEVATOR_TRACKS.findIndex(t => t.id === trackId);
    if (idx !== -1) {
      this.currentTrackIndex = idx;
      this.notify();
    }
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % ELEVATOR_TRACKS.length;
    this.notify();
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(16);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  // --- Scheduler & Sound Generation ---

  private runScheduler = () => {
    if (!this.isPlaying || !this.ctx) return;

    while (this.nextStepTime < this.ctx.currentTime + this.scheduleAheadSec) {
      this.scheduleStep(this.currentStep, this.nextStepTime);
      this.advanceStep();
    }

    this.schedulerTimer = window.setTimeout(this.runScheduler, this.lookaheadMs);
  };

  private advanceStep() {
    const track = ELEVATOR_TRACKS[this.currentTrackIndex];
    const secondsPerBeat = 60.0 / track.bpm;
    const secondsPer16th = secondsPerBeat / 4;
    this.nextStepTime += secondsPer16th;
    this.currentStep = (this.currentStep + 1) % 64; // 4 bars of 16 steps = 64
  }

  private scheduleStep(step: number, time: number) {
    if (!this.ctx || !this.musicGain) return;
    const track = ELEVATOR_TRACKS[this.currentTrackIndex];

    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;
    const chordIndex = bar % track.chordProgression.length;

    // 1. Percussion (Bossa nova shaker, mellow kick, brush click)
    // Hi-hat / Shaker pattern on 16th notes with groove
    if (step % 2 === 0 || (stepInBar === 3 || stepInBar === 7 || stepInBar === 11 || stepInBar === 14)) {
      const isAccent = stepInBar === 4 || stepInBar === 12;
      this.playShaker(time, isAccent ? 0.18 : 0.09);
    }

    // Warm kick on 1 and & of 3 (classic bossa kick)
    if (stepInBar === 0 || stepInBar === 6 || stepInBar === 10) {
      this.playWarmKick(time, stepInBar === 0 ? 0.35 : 0.22);
    }

    // Soft rim / side-stick click on beats 2 & 4
    if (stepInBar === 4 || stepInBar === 12) {
      this.playRimClick(time, 0.15);
    }

    // 2. Upright Bass (Walking/bossa roots and fifths)
    if (stepInBar === 0 || stepInBar === 6 || stepInBar === 10) {
      const bassIdx = (chordIndex * 2 + (stepInBar === 0 ? 0 : 1)) % track.bassNotes.length;
      const bassMidi = track.bassNotes[bassIdx];
      this.playBassNote(bassMidi, time, 0.35);
    }

    // 3. Electric Piano Rhodes-style Chords (Syncopated comping)
    // Chords struck on syncopated bossa beats: step 0, 3, 6, 10, 12
    if (stepInBar === 0 || stepInBar === 3 || stepInBar === 6 || stepInBar === 10) {
      const chord = track.chordProgression[chordIndex];
      const duration = stepInBar === 0 ? 0.6 : 0.45;
      const velocity = stepInBar === 0 ? 0.22 : 0.16;
      this.playRhodesChord(chord, time, duration, velocity);
    }

    // 4. Subtle Melodic Vibraphone Frills
    const currentBeat = (step / 4); // in quarter notes (0 to 16)
    for (const m of track.melodyNotes) {
      if (Math.abs(currentBeat - m.beat) < 0.12) {
        this.playVibraphone(m.note, time, m.duration, 0.18);
      }
    }
  }

  // --- Instrument Synthesizers ---

  // Warm Rhodes Electric Piano (Sine with gentle harmonics + lowpass filter)
  private playRhodesChord(midiNotes: number[], time: number, duration: number, velocity: number) {
    if (!this.ctx || !this.musicGain) return;

    for (const midi of midiNotes) {
      const freq = midiToFreq(midi);

      // Main tone
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, time);

      // Subtle harmonic overtone for Rhodes warmth
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, time);

      const toneGain = this.ctx.createGain();
      toneGain.gain.setValueAtTime(0, time);
      toneGain.gain.linearRampToValueAtTime(velocity / midiNotes.length, time + 0.02);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      // Low pass filter for soft mellow tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, time);
      filter.frequency.exponentialRampToValueAtTime(450, time + duration);

      osc1.connect(toneGain);
      osc2.connect(toneGain);
      toneGain.connect(filter);
      filter.connect(this.musicGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration + 0.05);
      osc2.stop(time + duration + 0.05);
    }
  }

  // Warm Plucked Upright Jazz Bass
  private playBassNote(midi: number, time: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const freq = midiToFreq(midi);

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.3, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, time);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Vibraphone melody note with gentle bell decay
  private playVibraphone(midi: number, time: number, duration: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;
    const freq = midiToFreq(midi);

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 3.01, time); // metallic overtone

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(volume * 0.15, time);
    gain2.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.5);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(this.musicGain);
    gain2.connect(this.musicGain);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + duration + 0.1);
    osc2.stop(time + duration + 0.1);
  }

  // Shaker / Brushed Hat using synthesized noise
  private playShaker(time: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;

    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(7500, time);
    filter.Q.setValueAtTime(2.5, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
  }

  // Warm round kick drum
  private playWarmKick(time: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.08);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.16);
  }

  // Soft rimshot / wood click
  private playRimClick(time: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, time);
    osc.frequency.exponentialRampToValueAtTime(220, time + 0.025);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.035);
  }

  // --- Sound Effects (SFX) ---

  /** Classic Elevator Ding ("DING-DONG" or single floor "DING!") */
  public playElevatorChime(type: 'single' | 'double' = 'single') {
    this.initAudio();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const playBell = (freq: number, startTime: number) => {
      if (!this.ctx || !this.sfxGain) return;
      // Dual harmonic bell
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq * 2.02, startTime); // shimmering octave

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.4, startTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0, startTime);
      gain2.gain.linearRampToValueAtTime(0.12, startTime + 0.005);
      gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

      osc1.connect(gain);
      osc2.connect(gain2);
      gain.connect(this.sfxGain);
      gain2.connect(this.sfxGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + 1.9);
      osc2.stop(startTime + 1.9);
    };

    if (type === 'single') {
      playBell(1318.5, now); // E6 elevator chime
    } else {
      playBell(1318.5, now); // E6
      playBell(987.77, now + 0.35); // B5
    }
  }

  /** Sweet upward golden arpeggio for correct trivia answer */
  public playCorrectSound() {
    this.initAudio();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.07 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.55);
    });
  }

  /** Soft low woodblock for incorrect answer (polite, not jarring) */
  public playWrongSound() {
    this.initAudio();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 233.08]; // C4, Bb3 (gentle downward inflection)
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0.2, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.28);
    });
  }

  /** Celebratory streak sound */
  public playStreakSound() {
    this.initAudio();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [659.25, 830.61, 987.77, 1318.5]; // E5, G#5, B5, E6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.06 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.65);
    });
  }
}

export const elevatorSynth = new ElevatorMusicEngine();
