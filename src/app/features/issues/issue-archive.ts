import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MECMUA_ISSUES} from '../../core/data/issue.data';
import {MecmuaIssue} from '../../core/models/issue.model';
import {ArticleService} from '../../core/services/article.service';
import {BookmarkService} from '../../core/services/bookmark.service';
import {AcademicArticle} from '../../core/models/article.model';
import {DisciplineBadge} from '../../shared/components/badge/discipline-badge';

@Component({
  selector: 'app-issue-archive',
  imports: [RouterLink, MatIconModule, DisciplineBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      <!-- Hero Header: Mecmua Fasikül ve Sayı Arşivi -->
      <header class="relative p-8 sm:p-12 rounded-3xl cloud-lit-hero overflow-hidden">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-4xl space-y-4 relative z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">collections_bookmark</mat-icon>
            <span>YENİDEM &bull; Mecmua Sayıları & Fasikül Külliyatı</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Fasiküller ve Tematik <br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
              Mecmua Sayıları
            </span>
          </h1>

          <p class="text-sm sm:text-base text-stone-300 font-sans leading-relaxed max-w-3xl font-light">
            Dağınık makalelerin ötesinde; her biri belirli bir felsefi ve edebi temayı kuşatan, 
            başyazısı, metin tahlilleri ve kavramsal haritasıyla bir bütün teşkil eden YENİDEM ciltleri.
          </p>
        </div>
      </header>

      <!-- Issue Shelf Selector Cards -->
      <section class="space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-amber-500/20">
          <h2 class="text-sm font-serif font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <mat-icon class="!w-4 !h-4 !text-base">view_carousel</mat-icon>
            Mecmua Ciltleri ({{ issues.length }} Sayı)
          </h2>
          <span class="text-xs text-stone-400">İncelemek istediğiniz sayıyı seçiniz</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (issue of issues; track issue.id) {
            <div
              (click)="selectedIssueId.set(issue.id)"
              (keydown.enter)="selectedIssueId.set(issue.id)"
              tabindex="0"
              class="relative rounded-3xl p-6 sm:p-7 border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 group"
              [class.bg-gradient-to-b]="true"
              [class.from-[#131f38]]="selectedIssueId() === issue.id"
              [class.to-[#09101d]]="selectedIssueId() === issue.id"
              [class.border-amber-400]="selectedIssueId() === issue.id"
              [class.shadow-[0_0_30px_rgba(245,158,11,0.25)]]="selectedIssueId() === issue.id"
              [class.bg-[#080d1a]]="selectedIssueId() !== issue.id"
              [class.border-white/10]="selectedIssueId() !== issue.id"
              [class.hover:border-amber-500/40]="selectedIssueId() !== issue.id"
            >
              <!-- Cover Header -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                    SAYI {{ issue.issueNumber }} &bull; {{ issue.season }}
                  </span>
                  <span class="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-stone-400 font-mono">
                    {{ issue.articleIds.length }} Makale
                  </span>
                </div>

                <h3 class="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {{ issue.title }}
                </h3>

                <p class="text-xs text-stone-400 font-sans">
                  {{ issue.themeKicker }}
                </p>
              </div>

              <!-- Cover Footer -->
              <div class="pt-4 border-t border-white/10 flex items-center justify-between">
                <span class="text-xs font-serif italic text-amber-200/80">
                  {{ issue.editorialLetter.title }}
                </span>
                <span class="text-amber-400 flex items-center gap-1 text-xs font-bold">
                  {{ selectedIssueId() === issue.id ? 'Seçildi' : 'Aç' }}
                  <mat-icon class="!w-4 !h-4 !text-base">arrow_forward</mat-icon>
                </span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Active Issue Detailed Dossier -->
      @if (currentIssue(); as active) {
        <section class="space-y-8 animate-in fade-in duration-300">
          
          <!-- Editorial Letter (Başyazı & Takdim) -->
          <div class="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#070b14] border border-amber-500/30 shadow-xl space-y-6 relative overflow-hidden">
            <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-serif font-bold text-amber-300">
                  YD
                </div>
                <div>
                  <h3 class="text-lg font-serif font-bold text-white">{{ active.editorialLetter.title }}</h3>
                  <p class="text-xs text-stone-400">
                    Başyazı &bull; {{ active.editorialLetter.author }} &bull; {{ active.editorialLetter.date }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="addAllToReadingList(active)"
                  class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-stone-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Bu Sayıdaki Tüm Makaleleri Kayıtlı Okuma Listeme Ekle"
                >
                  <mat-icon class="!w-4 !h-4 !text-base text-amber-400">bookmark_add</mat-icon>
                  <span>Tüm Sayıyı Kaydet</span>
                </button>
              </div>
            </div>

            <div class="space-y-4 max-w-3xl">
              <p class="text-base sm:text-lg font-serif italic text-amber-200/90 leading-relaxed font-medium">
                &ldquo;{{ active.editorialLetter.lead }}&rdquo;
              </p>
              @for (par of active.editorialLetter.body; track par) {
                <p class="text-sm sm:text-base text-stone-300 font-sans leading-relaxed">
                  {{ par }}
                </p>
              }
            </div>
          </div>

          <!-- Articles of the Issue (Curated Reading Order) -->
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 class="text-sm font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <mat-icon class="!w-4 !h-4 !text-base text-amber-400">menu_book</mat-icon>
                Sayı {{ active.issueNumber }} &bull; İnceleme ve Makale Sıralaması
              </h3>
              <span class="text-xs text-stone-400 font-mono">
                Toplam {{ getIssueArticles(active).length }} Makale
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (art of getIssueArticles(active); track art.id; let idx = $index) {
                <article
                  class="rounded-3xl bg-[#090f1d] border border-white/10 hover:border-amber-400/40 p-6 flex flex-col justify-between space-y-5 transition-all duration-300 luxury-card-sheen group"
                >
                  <div class="space-y-3">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-mono text-amber-400 font-bold">
                        Bölüm {{ idx + 1 }}
                      </span>
                      <app-discipline-badge [discipline]="art.discipline" />
                    </div>

                    <h4 class="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      <a [routerLink]="['/makale', art.slug || art.id]">
                        {{ art.title }}
                      </a>
                    </h4>

                    @if (art.subtitle) {
                      <p class="text-xs text-stone-400 font-serif italic line-clamp-1">
                        {{ art.subtitle }}
                      </p>
                    }

                    <p class="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                      {{ art.abstract }}
                    </p>
                  </div>

                  <div class="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span class="text-stone-400 flex items-center gap-1">
                      <mat-icon class="!w-3.5 !h-3.5 !text-xs text-amber-400">schedule</mat-icon>
                      {{ art.readingTimeMinutes }} dk
                    </span>

                    <a
                      [routerLink]="['/makale', art.slug || art.id]"
                      class="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1"
                    >
                      <span>Oku</span>
                      <mat-icon class="!w-4 !h-4 !text-base">arrow_forward</mat-icon>
                    </a>
                  </div>
                </article>
              }
            </div>
          </div>

        </section>
      }

    </div>
  `,
})
export class IssueArchiveComponent {
  readonly articleService = inject(ArticleService);
  readonly bookmarkService = inject(BookmarkService);

  readonly issues = MECMUA_ISSUES;
  readonly selectedIssueId = signal<string>(MECMUA_ISSUES[0].id);

  readonly currentIssue = computed<MecmuaIssue>(() => {
    return this.issues.find((i) => i.id === this.selectedIssueId()) || this.issues[0];
  });

  getIssueArticles(issue: MecmuaIssue): AcademicArticle[] {
    const all = this.articleService.articles();
    return issue.articleIds
      .map((id) => all.find((a) => a.id === id))
      .filter((a): a is AcademicArticle => !!a);
  }

  addAllToReadingList(issue: MecmuaIssue): void {
    const articles = this.getIssueArticles(issue);
    for (const art of articles) {
      if (!this.bookmarkService.isBookmarked(art.id)) {
        this.bookmarkService.toggleBookmark(art);
      }
    }
  }
}
