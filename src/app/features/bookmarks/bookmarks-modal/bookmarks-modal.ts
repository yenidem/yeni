import {ChangeDetectionStrategy, Component, inject, output} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {BookmarkService} from '../../../core/services/bookmark.service';
import {AcademicArticle} from '../../../core/models/article.model';

@Component({
  selector: 'app-bookmarks-modal',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="presentation"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      (click)="closeOnBackdrop($event)"
      (keydown.escape)="dismiss.emit()"
    >
      <div
        role="dialog"
        aria-modal="true"
        class="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#0e172a] via-[#091122] to-[#060a14] border border-amber-500/40 shadow-2xl text-stone-200 overflow-hidden"
      >
        <!-- Modal Header -->
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <mat-icon class="!w-5 !h-5 !text-xl">bookmarks</mat-icon>
            </div>
            <div>
              <h2 class="text-lg font-serif font-bold text-white">Kişisel Okuma Listem</h2>
              <p class="text-xs text-stone-300 font-mono">{{ bookmarkService.bookmarks().length }} Makale Kaydedildi</p>
            </div>
          </div>

          <button
            type="button"
            (click)="dismiss.emit()"
            class="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <mat-icon class="!w-5 !h-5 !text-xl">close</mat-icon>
          </button>
        </div>

        <!-- Bookmarked Articles List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          @if (bookmarkService.bookmarks().length === 0) {
            <div class="py-16 text-center space-y-3 text-stone-400">
              <mat-icon class="!w-12 !h-12 !text-5xl text-stone-600">bookmark_border</mat-icon>
              <p class="text-sm font-serif">Okuma listenizde henüz makale yok.</p>
              <p class="text-xs text-stone-300 max-w-xs mx-auto">
                Makale detay sayfalarındaki veya listelerdeki yer imi butonuna tıklayarak makaleleri buraya kaydedebilirsiniz.
              </p>
            </div>
          } @else {
            @for (article of bookmarkService.bookmarks(); track article.id) {
              <div class="p-4 rounded-2xl bg-[#060a14] border border-white/5 hover:border-amber-500/30 transition-all flex items-start justify-between gap-3 group">
                <button
                  type="button"
                  (click)="openArticle(article)"
                  class="flex-1 text-left cursor-pointer"
                >
                  <div class="flex items-center gap-2 text-[10px] font-mono text-amber-400 mb-1">
                    <span class="uppercase font-bold">{{ article.discipline }}</span>
                    <span>&bull;</span>
                    <span>{{ article.readingTimeMinutes }} dk okuma</span>
                  </div>
                  <h3 class="text-xs font-serif font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {{ article.title }}
                  </h3>
                  <p class="text-[11px] text-stone-300 line-clamp-2 mt-1">
                    {{ article.abstract }}
                  </p>
                </button>

                <button
                  type="button"
                  (click)="bookmarkService.removeBookmark(article.id)"
                  class="text-stone-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Listeden Kaldır"
                >
                  <mat-icon class="!w-4 !h-4 !text-base">delete</mat-icon>
                </button>
              </div>
            }
          }
        </div>

        <!-- Footer Actions -->
        @if (bookmarkService.bookmarks().length > 0) {
          <div class="p-4 bg-[#050811] border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              (click)="bookmarkService.clearAll()"
              class="text-xs font-mono text-stone-300 hover:text-red-300 transition-colors cursor-pointer"
            >
              Tümünü Temizle
            </button>

            <button
              type="button"
              (click)="exportReadingList()"
              class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <mat-icon class="!w-4 !h-4 !text-base text-stone-950">download</mat-icon>
              <span>Listeyi Markdown İndir</span>
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class BookmarksModalComponent {
  readonly dismiss = output<void>();
  readonly bookmarkService = inject(BookmarkService);
  private readonly router = inject(Router);

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.dismiss.emit();
    }
  }

  openArticle(article: AcademicArticle): void {
    this.dismiss.emit();
    this.router.navigate(['/makale', article.slug || article.id]);
  }

  exportReadingList(): void {
    if (typeof window === 'undefined') return;
    const articles = this.bookmarkService.bookmarks();
    let md = `# Orçun Kundakcı Külliyatı - Kişisel Okuma Listesi\nOluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}\n\n`;

    articles.forEach((a, i) => {
      md += `### ${i + 1}. ${a.title}\n`;
      md += `- **Disiplin:** ${a.discipline.toUpperCase()}\n`;
      md += `- **Okuma Süresi:** ${a.readingTimeMinutes} dakika\n`;
      md += `- **Özet:** ${a.abstract}\n\n`;
    });

    const blob = new Blob([md], {type: 'text/markdown;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orcun-kundakci-okuma-listesi.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
