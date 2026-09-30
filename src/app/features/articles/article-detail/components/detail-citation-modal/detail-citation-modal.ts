import {ChangeDetectionStrategy, Component, computed, input, output, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {AcademicArticle} from '../../../../../core/models/article.model';

type CitationStandard = 'isnad' | 'apa' | 'mla' | 'chicago' | 'bibtex' | 'ris';

@Component({
  selector: 'app-detail-citation-modal',
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
        class="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0e172a] via-[#091122] to-[#060a14] border border-amber-500/40 shadow-2xl text-stone-200 space-y-6"
      >
        <!-- Modal Masthead -->
        <div class="flex items-start justify-between gap-4 border-b border-amber-500/20 pb-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                Akademik Atıf & Kaynakça
              </span>
              <span class="text-xs text-stone-300 font-mono">Standart Formatlar</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-serif font-bold text-white">
              Bu Makaleye Atıf Yap
            </h2>
            <p class="text-xs text-stone-300 line-clamp-1 font-serif italic">
              "{{ article().title }}"
            </p>
          </div>

          <button
            type="button"
            (click)="dismiss.emit()"
            class="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Kapat"
          >
            <mat-icon class="!w-5 !h-5 !text-xl">close</mat-icon>
          </button>
        </div>

        <!-- Citation Format Tabs -->
        <div class="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#060a14] border border-white/5">
          <button
            type="button"
            (click)="selectedStandard.set('isnad')"
            class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer"
            [class.bg-amber-500]="selectedStandard() === 'isnad'"
            [class.text-stone-950]="selectedStandard() === 'isnad'"
            [class.text-stone-400]="selectedStandard() !== 'isnad'"
            [class.hover:text-white]="selectedStandard() !== 'isnad'"
          >
            İSNAD 2 (TR Standart)
          </button>

          <button
            type="button"
            (click)="selectedStandard.set('apa')"
            class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer"
            [class.bg-amber-500]="selectedStandard() === 'apa'"
            [class.text-stone-950]="selectedStandard() === 'apa'"
            [class.text-stone-400]="selectedStandard() !== 'apa'"
            [class.hover:text-white]="selectedStandard() !== 'apa'"
          >
            APA 7
          </button>

          <button
            type="button"
            (click)="selectedStandard.set('mla')"
            class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer"
            [class.bg-amber-500]="selectedStandard() === 'mla'"
            [class.text-stone-950]="selectedStandard() === 'mla'"
            [class.text-stone-400]="selectedStandard() !== 'mla'"
            [class.hover:text-white]="selectedStandard() !== 'mla'"
          >
            MLA 9
          </button>

          <button
            type="button"
            (click)="selectedStandard.set('chicago')"
            class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer"
            [class.bg-amber-500]="selectedStandard() === 'chicago'"
            [class.text-stone-950]="selectedStandard() === 'chicago'"
            [class.text-stone-400]="selectedStandard() !== 'chicago'"
            [class.hover:text-white]="selectedStandard() !== 'chicago'"
          >
            Chicago 17
          </button>

          <button
            type="button"
            (click)="selectedStandard.set('bibtex')"
            class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer"
            [class.bg-amber-500]="selectedStandard() === 'bibtex'"
            [class.text-stone-950]="selectedStandard() === 'bibtex'"
            [class.text-stone-400]="selectedStandard() !== 'bibtex'"
            [class.hover:text-white]="selectedStandard() !== 'bibtex'"
          >
            BibTeX (.bib)
          </button>

          <button
            type="button"
            (click)="selectedStandard.set('ris')"
            class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer"
            [class.bg-amber-500]="selectedStandard() === 'ris'"
            [class.text-stone-950]="selectedStandard() === 'ris'"
            [class.text-stone-400]="selectedStandard() !== 'ris'"
            [class.hover:text-white]="selectedStandard() !== 'ris'"
          >
            RIS (EndNote / Zotero)
          </button>
        </div>

        <!-- Citation Content Box -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs text-stone-300 font-mono">
            <span>{{ formatLabel() }}</span>
            @if (article().doiOrIsbn) {
              <span class="text-amber-400">DOI / Sicil: {{ article().doiOrIsbn }}</span>
            }
          </div>

          <div class="relative p-5 rounded-2xl bg-[#060a14] border border-white/10 text-stone-200 text-xs sm:text-sm font-serif leading-relaxed select-all">
            @if (selectedStandard() === 'bibtex' || selectedStandard() === 'ris') {
              <pre class="font-mono text-xs whitespace-pre-wrap break-all text-amber-200">{{ formattedCitation() }}</pre>
            } @else {
              <p>{{ formattedCitation() }}</p>
            }
          </div>
        </div>

        <!-- Feedback Banner -->
        @if (copied()) {
          <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-pulse">
            <mat-icon class="!w-4 !h-4 !text-base text-emerald-400">check_circle</mat-icon>
            <span>Atıf metni panoya kopyalandı! Tez, ödev veya makalenize doğrudan yapıştırabilirsiniz.</span>
          </div>
        }

        <!-- Actions -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div class="text-[11px] text-stone-300 font-sans">
            Tüm hakları Orçun Kundakcı’ya aittir. Akademik atıf etik kurallara uygundur.
          </div>

          <div class="flex items-center gap-2">
            @if (selectedStandard() === 'bibtex') {
              <button
                type="button"
                (click)="downloadBibtex()"
                class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <mat-icon class="!w-4 !h-4 !text-base">download</mat-icon>
                <span>.bib İndir</span>
              </button>
            }

            <button
              type="button"
              (click)="copyCitation()"
              class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <mat-icon class="!w-4 !h-4 !text-base text-stone-950">content_copy</mat-icon>
              <span>{{ copied() ? 'Kopyalandı!' : 'Atfı Kopyala' }}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class DetailCitationModalComponent {
  readonly article = input.required<AcademicArticle>();
  readonly dismiss = output<void>();

  readonly selectedStandard = signal<CitationStandard>('isnad');
  readonly copied = signal<boolean>(false);

  readonly formatLabel = computed(() => {
    switch (this.selectedStandard()) {
      case 'isnad':
        return 'İSNAD 2.0 (İlahiyat & Sosyal Bilimler Atıf Sistemi - Kaynakça Biçimi)';
      case 'apa':
        return 'APA 7 (American Psychological Association 7th Edition)';
      case 'mla':
        return 'MLA 9 (Modern Language Association 9th Edition)';
      case 'chicago':
        return 'Chicago 17th Edition (Author-Date / Bibliography)';
      case 'bibtex':
        return 'BibTeX Girişi (LaTeX / Zotero / Overleaf İçin)';
      case 'ris':
        return 'Research Information Systems Format (EndNote / Mendeley)';
    }
  });

  readonly formattedCitation = computed(() => {
    const art = this.article();
    const year = art.publishedAt ? new Date(art.publishedAt).getFullYear() : '2026';
    const author = 'Kundakcı, Orçun';
    const title = art.title;
    const url = typeof window !== 'undefined' ? window.location.href : `https://orcunkundakci.com/makale/${art.slug || art.id}`;

    switch (this.selectedStandard()) {
      case 'isnad':
        return `${author}. "${title}". Orçun Kundakcı Akademik Külliyatı & Felsefe Portföyü (${year}): 1-12. Erişim Tarihi: ${new Date().toLocaleDateString('tr-TR')}. ${url}`;

      case 'apa':
        return `Kundakcı, O. (${year}). ${title}. Orçun Kundakcı Akademik Portföyü. ${url}`;

      case 'mla':
        return `${author}. "${title}." Orçun Kundakcı Akademik Külliyatı, ${year}, ${url}.`;

      case 'chicago':
        return `${author}. ${year}. "${title}." Orçun Kundakcı Akademik Portföyü. ${url}.`;

      case 'bibtex': {
        const citeKey = `kundakci${year}${art.slug ? art.slug.replace(/[^a-zA-Z0-9]/g, '') : 'article'}`;
        return `@article{${citeKey},
  author    = {Kundak{\\c{c}}{\\i}, Or{\\c{c}}un},
  title     = {${title}},
  journal   = {Or{\\c{c}}un Kundakc{\\i} Akademik K{\\ddot{u}}lliyat{\\i}},
  year      = {${year}},
  url       = {${url}},
  note      = {Eri{\\c{s}}im Tarihi: ${new Date().toLocaleDateString('tr-TR')}}
}`;
      }

      case 'ris':
        return `TY  - JOUR
AU  - Kundakci, Orcun
TI  - ${title}
JO  - Orcun Kundakci Akademik Kulliyati
PY  - ${year}
UR  - ${url}
ER  -`;
    }
  });

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.dismiss.emit();
    }
  }

  copyCitation(): void {
    navigator.clipboard?.writeText(this.formattedCitation()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    });
  }

  downloadBibtex(): void {
    if (typeof window === 'undefined') return;
    const blob = new Blob([this.formattedCitation()], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.article().slug || 'makale'}-citation.bib`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
