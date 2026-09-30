import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {DailyVerse} from '../../../core/models/daily-verse.model';

@Component({
  selector: 'app-verse-commentary',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 sm:p-8 rounded-3xl bg-glass-card space-y-4 relative z-10">
      <div class="flex items-center justify-between pb-3 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-cyan-500/25 border border-cyan-400/40 flex items-center justify-center font-serif text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-950/20">
            YD
          </div>
          <span class="text-xs font-serif font-bold text-cyan-300 uppercase tracking-widest">
            Şerh & Tefekkür Notu
          </span>
        </div>
      </div>

      <p class="font-serif text-base sm:text-lg text-stone-200 leading-relaxed italic text-glow-cyan/20">
        &ldquo;{{ verse().scholarlyCommentary }}&rdquo;
      </p>

      <div class="pt-4 flex items-center justify-between text-[11px] text-stone-500 border-t border-white/5">
        <div class="flex items-center gap-2">
          @for (tag of verse().philosophicalThemes; track tag) {
            <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 font-mono uppercase">#{{ tag }}</span>
          }
        </div>
        <button
          (click)="download.emit()"
          class="text-cyan-400 hover:text-cyan-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>KART OLARAK İNDİR</span>
          <mat-icon class="!w-3.5 !h-3.5 !text-xs">arrow_forward</mat-icon>
        </button>
      </div>
    </div>
  `
})
export class VerseCommentary {
  verse = input.required<DailyVerse>();
  download = output<void>();
}
