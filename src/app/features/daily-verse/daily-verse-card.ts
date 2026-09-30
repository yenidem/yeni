import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {DAILY_VERSES} from '../../core/data/daily-verse.data';
import {DailyVerse} from '../../core/models/daily-verse.model';
import {SpeechService} from '../../core/services/speech.service';
import {downloadStoryCard} from './utils/verse-canvas.util';
import {VerseHeader} from './components/verse-header';
import {VerseContent} from './components/verse-content';
import {VerseGlossary} from './components/verse-glossary';
import {VerseCommentary} from './components/verse-commentary';

@Component({
  selector: 'app-daily-verse-card',
  imports: [
    VerseHeader,
    VerseContent,
    VerseGlossary,
    VerseCommentary
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative overflow-hidden rounded-[3rem] bg-glass-blue border border-sky-500/30 p-6 sm:p-10 shadow-2xl space-y-8">
      <!-- Background Ambient Glow -->
      <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
      <div class="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>

      <app-verse-header 
        [verse]="currentVerse()"
        (listen)="listenVerse()"
        (download)="onDownload()"
        (next)="nextVerse()"
      />

      <app-verse-content 
        [verse]="currentVerse()"
        [showGlossary]="showGlossary()"
        [showCommentary]="showCommentary()"
        (toggleGlossary)="toggleGlossary()"
        (toggleCommentary)="toggleCommentary()"
      />

      @if (showGlossary()) {
        <app-verse-glossary [glossary]="currentVerse().glossary" />
      }

      @if (showCommentary()) {
        <app-verse-commentary 
          [verse]="currentVerse()"
          (download)="onDownload()"
        />
      }
    </section>
  `,
})
export class DailyVerseComponent {
  private readonly speechService = inject(SpeechService);

  readonly currentIndex = signal<number>(0);
  readonly showGlossary = signal<boolean>(false);
  readonly showCommentary = signal<boolean>(true);

  readonly currentVerse = computed<DailyVerse>(() => {
    return DAILY_VERSES[this.currentIndex()];
  });

  nextVerse(): void {
    this.currentIndex.update((i) => (i + 1) % DAILY_VERSES.length);
  }

  toggleGlossary(): void {
    this.showGlossary.update((v) => !v);
  }

  toggleCommentary(): void {
    this.showCommentary.update((v) => !v);
  }

  listenVerse(): void {
    const v = this.currentVerse();
    const text = `${v.stanzaLine1}. ${v.stanzaLine2}. Şair: ${v.poet}. Orçun Kundakcı şerhi: ${v.scholarlyCommentary}`;
    this.speechService.speak(text, `${v.poet} - Günün Beyti`);
  }

  onDownload(): void {
    downloadStoryCard(this.currentVerse());
  }
}
