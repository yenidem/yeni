import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {DisciplineType} from '../../../../core/models/article.model';

export type ArchiveSortOrder = 'newest' | 'popular' | 'quick';
export type ArchiveViewMode = 'grid' | 'index';

@Component({
  selector: 'app-article-filter-bar',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <section class="p-5 sm:p-6 rounded-3xl bg-glass-blue space-y-5">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-300/35 flex items-center justify-center shadow-[0_0_18px_rgba(56,189,248,0.25)]">
              <mat-icon class="!w-5 !h-5 !text-lg icon-luminous">library_books</mat-icon>
            </div>
            <div>
              <h2 class="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">
                Akademik Külliyat & Makale Arşivi
              </h2>
              <p class="text-xs text-sky-200/85 font-sans">
                Türk Dili ve Edebiyatı, Felsefe ve Disiplinlerarası İrfan Araştırmaları ({{ totalCount() }} makale)
              </p>
            </div>
          </div>
        </div>

        <!-- Instant Search Input + View Switcher -->
        <div class="flex items-center gap-2.5 w-full md:w-auto">
          <div class="relative flex-1 md:w-72">
            <mat-icon class="absolute left-3.5 top-1/2 -translate-y-1/2 !w-4 !h-4 !text-base icon-luminous pointer-events-none">
              search
            </mat-icon>
            <input
              type="text"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              placeholder="Makale, kavram veya düşünür ara..."
              class="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#061229]/90 border border-sky-300/30 text-xs text-white placeholder-sky-200/50 focus:outline-hidden focus:border-cyan-300 transition-colors shadow-inner"
            />
            @if (searchQuery()) {
              <button
                type="button"
                (click)="searchChange.emit('')"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
                title="Aramayı Temizle"
              >
                <mat-icon class="!w-4 !h-4 !text-sm">close</mat-icon>
              </button>
            }
          </div>

          <!-- View Mode Toggle (Grid vs Scholarly Index) -->
          <div class="flex items-center p-1 rounded-xl bg-[#061229]/90 border border-sky-400/25 shrink-0">
            <button
              type="button"
              (click)="viewModeChange.emit('grid')"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              [class.bg-sky-500/30]="viewMode() === 'grid'"
              [class.text-cyan-200]="viewMode() === 'grid'"
              [class.text-stone-400]="viewMode() !== 'grid'"
              title="Vitrin Kart Görünümü"
            >
              <mat-icon class="!w-4 !h-4 !text-base">grid_view</mat-icon>
            </button>
            <button
              type="button"
              (click)="viewModeChange.emit('index')"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              [class.bg-sky-500/30]="viewMode() === 'index'"
              [class.text-cyan-200]="viewMode() === 'index'"
              [class.text-stone-400]="viewMode() !== 'index'"
              title="Akademik Fihrist / Liste Görünümü"
            >
              <mat-icon class="!w-4 !h-4 !text-base">format_list_bulleted</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Discipline Filter Tabs & Sort Controls -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-sky-300/20">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            (click)="disciplineChange.emit('all')"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
            [class.nav-pill-btn-active]="selectedDiscipline() === 'all'"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">apps</mat-icon>
            <span>Tümü</span>
          </button>

          <button
            type="button"
            (click)="disciplineChange.emit('tde')"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
            [class.nav-pill-btn-active]="selectedDiscipline() === 'tde'"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">menu_book</mat-icon>
            <span>Türk Dili ve Edebiyatı</span>
          </button>

          <button
            type="button"
            (click)="disciplineChange.emit('felsefe')"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
            [class.nav-pill-btn-active]="selectedDiscipline() === 'felsefe'"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">psychology</mat-icon>
            <span>Felsefe & Mantık</span>
          </button>

          <button
            type="button"
            (click)="disciplineChange.emit('kesisim')"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
            [class.nav-pill-btn-active]="selectedDiscipline() === 'kesisim'"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">auto_stories</mat-icon>
            <span>Disiplinlerarası Kesişim</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <!-- Sort Selector -->
          <div class="flex items-center gap-1 bg-[#061229]/80 p-1 rounded-xl border border-sky-400/20 text-[11px]">
            <button
              type="button"
              (click)="sortOrderChange.emit('newest')"
              class="px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
              [class.bg-sky-500/30]="sortOrder() === 'newest'"
              [class.text-cyan-200]="sortOrder() === 'newest'"
              [class.text-stone-300]="sortOrder() !== 'newest'"
            >
              En Yeni
            </button>
            <button
              type="button"
              (click)="sortOrderChange.emit('popular')"
              class="px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
              [class.bg-sky-500/30]="sortOrder() === 'popular'"
              [class.text-cyan-200]="sortOrder() === 'popular'"
              [class.text-stone-300]="sortOrder() !== 'popular'"
            >
              Çok Okunan
            </button>
            <button
              type="button"
              (click)="sortOrderChange.emit('quick')"
              class="px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
              [class.bg-sky-500/30]="sortOrder() === 'quick'"
              [class.text-cyan-200]="sortOrder() === 'quick'"
              [class.text-stone-300]="sortOrder() !== 'quick'"
            >
              Kısa Etüt
            </button>
          </div>

          @if (selectedDiscipline() !== 'all' || searchQuery()) {
            <button
              type="button"
              (click)="resetAll.emit()"
              class="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-sm icon-luminous-amber">filter_alt_off</mat-icon>
              <span>Sıfırla</span>
            </button>
          }
        </div>
      </div>
    </section>
  `,
})
export class ArticleFilterBar {
  selectedDiscipline = input.required<DisciplineType | 'all'>();
  searchQuery = input.required<string>();
  totalCount = input.required<number>();
  sortOrder = input<ArchiveSortOrder>('newest');
  viewMode = input<ArchiveViewMode>('grid');

  disciplineChange = output<DisciplineType | 'all'>();
  searchChange = output<string>();
  sortOrderChange = output<ArchiveSortOrder>();
  viewModeChange = output<ArchiveViewMode>();
  resetAll = output<void>();

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchChange.emit(val);
  }
}
