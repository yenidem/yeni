import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {HeritageCategory, HeritageSlide} from '../../models/heritage-slide.model';

@Component({
  selector: 'app-slide-navigation',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3 pt-4 border-t border-amber-500/20 relative z-10">
      <!-- Top Filter & Playback Bar -->
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            (click)="categoryChange.emit('all')"
            class="px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer border"
            [class.bg-amber-500]="activeCategory() === 'all'"
            [class.text-stone-950]="activeCategory() === 'all'"
            [class.border-amber-300]="activeCategory() === 'all'"
            [class.font-bold]="activeCategory() === 'all'"
            [class.bg-white/5]="activeCategory() !== 'all'"
            [class.text-stone-300]="activeCategory() !== 'all'"
            [class.border-white/10]="activeCategory() !== 'all'"
          >
            Tüm Kürsü (9)
          </button>
          <button
            type="button"
            (click)="categoryChange.emit('cumhuriyet')"
            class="px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer border"
            [class.bg-amber-500]="activeCategory() === 'cumhuriyet'"
            [class.text-stone-950]="activeCategory() === 'cumhuriyet'"
            [class.border-amber-300]="activeCategory() === 'cumhuriyet'"
            [class.font-bold]="activeCategory() === 'cumhuriyet'"
            [class.bg-white/5]="activeCategory() !== 'cumhuriyet'"
            [class.text-stone-300]="activeCategory() !== 'cumhuriyet'"
            [class.border-white/10]="activeCategory() !== 'cumhuriyet'"
          >
            Atatürk
          </button>
          <button
            type="button"
            (click)="categoryChange.emit('pir')"
            class="px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer border"
            [class.bg-amber-500]="activeCategory() === 'pir'"
            [class.text-stone-950]="activeCategory() === 'pir'"
            [class.border-amber-300]="activeCategory() === 'pir'"
            [class.font-bold]="activeCategory() === 'pir'"
            [class.bg-white/5]="activeCategory() !== 'pir'"
            [class.text-stone-300]="activeCategory() !== 'pir'"
            [class.border-white/10]="activeCategory() !== 'pir'"
          >
            Hacı Bektâş-ı Velî
          </button>
          <button
            type="button"
            (click)="categoryChange.emit('yedi-ulu-ozan')"
            class="px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer border"
            [class.bg-amber-500]="activeCategory() === 'yedi-ulu-ozan'"
            [class.text-stone-950]="activeCategory() === 'yedi-ulu-ozan'"
            [class.border-amber-300]="activeCategory() === 'yedi-ulu-ozan'"
            [class.font-bold]="activeCategory() === 'yedi-ulu-ozan'"
            [class.bg-white/5]="activeCategory() !== 'yedi-ulu-ozan'"
            [class.text-stone-300]="activeCategory() !== 'yedi-ulu-ozan'"
            [class.border-white/10]="activeCategory() !== 'yedi-ulu-ozan'"
          >
            Yedi Ulu Ozan (7)
          </button>
        </div>

        <!-- Prev / AutoPlay / Next Controls -->
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            (click)="prev.emit()"
            class="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-stone-200 hover:text-amber-300 border border-white/10 transition-colors cursor-pointer flex items-center justify-center"
            title="Önceki Slayt"
          >
            <mat-icon class="!w-4 !h-4 !text-base">chevron_left</mat-icon>
          </button>

          <button
            type="button"
            (click)="toggleAutoPlay.emit()"
            class="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-stone-300 hover:text-amber-200 border border-white/10 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
            [title]="isAutoPlay() ? 'Otomatik geçişi duraklat' : 'Otomatik geçişi başlat'"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm text-amber-400">
              {{ isAutoPlay() ? 'pause' : 'play_arrow' }}
            </mat-icon>
            <span>{{ activeIndex() + 1 }}/{{ slides().length }}</span>
          </button>

          <button
            type="button"
            (click)="next.emit()"
            class="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-stone-200 hover:text-amber-300 border border-white/10 transition-colors cursor-pointer flex items-center justify-center"
            title="Sonraki Slayt"
          >
            <mat-icon class="!w-4 !h-4 !text-base">chevron_right</mat-icon>
          </button>
        </div>
      </div>

      <!-- 9-Figure Selector Grid (3x3 Balanced Grid) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        @for (item of slides(); track item.id; let idx = $index) {
          <button
            type="button"
            (click)="selectSlide.emit(idx)"
            class="px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-0.5"
            [class.bg-sky-500/25]="idx === activeIndex()"
            [class.border-cyan-300]="idx === activeIndex()"
            [class.shadow-lg]="idx === activeIndex()"
            [class.bg-[#0a1b3d]/80]="idx !== activeIndex()"
            [class.border-sky-400/20]="idx !== activeIndex()"
            [class.hover:border-sky-300/50]="idx !== activeIndex()"
          >
            <span class="text-[10px] font-mono text-cyan-300/90 truncate">
              {{ item.categoryLabel }}
            </span>
            <span
              class="text-xs font-serif font-semibold truncate"
              [class.text-white]="idx === activeIndex()"
              [class.text-sky-100]="idx !== activeIndex()"
            >
              {{ item.name }}
            </span>
          </button>
        }
      </div>
    </div>
  `,
})
export class SlideNavigationComponent {
  readonly slides = input.required<HeritageSlide[]>();
  readonly activeIndex = input.required<number>();
  readonly isAutoPlay = input.required<boolean>();
  readonly activeCategory = input.required<'all' | HeritageCategory>();

  readonly selectSlide = output<number>();
  readonly prev = output<void>();
  readonly next = output<void>();
  readonly toggleAutoPlay = output<void>();
  readonly categoryChange = output<'all' | HeritageCategory>();
}
