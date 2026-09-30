import {ChangeDetectionStrategy, Component, inject, input, output, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {AcademicArticle, DISCIPLINE_DEFINITIONS} from '../../../../core/models/article.model';
import {SeoCardService, SharePayload} from '../../../../core/services/seo-card.service';
import {ReaderComfortService} from '../../../../core/services/reader-comfort.service';

@Component({
  selector: 'app-article-card',
  imports: [RouterLink, DatePipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full',
  },
  template: `
    <article class="h-full flex flex-col justify-between rounded-3xl bg-glass-card overflow-hidden group">
      <div>
        <!-- Cover Visual or Standardized Official YENİDEM Emblem Header -->
        <a [routerLink]="['/makale', article().id]" class="block relative h-48 overflow-hidden bg-gradient-to-br from-[#0e295c] via-[#0a1d42] to-[#061229] border-b border-sky-300/25">
          @if (article().coverImage && !imgError()) {
            <img
              [src]="article().coverImage"
              [alt]="article().coverImageAlt || article().title"
              (error)="imgError.set(true)"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerpolicy="no-referrer"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#06142e] via-[#06142e]/35 to-transparent"></div>
          } @else {
            <img
              src="/assets/default-article-cover.svg"
              [alt]="article().title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#06142e] via-[#06142e]/30 to-transparent"></div>
          }

          <!-- Top-left Standardized Media Badge -->
          <div class="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-[#050f24]/90 border border-amber-300/40 flex items-center gap-1 text-[10px] font-mono text-amber-200">
            <mat-icon class="!w-3 !h-3 !text-xs icon-luminous-amber">high_quality</mat-icon>
            <span>STANDART GÖRSEL</span>
          </div>

          <!-- Top-right Cryptographic Integrity Indicator -->
          <div class="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-[#050f24]/90 border border-sky-300/30 flex items-center gap-1 text-[10px] font-mono text-cyan-200">
            <mat-icon class="!w-3 !h-3 !text-xs icon-luminous-emerald">verified</mat-icon>
            <span>SHA3-512</span>
          </div>

          <!-- Bottom-left unboxed metadata on scrim -->
          <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2 text-xs text-stone-100 font-medium">
            <div class="flex items-center gap-1.5 truncate">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">{{ getDisciplineMeta().icon }}</mat-icon>
              <span class="font-semibold text-amber-300 truncate">{{ getDisciplineMeta().shortLabel }}</span>
              <span aria-hidden="true">·</span>
              <span class="font-mono tabular-nums text-[11px] text-sky-200">{{ article().readingTimeMinutes }} dk</span>
            </div>
            <span class="font-mono tabular-nums text-[11px] text-sky-200/90 shrink-0">
              {{ article().publishedAt | date:'dd.MM.yyyy' }}
            </span>
          </div>
        </a>

        <!-- Card Body -->
        <div class="p-5 sm:p-6 space-y-3">
          <a [routerLink]="['/makale', article().id]" class="block space-y-1.5">
            <h3 class="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-cyan-200 transition-colors line-clamp-2">
              {{ article().title }}
            </h3>
            @if (article().subtitle) {
              <p class="text-xs font-medium text-sky-200/90 line-clamp-1">
                {{ article().subtitle }}
              </p>
            }
          </a>

          <p class="text-xs sm:text-sm text-stone-100/90 leading-relaxed line-clamp-3 font-sans">
            {{ article().abstract }}
          </p>

          <!-- Clickable Keyword Filter Links -->
          @if (article().keywords && article().keywords.length > 0) {
            <div class="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-cyan-300/90">
              @for (kw of article().keywords.slice(0, 4); track kw; let last = $last) {
                <button
                  type="button"
                  (click)="keywordClick.emit(kw)"
                  class="hover:text-amber-300 hover:underline transition-colors cursor-pointer font-mono"
                >
                  #{{ kw }}
                </button>
                @if (!last) {
                  <span aria-hidden="true" class="text-sky-300/30">·</span>
                }
              }
            </div>
          }
        </div>
      </div>

      <!-- Card Footer Actions with Direct Full-Screen Eye-Comfort Reader + Social Sharing -->
      <div class="px-4 sm:px-5 py-3.5 border-t border-sky-300/20 bg-[#071633]/75 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-1">
          <button
            type="button"
            (click)="bookmarkToggle.emit(article())"
            class="luxury-icon-btn !w-8 !h-8"
            [title]="isBookmarked() ? 'Okuma Listesinden Çıkar' : 'Okuma Listesine Ekle'"
          >
            <mat-icon
              class="!w-4 !h-4 !text-sm"
              [class.icon-luminous-amber]="isBookmarked()"
              [class.text-stone-300]="!isBookmarked()"
            >
              {{ isBookmarked() ? 'bookmark' : 'bookmark_border' }}
            </mat-icon>
          </button>

          <button
            type="button"
            (click)="listenClick.emit(article())"
            class="luxury-icon-btn !w-8 !h-8"
            title="Makale Özetini Sesli Dinle"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">volume_up</mat-icon>
          </button>

          <button
            type="button"
            (click)="copyArticleLink()"
            class="luxury-icon-btn !w-8 !h-8"
            title="Makale Bağlantısını ve Kartvizit Özeti Kopyala"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">link</mat-icon>
          </button>

          <button
            type="button"
            (click)="shareClick.emit(article())"
            class="luxury-icon-btn !w-8 !h-8"
            title="Sosyal Paylaşım Kartı (.PNG) Stüdyosu"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">share</mat-icon>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="readerComfort.openArticleInComfortReader(article())"
            class="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-300/50 text-amber-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
            title="Göz Yormayan Tam Ekran Konfor Modunda Aç (Parşömen / E-Mürekkep / Gece Safir)"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">fullscreen</mat-icon>
            <span>Tam Ekran Oku</span>
          </button>

          <a
            [routerLink]="['/makale', article().id]"
            class="inline-flex items-center gap-1 text-xs font-bold text-cyan-200 hover:text-amber-300 transition-colors"
          >
            <span>Detay</span>
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">arrow_forward</mat-icon>
          </a>
        </div>
      </div>
    </article>
  `,
})
export class ArticleCard {
  private readonly seoCard = inject(SeoCardService);
  readonly readerComfort = inject(ReaderComfortService);

  article = input.required<AcademicArticle>();
  isBookmarked = input<boolean>(false);

  bookmarkToggle = output<AcademicArticle>();
  shareClick = output<AcademicArticle>();
  listenClick = output<AcademicArticle>();
  keywordClick = output<string>();

  readonly imgError = signal<boolean>(false);

  getDisciplineMeta() {
    return DISCIPLINE_DEFINITIONS[this.article().discipline] || DISCIPLINE_DEFINITIONS.tde;
  }

  private getSharePayload(): SharePayload {
    const art = this.article();
    return {
      title: art.title,
      subtitle: art.subtitle,
      summary: art.abstract,
      quote: art.featuredQuote,
      url: `/makale/${art.id}`,
    };
  }

  getWhatsAppUrl(): string {
    return this.seoCard.getWhatsAppShareUrl(this.getSharePayload());
  }

  copyArticleLink(): void {
    this.seoCard.copyShareCardText(this.getSharePayload());
  }
}
