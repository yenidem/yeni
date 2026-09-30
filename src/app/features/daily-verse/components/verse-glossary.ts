import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-verse-glossary',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 rounded-[2rem] bg-[#060a14]/95 border border-sky-500/20 space-y-4 animate-in fade-in zoom-in-95 duration-300 relative z-10">
      <div class="flex items-center justify-between pb-3 border-b border-white/5">
        <span class="text-xs font-serif font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-widest">
          <mat-icon class="!w-4 !h-4 !text-base">translate</mat-icon>
          Kelimeler & Istılahlar
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        @for (item of glossary(); track item.word) {
          <div class="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:bg-white/10 transition-colors">
            <div class="flex items-center justify-between">
              <span class="font-serif font-bold text-sm text-cyan-200">{{ item.word }}</span>
              @if (item.origin) {
                <span class="text-[9px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300/80 font-mono font-bold">{{ item.origin }}</span>
              }
            </div>
            <p class="text-xs text-stone-400 leading-snug">{{ item.meaning }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class VerseGlossary {
  glossary = input.required<{word: string; meaning: string; origin?: string}[]>();
}
