import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  readonly isSupported = signal<boolean>(false);
  readonly isSpeaking = signal<boolean>(false);
  readonly isPaused = signal<boolean>(false);
  readonly currentRate = signal<number>(1.0);
  readonly currentTitle = signal<string>('');
  readonly activeSubtitle = signal<string>('');

  private utterance: SpeechSynthesisUtterance | null = null;
  private sentenceQueue: string[] = [];
  private currentSentenceIndex = 0;
  private fallbackTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.isSupported.set(true);
      try {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      } catch {
        // Ignore voice enumeration errors
      }
    }
  }

  speak(text: string, title = 'Akademik Makale'): void {
    this.stop();

    const cleanText = text
      .replace(/#+\s+/g, '')
      .replace(/\*{1,3}/g, '')
      .replace(/`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/>\s+/g, '')
      .replace(/---+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    this.sentenceQueue = cleanText
      .split(/(?<=[.!?…/])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (this.sentenceQueue.length === 0) {
      this.sentenceQueue = [cleanText];
    }

    this.currentSentenceIndex = 0;
    this.currentTitle.set(title);
    this.isSpeaking.set(true);
    this.isPaused.set(false);
    this.activeSubtitle.set(this.sentenceQueue[0]);

    if (!this.isSupported()) {
      this.startVisualTeleprompterFallback();
      return;
    }

    this.speakCurrentSentence();
  }

  private speakCurrentSentence(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.currentSentenceIndex >= this.sentenceQueue.length) {
      this.stop();
      return;
    }

    const sentence = this.sentenceQueue[this.currentSentenceIndex];
    this.activeSubtitle.set(sentence);

    try {
      const utter = new SpeechSynthesisUtterance(sentence);
      utter.lang = 'tr-TR';
      utter.rate = this.currentRate();
      utter.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const trVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith('tr')) ||
        voices.find((v) => v.name.toLowerCase().includes('turk'));
      if (trVoice) {
        utter.voice = trVoice;
      }

      utter.onstart = () => {
        this.isSpeaking.set(true);
        this.isPaused.set(false);
      };

      utter.onend = () => {
        if (!this.isSpeaking()) return;
        this.currentSentenceIndex++;
        if (this.currentSentenceIndex < this.sentenceQueue.length) {
          this.speakCurrentSentence();
        } else {
          this.isSpeaking.set(false);
          this.isPaused.set(false);
          this.currentTitle.set('');
          this.activeSubtitle.set('');
        }
      };

      utter.onerror = () => {
        // If browser blocks native TTS or lacks a voice, gracefully continue with teleprompter
        if (this.isSpeaking()) {
          this.startVisualTeleprompterFallback();
        }
      };

      this.utterance = utter;
      window.speechSynthesis.speak(utter);
    } catch {
      this.startVisualTeleprompterFallback();
    }
  }

  private startVisualTeleprompterFallback(): void {
    this.clearFallbackTimer();
    this.fallbackTimer = setInterval(() => {
      if (this.isPaused()) return;
      this.currentSentenceIndex++;
      if (this.currentSentenceIndex < this.sentenceQueue.length) {
        this.activeSubtitle.set(this.sentenceQueue[this.currentSentenceIndex]);
      } else {
        this.stop();
      }
    }, 4200);
  }

  private clearFallbackTimer(): void {
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  pause(): void {
    this.isPaused.set(true);
    if (this.isSupported() && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.pause();
      } catch {
        // Ignore
      }
    }
  }

  resume(): void {
    this.isPaused.set(false);
    if (this.isSupported() && window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.resume();
      } catch {
        // Ignore
      }
    }
  }

  togglePlayPause(): void {
    if (this.isPaused()) {
      this.resume();
    } else if (this.isSpeaking()) {
      this.pause();
    }
  }

  stop(): void {
    this.clearFallbackTimer();
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    this.utterance = null;
    this.sentenceQueue = [];
    this.currentSentenceIndex = 0;
    this.isSpeaking.set(false);
    this.isPaused.set(false);
    this.currentTitle.set('');
    this.activeSubtitle.set('');
  }

  setRate(rate: number): void {
    const clamped = Math.max(0.75, Math.min(1.5, rate));
    this.currentRate.set(clamped);
    if (this.utterance) {
      this.utterance.rate = clamped;
    }
  }
}
