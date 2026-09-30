import {ChangeDetectionStrategy, Component, computed, input, output, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {AcademicArticle} from '../../../../../core/models/article.model';

export type CardTheme = 'selcuklu' | 'gece' | 'parsomèn';

@Component({
  selector: 'app-detail-quote-card',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="presentation"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      (click)="closeOnBackdrop($event)"
      (keydown.escape)="dismiss.emit()"
    >
      <div
        role="dialog"
        aria-modal="true"
        class="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#091122] to-[#050912] border border-amber-500/40 shadow-2xl text-stone-200 overflow-hidden"
      >
        <!-- Modal Top Bar -->
        <div class="p-5 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <mat-icon class="!w-5 !h-5 !text-xl">format_quote</mat-icon>
            </div>
            <div>
              <h2 class="text-base sm:text-lg font-serif font-bold text-white">Akademik Alıntı Kartı</h2>
              <p class="text-[11px] text-stone-300 font-mono">Sosyal medya & akademik sunumlar için yüksek çözünürlüklü kart</p>
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

        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          
          <!-- Theme & Preset Controls -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span class="block text-xs font-serif font-bold text-stone-300 mb-1.5">Kart Teması:</span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="activeTheme.set('selcuklu')"
                  class="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5"
                  [class.bg-amber-500]="activeTheme() === 'selcuklu'"
                  [class.text-stone-950]="activeTheme() === 'selcuklu'"
                  [class.border-amber-400]="activeTheme() === 'selcuklu'"
                  [class.bg-[#0a0f1d]]="activeTheme() !== 'selcuklu'"
                  [class.border-white/10]="activeTheme() !== 'selcuklu'"
                  [class.text-stone-300]="activeTheme() !== 'selcuklu'"
                >
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span>Selçuklu Tezhip</span>
                </button>

                <button
                  type="button"
                  (click)="activeTheme.set('gece')"
                  class="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5"
                  [class.bg-emerald-500]="activeTheme() === 'gece'"
                  [class.text-stone-950]="activeTheme() === 'gece'"
                  [class.border-emerald-400]="activeTheme() === 'gece'"
                  [class.bg-[#0a0f1d]]="activeTheme() !== 'gece'"
                  [class.border-white/10]="activeTheme() !== 'gece'"
                  [class.text-stone-300]="activeTheme() !== 'gece'"
                >
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>Gece Kürsüsü</span>
                </button>

                <button
                  type="button"
                  (click)="activeTheme.set('parsomèn')"
                  class="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5"
                  [class.bg-amber-100]="activeTheme() === 'parsomèn'"
                  [class.text-stone-900]="activeTheme() === 'parsomèn'"
                  [class.border-stone-400]="activeTheme() === 'parsomèn'"
                  [class.bg-[#0a0f1d]]="activeTheme() !== 'parsomèn'"
                  [class.border-white/10]="activeTheme() !== 'parsomèn'"
                  [class.text-stone-300]="activeTheme() !== 'parsomèn'"
                >
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-200"></span>
                  <span>Fildişi Parşömen</span>
                </button>
              </div>
            </div>

            <!-- Custom Quote Input or Toggle -->
            <div>
              <button
                type="button"
                (click)="isEditingCustomQuote.set(!isEditingCustomQuote())"
                class="px-3 py-1.5 rounded-xl text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <mat-icon class="!w-4 !h-4 !text-sm text-amber-400">edit</mat-icon>
                <span>{{ isEditingCustomQuote() ? 'Hazır Alıntıya Dön' : 'Alıntıyı Özelleştir' }}</span>
              </button>
            </div>
          </div>

          <!-- If editing custom quote -->
          @if (isEditingCustomQuote()) {
            <div class="space-y-2">
              <label for="custom-quote-area" class="block text-xs font-serif text-amber-300">Özel Alıntı Metni:</label>
              <textarea
                id="custom-quote-area"
                rows="3"
                [value]="customQuoteText()"
                (input)="onCustomQuoteInput($event)"
                class="w-full p-3 rounded-xl bg-[#080d1a] border border-white/10 text-stone-100 text-xs sm:text-sm focus:border-amber-400 focus:outline-hidden"
              ></textarea>
            </div>
          }

          <!-- Live Card Preview -->
          <div class="space-y-2">
            <span class="text-xs font-serif text-stone-300 font-bold uppercase tracking-wider">Kart Önizleme:</span>

            <!-- THE CARD -->
            <div
              #quoteCardElement
              class="relative rounded-3xl p-8 sm:p-10 transition-all shadow-2xl border overflow-hidden"
              [class.bg-gradient-to-br]="activeTheme() !== 'parsomèn'"
              [class.from-[#0b1329]]="activeTheme() === 'selcuklu'"
              [class.via-[#070c1b]]="activeTheme() === 'selcuklu'"
              [class.to-[#03060f]]="activeTheme() === 'selcuklu'"
              [class.border-amber-500/40]="activeTheme() === 'selcuklu'"
              [class.from-[#0a1612]]="activeTheme() === 'gece'"
              [class.via-[#060e0c]]="activeTheme() === 'gece'"
              [class.to-[#020504]]="activeTheme() === 'gece'"
              [class.border-emerald-500/40]="activeTheme() === 'gece'"
              [class.bg-[#fbf7ee]]="activeTheme() === 'parsomèn'"
              [class.border-[#e0d6be]]="activeTheme() === 'parsomèn'"
              [class.text-stone-900]="activeTheme() === 'parsomèn'"
            >
              <!-- Card Top Header -->
              <div class="flex items-center justify-between border-b pb-4 mb-6"
                   [class.border-white/10]="activeTheme() !== 'parsomèn'"
                   [class.border-stone-300]="activeTheme() === 'parsomèn'">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center font-serif font-bold text-xs"
                       [class.bg-amber-500/20]="activeTheme() === 'selcuklu'"
                       [class.text-amber-300]="activeTheme() === 'selcuklu'"
                       [class.border]="activeTheme() === 'selcuklu'"
                       [class.border-amber-400/40]="activeTheme() === 'selcuklu'"
                       [class.bg-emerald-500/20]="activeTheme() === 'gece'"
                       [class.text-emerald-300]="activeTheme() === 'gece'"
                       [class.bg-stone-900]="activeTheme() === 'parsomèn'"
                       [class.text-amber-200]="activeTheme() === 'parsomèn'">
                    OK
                  </div>
                  <div>
                    <span class="block font-serif font-bold text-xs"
                          [class.text-white]="activeTheme() !== 'parsomèn'"
                          [class.text-stone-900]="activeTheme() === 'parsomèn'">
                      Orçun KUNDAKCI
                    </span>
                    <span class="block text-[10px] font-sans"
                          [class.text-stone-300]="activeTheme() !== 'parsomèn'"
                          [class.text-stone-600]="activeTheme() === 'parsomèn'">
                      AÖF Türk Dili ve Edebiyatı & Felsefe Kürsüsü
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 font-mono text-[10px]"
                     [class.text-amber-400]="activeTheme() === 'selcuklu'"
                     [class.text-emerald-400]="activeTheme() === 'gece'"
                     [class.text-stone-600]="activeTheme() === 'parsomèn'">
                  <mat-icon class="!w-3.5 !h-3.5 !text-xs">verified</mat-icon>
                  <span>Mühürlü Alıntı</span>
                </div>
              </div>

              <!-- Quote Body -->
              <div class="py-4 space-y-4">
                <mat-icon class="!w-8 !h-8 !text-3xl opacity-30 select-none"
                          [class.text-amber-400]="activeTheme() === 'selcuklu'"
                          [class.text-emerald-400]="activeTheme() === 'gece'"
                          [class.text-stone-500]="activeTheme() === 'parsomèn'">
                  format_quote
                </mat-icon>

                <p class="font-serif italic text-lg sm:text-xl sm:leading-relaxed"
                   [class.text-stone-100]="activeTheme() !== 'parsomèn'"
                   [class.text-stone-900]="activeTheme() === 'parsomèn'">
                  “{{ currentQuoteDisplay() }}”
                </p>
              </div>

              <!-- Card Footer -->
              <div class="mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-[11px]"
                   [class.border-white/10]="activeTheme() !== 'parsomèn'"
                   [class.border-stone-300]="activeTheme() === 'parsomèn'">
                <div class="max-w-md">
                  <span class="block font-serif font-semibold truncate"
                        [class.text-amber-300]="activeTheme() === 'selcuklu'"
                        [class.text-emerald-300]="activeTheme() === 'gece'"
                        [class.text-stone-800]="activeTheme() === 'parsomèn'">
                    {{ article().title }}
                  </span>
                  <span class="block text-[10px] font-mono"
                        [class.text-stone-300]="activeTheme() !== 'parsomèn'"
                        [class.text-stone-600]="activeTheme() === 'parsomèn'">
                    Külliyat Mührü: {{ article().sha512Hash?.slice(0, 16) }}...
                  </span>
                </div>

                <div class="text-right">
                  <span class="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full"
                        [class.bg-white/10]="activeTheme() !== 'parsomèn'"
                        [class.text-stone-200]="activeTheme() !== 'parsomèn'"
                        [class.bg-stone-200]="activeTheme() === 'parsomèn'"
                        [class.text-stone-800]="activeTheme() === 'parsomèn'">
                    {{ article().discipline.toUpperCase() }} KÜLLİYATI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Bottom Actions -->
        <div class="p-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#080d19]">
          <div class="text-xs text-stone-300 font-mono">
            @if (copied()) {
              <span class="text-emerald-400 font-bold flex items-center gap-1">
                <mat-icon class="!w-4 !h-4 !text-sm">done_all</mat-icon>
                Alıntı ve Referans Panoya Kopyalandı!
              </span>
            } @else {
              <span>Doğrudan panoya kopyalayabilir veya metin olarak alabilirsiniz.</span>
            }
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="copyQuoteWithCitation()"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-bold transition-all cursor-pointer border border-white/10"
            >
              <mat-icon class="!w-4 !h-4 !text-sm">content_copy</mat-icon>
              <span>Alıntıyı Kopyala</span>
            </button>

            <button
              type="button"
              (click)="dismiss.emit()"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <mat-icon class="!w-4 !h-4 !text-sm">check</mat-icon>
              <span>Tamam</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class DetailQuoteCardComponent {
  readonly article = input.required<AcademicArticle>();
  readonly dismiss = output<void>();

  readonly activeTheme = signal<CardTheme>('selcuklu');
  readonly isEditingCustomQuote = signal<boolean>(false);
  readonly customQuoteText = signal<string>('');
  readonly copied = signal<boolean>(false);

  readonly currentQuoteDisplay = computed(() => {
    if (this.isEditingCustomQuote() && this.customQuoteText().trim()) {
      return this.customQuoteText().trim();
    }
    return (
      this.article().featuredQuote ||
      this.article().abstract ||
      'Türk şiir dili, varlığı yalnızca bir tema olarak değil, doğrudan doğruya dilin imkânlarını genişleten felsefi bir deney alanı olarak işlemiştir.'
    );
  });

  onCustomQuoteInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.customQuoteText.set(target.value);
  }

  copyQuoteWithCitation(): void {
    const art = this.article();
    const quote = this.currentQuoteDisplay();
    const text = `“${quote}”\n\n— Orçun KUNDAKCI, "${art.title}" (AÖF Türk Dili ve Edebiyatı & Felsefe Külliyatı)\nSHA-512 Doğrulama: ${art.sha512Hash?.slice(0, 32)}...`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2500);
      });
    }
  }

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.dismiss.emit();
    }
  }
}
