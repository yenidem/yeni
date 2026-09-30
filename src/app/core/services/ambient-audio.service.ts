import {Injectable, signal} from '@angular/core';

export type AmbientSoundMode =
  | 'baglama-deyis'
  | 'semah-dem'
  | 'ney-drone'
  | 'library-rain'
  | 'deep-contemplation';

export interface AmbientModeConfig {
  id: AmbientSoundMode;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  licenseBadge: string;
}

export interface CuratedDeyisTrack {
  id: string;
  ozan: string;
  title: string;
  makam: string;
  couplet: string;
  narration: string;
}

@Injectable({
  providedIn: 'root',
})
export class AmbientAudioService {
  readonly isPlaying = signal<boolean>(false);
  readonly currentMode = signal<AmbientSoundMode>('baglama-deyis');
  readonly volume = signal<number>(0.45);
  readonly remainingSeconds = signal<number>(0);
  readonly selectedTimerMinutes = signal<number>(0); // 0 = continuous
  readonly activeDeyisId = signal<string>('bektas-ilim');
  readonly activeNoteLabel = signal<string>('La (Dügah Karar)');

  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | ReturnType<typeof setInterval>)[] = [];
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  readonly availableModes: AmbientModeConfig[] = [
    {
      id: 'baglama-deyis',
      name: 'Anadolu Bağlama & Deyiş Ezgisi',
      subtitle: 'Hüseynî Düzeni · Karadüzen Mızrap',
      icon: 'music_note',
      description:
        'Anadolu Hüseynî makamında (La-Si-Do-Re-Mi) Web Audio API ile gerçek zamanlı sentezlenen %100 telifsiz bağlama ve dem tınısı.',
      licenseBadge: '%100 Telifsiz Sentez',
    },
    {
      id: 'semah-dem',
      name: 'Horasan Kopuzu & Dem Meydanı',
      subtitle: 'Uşşak Niyaz & Nefes Rezonansı',
      icon: 'spa',
      description:
        'Yunus Emre ve Pîr Sultan Abdal nefeslerinin ritmik tefekkür frekansında ağır kopuz ve dem akoru.',
      licenseBadge: '%100 Telifsiz Sentez',
    },
    {
      id: 'ney-drone',
      name: 'Ney & Tanbûr Tınısı',
      subtitle: 'Rast & Hicaz Mistik Akustik',
      icon: 'air',
      description:
        'Klasik Türk müziği Rast ve Hicaz perdelerinde tefekkür ve okuma için derin rezonanslı ney dem sesleri.',
      licenseBadge: '%100 Telifsiz Sentez',
    },
    {
      id: 'library-rain',
      name: 'Kütüphane & Gece Yağmuru',
      subtitle: 'Huzurlu Çalışma Ambiyansı',
      icon: 'water_drop',
      description:
        'Tarihi bir kütüphanenin penceresine vuran dingin gece yağmuru ve parşömen sessizliği.',
      licenseBadge: '%100 Telifsiz Sentez',
    },
    {
      id: 'deep-contemplation',
      name: '432Hz Derin Tefekkür',
      subtitle: 'Alfa Dalgası & Felsefi Odaklanma',
      icon: 'self_improvement',
      description:
        'Zihni yatıştıran 432 Hz armoni ve 10 Hz alfa dalgası frekansıyla derin metin tahlili odağı.',
      licenseBadge: '%100 Telifsiz Sentez',
    },
  ];

  readonly curatedDeyisler: CuratedDeyisTrack[] = [
    {
      id: 'bektas-ilim',
      ozan: 'Hünkâr Hacı Bektâş-ı Velî',
      title: 'Hararet Nardadır Sacda Değildir',
      makam: 'Hüseynî Nefes',
      couplet:
        'Hararet nardadır sacda değildir / Keramet baştadır tacda değildir / Her ne arar isen kendinde ara / Kudüs’te Mekke’de Hac’da değildir.',
      narration:
        'Hünkâr Hacı Bektâş-ı Velî nefesi. Hararet nardadır, sacda değildir. Keramet baştadır, tacda değildir. Her ne arar isen, kendinde ara; Kudüs’te, Mekke’de, Hac’da değildir. İlimden gidilmeyen yolun sonu karanlıktır; incinsen de incitme.',
    },
    {
      id: 'yunus-benlik',
      ozan: 'Yunus Emre',
      title: 'Bir Ben Vardır Bende Benden İçeri',
      makam: 'Uşşak İlahi & Nefes',
      couplet:
        'Ete kemiğe büründüm, Yunus diye göründüm / Beni bende demen bende değilim, bir ben vardır bende benden içeri.',
      narration:
        'Yunus Emre nefesi. Ete kemiğe büründüm, Yunus diye göründüm. Beni bende demen, bende değilim; bir ben vardır bende, benden içeri. Yaratılanı severiz, Yaratandan ötürü.',
    },
    {
      id: 'pir-sultan-yol',
      ozan: 'Pîr Sultan Abdal',
      title: 'Dönen Dönsün Ben Dönmezem Yolumdan',
      makam: 'Hüseynî Deyiş',
      couplet:
        'Koyun beni Hak aşkına yanayım / Dönen dönsün ben dönmezem yolumdan / Yolumdan dönüp mahrum mu kalayım / Dönen dönsün ben dönmezem yolumdan.',
      narration:
        'Pîr Sultan Abdal deyişi. Koyun beni Hak aşkına yanayım. Dönen dönsün, ben dönmezem yolumdan. Yolumdan dönüp mahrum mu kalayım? Dönen dönsün, ben dönmezem yolumdan. Şu ellerin taşı hiç bana değmez, ille dostun bir tek gülü yaralar beni.',
    },
    {
      id: 'hatayi-turna',
      ozan: 'Şah Hatâyî',
      title: 'Telli Turnam Selam Götür',
      makam: 'Acemaşiran / Hüseynî Deyiş',
      couplet:
        'Sözünü bir söyleyenin sözü bir olur / Gönül kalsın, yol kalmasın erenler.',
      narration:
        'Şah Hatâyî nefesi. Sözünü bir söyleyenin sözü bir olur. Gönül kalsın, yol kalmasın erenler. Muhabbet kapısında cümle canlar birdir.',
    },
  ];

  togglePlay(): void {
    if (this.isPlaying()) {
      this.stop();
    } else {
      this.play();
    }
  }

  setMode(mode: AmbientSoundMode): void {
    this.currentMode.set(mode);
    if (this.isPlaying()) {
      this.stopSynthesizers();
      this.startSynthesizers();
    } else {
      this.play();
    }
  }

  setVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume.set(clamped);
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(clamped, this.audioCtx.currentTime, 0.05);
    }
  }

  setTimer(minutes: number): void {
    this.selectedTimerMinutes.set(minutes);
    if (minutes > 0) {
      this.remainingSeconds.set(minutes * 60);
      if (this.isPlaying()) {
        this.startTimerCountdown();
      }
    } else {
      this.clearTimer();
    }
  }

  play(): void {
    this.initAudioContext();
    if (!this.audioCtx) return;

    this.isPlaying.set(true);

    const startEngine = () => {
      if (!this.isPlaying()) return;
      this.stopSynthesizers();
      this.startSynthesizers();
    };

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx
        .resume()
        .then(() => startEngine())
        .catch(() => startEngine());
    } else {
      startEngine();
    }

    if (this.selectedTimerMinutes() > 0) {
      if (this.remainingSeconds() <= 0) {
        this.remainingSeconds.set(this.selectedTimerMinutes() * 60);
      }
      this.startTimerCountdown();
    }
  }

  stop(): void {
    this.stopSynthesizers();
    this.isPlaying.set(false);
    this.clearTimer();
  }

  private initAudioContext(): void {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume(), this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
  }

  private startSynthesizers(): void {
    if (!this.audioCtx || !this.masterGain) return;

    const mode = this.currentMode();
    if (mode === 'baglama-deyis') {
      this.buildBaglamaDeyis(this.audioCtx, this.masterGain);
    } else if (mode === 'semah-dem') {
      this.buildSemahDem(this.audioCtx, this.masterGain);
    } else if (mode === 'ney-drone') {
      this.buildNeyDrone(this.audioCtx, this.masterGain);
    } else if (mode === 'library-rain') {
      this.buildLibraryRain(this.audioCtx, this.masterGain);
    } else if (mode === 'deep-contemplation') {
      this.buildDeepContemplation(this.audioCtx, this.masterGain);
    }
  }

  private stopSynthesizers(): void {
    for (const node of this.activeNodes) {
      if (typeof node === 'object' && node !== null && 'connect' in node) {
        const audioNode = node as AudioNode;
        if ('stop' in audioNode && typeof (audioNode as AudioScheduledSourceNode).stop === 'function') {
          try {
            (audioNode as AudioScheduledSourceNode).stop();
          } catch {
            /* Ignore audio stop errors */
          }
        }
        try {
          audioNode.disconnect();
        } catch {
          /* Ignore audio disconnect errors */
        }
      } else {
        clearInterval(node as ReturnType<typeof setInterval>);
      }
    }
    this.activeNodes = [];
  }

  /**
   * 100% Royalty-Free Procedural Anatolian Bağlama & Deyiş Synthesizer (Hüseynî Makam)
   * Uses a warm Karadüzen Dem drone (A2/E3) + plucked melodic motif in Hüseynî scale.
   */
  private buildBaglamaDeyis(ctx: AudioContext, destination: GainNode): void {
    // 1. Warm Dem String Drone (A2 = 110Hz, E3 = 164.81Hz)
    const demFreqs = [110.0, 164.81];
    demFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(idx === 0 ? 0.12 : 0.08, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);
      osc.start();
      this.activeNodes.push(osc, filter, gain);
    });

    // 2. Hüseynî Melodic Bağlama Pluck Sequence (La - Do - Re - Mi - Sol - Fa - Mi - Re - Do - Si - La)
    const huseyniMelody: {freq: number; perde: string}[] = [
      {freq: 220.0, perde: 'La · Dügâh (Karar)'},
      {freq: 261.63, perde: 'Do · Çârgâh'},
      {freq: 293.66, perde: 'Re · Nevâ'},
      {freq: 329.63, perde: 'Mi · Hüseynî (Güçlü)'},
      {freq: 329.63, perde: 'Mi · Hüseynî (Mızrap)'},
      {freq: 392.0, perde: 'Sol · Gerdâniye'},
      {freq: 349.23, perde: 'Fa · Acem'},
      {freq: 329.63, perde: 'Mi · Hüseynî'},
      {freq: 293.66, perde: 'Re · Nevâ'},
      {freq: 261.63, perde: 'Do · Çârgâh'},
      {freq: 240.0, perde: 'Si · Segâh / Uşşak'},
      {freq: 220.0, perde: 'La · Dügâh (Karar)'},
    ];

    let step = 0;
    const triggerPluck = (note: {freq: number; perde: string}) => {
      if (!this.isPlaying() && step > 0) return;
      this.activeNoteLabel.set(note.perde);
      const now = ctx.currentTime;
      const freq = note.freq;

      // Primary warm wooden string + octave harmonic (tel tınısı)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);

      // Wooden resonator body filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1650, now);
      filter.frequency.exponentialRampToValueAtTime(340, now + 1.05);
      filter.Q.setValueAtTime(3.2, now);

      // Plucked envelope
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.001, now);
      env.gain.linearRampToValueAtTime(0.26, now + 0.022);
      env.gain.exponentialRampToValueAtTime(0.001, now + 1.28);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(env);
      env.connect(destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.32);
      osc2.stop(now + 1.32);
    };

    // Play first note immediately, then step gently
    triggerPluck(huseyniMelody[0]);
    const intervalId = setInterval(() => {
      step = (step + 1) % huseyniMelody.length;
      triggerPluck(huseyniMelody[step]);
    }, 950);

    this.activeNodes.push(intervalId);
  }

  /**
   * 100% Royalty-Free Horasan Kopuzu & Dem Meydanı (Contemplative Uşşak Cadence)
   */
  private buildSemahDem(ctx: AudioContext, destination: GainNode): void {
    const baseDrone = [146.83, 220.0, 293.66]; // Re - La - Re (Karadüzen akordu)
    baseDrone.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(520, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.11, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);
      osc.start();
      this.activeNodes.push(osc, filter, gain);
    });

    const kopuzNotes = [293.66, 329.63, 349.23, 440.0, 392.0, 349.23, 329.63, 293.66];
    let idx = 0;
    const pluckKopuz = (freq: number) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.Q.setValueAtTime(2.5, now);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.001, now);
      env.gain.linearRampToValueAtTime(0.22, now + 0.025);
      env.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc.connect(filter);
      filter.connect(env);
      env.connect(destination);
      osc.start(now);
      osc.stop(now + 1.65);
    };

    pluckKopuz(kopuzNotes[0]);
    const intervalId = setInterval(() => {
      idx = (idx + 1) % kopuzNotes.length;
      pluckKopuz(kopuzNotes[idx]);
    }, 1250);

    this.activeNodes.push(intervalId);
  }

  /**
   * Synthesizes warm, acoustic Ney breath & Tanbûr drone (Rast / Hicaz D2, A2, D3 chords)
   */
  private buildNeyDrone(ctx: AudioContext, destination: GainNode): void {
    const fundFrequencies = [146.83, 220.0, 293.66, 440.0];
    fundFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750 + idx * 120, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.18 + idx * 0.05, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(1.8, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      const oscGain = ctx.createGain();
      const level = idx === 0 ? 0.22 : idx === 1 ? 0.16 : 0.08;
      oscGain.gain.setValueAtTime(level, ctx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(destination);

      osc.start();
      lfo.start();

      this.activeNodes.push(osc, lfo, lfoGain, filter, oscGain);
    });
  }

  /**
   * Synthesizes gentle library rain sound using procedural pink noise & lowpass filter
   */
  private buildLibraryRain(ctx: AudioContext, destination: GainNode): void {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, ctx.currentTime);
    filter.Q.setValueAtTime(1.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, gain);
  }

  /**
   * Synthesizes 432 Hz pure contemplative harmony with 10 Hz alpha wave binaural beat
   */
  private buildDeepContemplation(ctx: AudioContext, destination: GainNode): void {
    const baseFreq = 432.0;
    const binauralDiff = 10.0;

    const oscL = ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    const oscR = ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(baseFreq + binauralDiff, ctx.currentTime);

    const oscSub = ctx.createOscillator();
    oscSub.type = 'triangle';
    oscSub.frequency.setValueAtTime(baseFreq / 2, ctx.currentTime);

    const gainL = ctx.createGain();
    gainL.gain.setValueAtTime(0.18, ctx.currentTime);
    const gainR = ctx.createGain();
    gainR.gain.setValueAtTime(0.18, ctx.currentTime);
    const gainSub = ctx.createGain();
    gainSub.gain.setValueAtTime(0.12, ctx.currentTime);

    oscL.connect(gainL);
    gainL.connect(destination);

    oscR.connect(gainR);
    gainR.connect(destination);

    oscSub.connect(gainSub);
    gainSub.connect(destination);

    oscL.start();
    oscR.start();
    oscSub.start();

    this.activeNodes.push(oscL, oscR, oscSub, gainL, gainR, gainSub);
  }

  private startTimerCountdown(): void {
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      const remaining = this.remainingSeconds();
      if (remaining <= 1) {
        this.stop();
      } else {
        this.remainingSeconds.set(remaining - 1);
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
