import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {DailyVerse} from '../../../core/models/daily-verse.model';

@Component({
  selector: 'app-verse-content',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative py-3 sm:py-4 text-center space-y-4 z-10">
      <div class="inline-block p-6 sm:p-9 rounded-3xl bg-gradient-to-b from-[#081736]/90 via-[#0d2452]/90 to-[#153878]/90 border border-sky-300/35 shadow-[0_20px_45px_-12px_rgba(2,8,23,0.85),inset_0_-20px_35px_-10px_rgba(186,230,253,0.2)] max-w-3xl mx-auto w-full relative group">
        <span class="absolute top-4 left-6 text-5xl font-serif text-cyan-500/20 select-none group-hover:text-cyan-500/40 transition-colors">&ldquo;</span>

        <p class="font-serif text-lg sm:text-xl xl:text-2xl text-cyan-50 text-glow-cyan font-medium tracking-wide leading-relaxed">
          {{ verse().stanzaLine1 }}
        </p>
        <p class="font-serif text-lg sm:text-xl xl:text-2xl text-sky-200 font-medium tracking-wide leading-relaxed pt-2">
          {{ verse().stanzaLine2 }}
        </p>

        <span class="absolute bottom-4 right-6 text-5xl font-serif text-cyan-500/20 select-none group-hover:text-cyan-500/40 transition-colors">&rdquo;</span>

        <div class="pt-6 flex items-center justify-center gap-2 text-sm font-serif text-cyan-300/90">
          <span class="font-bold uppercase tracking-widest">&mdash; {{ verse().poet }}</span>
          @if (verse().sourceWork) {
            <span class="text-stone-500 font-sans italic">({{ verse().sourceWork }})</span>
          }
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-stone-300 font-mono text-[11px]">
          <mat-icon class="!w-4 !h-4 !text-base text-cyan-400">music_note</mat-icon>
          <span>{{ verse().meterType }}: <strong>{{ verse().meter }}</strong></span>
        </div>

        <button
          (click)="toggleGlossary.emit()"
          class="nav-pill-btn !h-10"
          [class.nav-pill-btn-active]="showGlossary()"
        >
          <mat-icon class="!w-4 !h-4 !text-base">translate</mat-icon>
          <span>Lügat</span>
        </button>

        <button
          (click)="toggleCommentary.emit()"
          class="nav-pill-btn !h-10"
          [class.nav-pill-btn-active]="showCommentary()"
        >
          <mat-icon class="!w-4 !h-4 !text-base">history_edu</mat-icon>
          <span>Şerh</span>
        </button>
      </div>
    </div>
  `
})
export class VerseContent {
  verse = input.required<DailyVerse>();
  showGlossary = input.required<boolean>();
  showCommentary = input.required<boolean>();
  toggleGlossary = output<void>();
  toggleCommentary = output<void>();
}
