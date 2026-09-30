import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AcademicArticle } from '../../../../../core/models/article.model';
import { DisciplineBadge } from '../../../../../shared/components/badge/discipline-badge';

@Component({
  selector: 'app-detail-header',
  imports: [DatePipe, MatIconModule, DisciplineBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="space-y-4 pb-8 border-b border-white/10">
      <!-- Discipline and Reading Controls -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <app-discipline-badge [discipline]="article().discipline" />

        <div class="flex items-center gap-3 text-xs text-stone-300 font-mono">
          <span class="flex items-center gap-1">
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">schedule</mat-icon>
            <span>~{{ article().readingTimeMinutes }} dk okuma</span>
          </span>
          <span>&bull;</span>
          <span class="flex items-center gap-1">
            <mat-icon class="!w-4 !h-4 !text-base text-cyan-400">visibility</mat-icon>
            <span>{{ article().viewCount }} okuma</span>
          </span>
        </div>
      </div>

      <!-- Main Title -->
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight tracking-tight">
        {{ article().title }}
      </h1>

      <!-- Subtitle -->
      @if (article().subtitle) {
        <p class="text-base sm:text-lg text-amber-200/90 font-serif italic leading-relaxed">
          {{ article().subtitle }}
        </p>
      }

      <!-- Author and Metadata Bar -->
      <div class="pt-3 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-full p-0.5 bg-gradient-to-br from-cyan-300/60 via-sky-500/40 to-blue-800/60 flex items-center justify-center shadow-[0_0_18px_rgba(56,189,248,0.4)] shrink-0 overflow-hidden">
            <img
              src="/logo.svg"
              alt="YENİDEM Logosu"
              class="w-10 h-10 object-contain rounded-full"
            />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-serif font-bold text-white">Orçun Kundakcı</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-serif font-semibold">
                Kürsü Sahibi
              </span>
            </div>
            <p class="text-[11px] text-stone-300 font-sans">
              {{ article().detailedDateTr || (article().publishedAt | date: 'longDate') }}
            </p>
          </div>
        </div>

        <!-- Social Share, Bookmark & Citation Actions -->
        <div class="flex items-center gap-2">
          <!-- Bookmark Button -->
          <button
            type="button"
            (click)="bookmark.emit()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-serif font-semibold transition-colors cursor-pointer"
            [class.bg-amber-500/20]="isBookmarked()"
            [class.border-amber-500/40]="isBookmarked()"
            [class.text-amber-300]="isBookmarked()"
            [class.bg-[#0f172a]]="!isBookmarked()"
            [class.border-white/10]="!isBookmarked()"
            [class.text-stone-300]="!isBookmarked()"
            [class.hover:bg-[#162340]]="!isBookmarked()"
            [title]="isBookmarked() ? 'Okuma Listesinden Çıkar' : 'Okuma Listeme Kaydet'"
          >
            <mat-icon class="!w-4 !h-4 !text-base" [class.text-amber-400]="isBookmarked()">
              {{ isBookmarked() ? 'bookmark' : 'bookmark_border' }}
            </mat-icon>
            <span>{{ isBookmarked() ? 'Kaydedildi' : 'Kaydet' }}</span>
          </button>

          <button
            type="button"
            (click)="share.emit()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-[#162340] border border-white/10 text-stone-200 text-xs font-serif font-semibold transition-colors cursor-pointer"
            title="Sosyal Ağlarda ve Akademik Platformlarda Paylaş"
          >
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">share</mat-icon>
            <span>Paylaş</span>
          </button>

          <button
            type="button"
            (click)="copyCitation.emit()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-[#162340] border border-white/10 text-stone-200 text-xs font-serif font-semibold transition-colors cursor-pointer"
            title="Akademik Atıf Kopyala (İSNAD, APA, MLA, BibTeX)"
          >
            <mat-icon class="!w-4 !h-4 !text-base text-cyan-400">format_quote</mat-icon>
            <span>Atıf Al</span>
          </button>

          <button
            type="button"
            (click)="quoteCard.emit()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-serif font-semibold transition-colors cursor-pointer"
            title="Akademik Alıntı Kartı Oluştur ve İndir"
          >
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">palette</mat-icon>
            <span>Alıntı Kartı</span>
          </button>
        </div>
      </div>
    </header>
  `,
})
export class DetailHeaderComponent {
  article = input.required<AcademicArticle>();
  isBookmarked = input<boolean>(false);
  share = output<void>();
  copyCitation = output<void>();
  bookmark = output<void>();
  quoteCard = output<void>();
}
