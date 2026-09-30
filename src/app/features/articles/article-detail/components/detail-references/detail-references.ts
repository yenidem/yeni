import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-detail-references',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (references() && references().length > 0) {
      <section class="mt-12 pt-8 border-t border-sky-300/25 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <mat-icon class="!w-5 !h-5 !text-lg icon-luminous-amber">library_books</mat-icon>
            <div>
              <h3 class="text-base font-serif font-bold text-white tracking-wide">
                Kaynakça, Akademik İntaç ve Doğrulanmış Arşiv Bağlantıları
              </h3>
              <p class="text-[11px] text-sky-200/80 font-sans">
                Her kaynağın yanındaki güvenli bağlantılarla eseri ulusal ve uluslararası akademik dizinlerde doğrulayabilirsiniz
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="copyAllReferences.emit()"
              class="nav-pill-btn !h-8 !px-3 text-xs"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">content_copy</mat-icon>
              <span>Tümünü Kopyala</span>
            </button>

            <a
              routerLink="/kaynaklar"
              class="nav-pill-btn !h-8 !px-3 text-xs"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-emerald">verified</mat-icon>
              <span>Dijital Arşivler &amp; Deyiş Kürsüsü</span>
            </a>
          </div>
        </div>

        <ol class="space-y-3 text-xs sm:text-sm text-stone-200 font-serif pl-5 list-decimal marker:text-amber-400 marker:font-bold leading-relaxed">
          @for (ref of references(); track ref) {
            <li class="pl-2 p-3 rounded-2xl bg-[#071633]/75 border border-sky-300/20 space-y-2">
              <div class="text-stone-100">{{ ref }}</div>
              <div class="flex flex-wrap items-center gap-2 pt-1 font-sans">
                <a
                  [href]="getScholarUrl(ref)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 border border-sky-300/30 text-[11px] text-cyan-200 transition-colors"
                >
                  <mat-icon class="!w-3 !h-3 !text-[11px]">school</mat-icon>
                  <span>Google Akademik</span>
                </a>

                <a
                  [href]="getDergiParkUrl(ref)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 border border-amber-300/30 text-[11px] text-amber-200 transition-colors"
                >
                  <mat-icon class="!w-3 !h-3 !text-[11px]">article</mat-icon>
                  <span>DergiPark</span>
                </a>

                <a
                  [href]="getTdvUrl(ref)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-300/30 text-[11px] text-emerald-200 transition-colors"
                >
                  <mat-icon class="!w-3 !h-3 !text-[11px]">menu_book</mat-icon>
                  <span>TDV İslâm Ansiklopedisi</span>
                </a>
              </div>
            </li>
          }
        </ol>
      </section>
    }
  `,
})
export class DetailReferencesComponent {
  references = input<string[]>([]);
  copyAllReferences = output<void>();

  getScholarUrl(ref: string): string {
    return `https://scholar.google.com/scholar?q=${encodeURIComponent(ref)}`;
  }

  getDergiParkUrl(ref: string): string {
    return `https://dergipark.org.tr/tr/search?q=${encodeURIComponent(ref)}`;
  }

  getTdvUrl(ref: string): string {
    const authorOrTitle = ref.split('.')[0] || ref;
    return `https://islamansiklopedisi.org.tr/arama?q=${encodeURIComponent(authorOrTitle)}`;
  }
}
