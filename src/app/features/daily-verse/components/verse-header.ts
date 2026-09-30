import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {DailyVerse} from '../../../core/models/daily-verse.model';

@Component({
  selector: 'app-verse-header',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sky-500/20 relative z-10">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-cyan-300">
          <mat-icon class="!w-4 !h-4 !text-base">auto_stories</mat-icon>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-serif font-bold text-cyan-300 tracking-wide uppercase">Günün Beyti & Tefekkürü</span>
          </div>
          <span class="text-[11px] text-stone-400 font-sans">
            {{ verse().poet }} ({{ verse().poetDates }})
          </span>
        </div>
      </div>

      <div class="flex items-center gap-1.5">
        <button (click)="listen.emit()" class="luxury-icon-btn !w-9 !h-9" title="Sesli Dinle">
          <mat-icon class="!w-4 !h-4 !text-base text-cyan-300">volume_up</mat-icon>
        </button>
        <button (click)="download.emit()" class="luxury-icon-btn !w-9 !h-9" title="Kart İndir">
          <mat-icon class="!w-4 !h-4 !text-base text-sky-300">download</mat-icon>
        </button>
        <button (click)="next.emit()" class="luxury-icon-btn !w-9 !h-9" title="Sıradaki">
          <mat-icon class="!w-4 !h-4 !text-base text-cyan-400">shuffle</mat-icon>
        </button>
      </div>
    </div>
  `
})
export class VerseHeader {
  verse = input.required<DailyVerse>();
  listen = output<void>();
  download = output<void>();
  next = output<void>();
}
