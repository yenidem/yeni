import {ChangeDetectionStrategy, Component, inject, output, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {SpeechService} from '../../core/services/speech.service';
import {SeoCardService} from '../../core/services/seo-card.service';
import {SlideEmblemComponent} from './components/slide-emblem/slide-emblem';
import {SlideNavigationComponent} from './components/slide-navigation/slide-navigation';
import {HeritageSliderService} from './services/heritage-slider.service';
import {downloadHeritageSlidePoster} from './utils/heritage-poster.util';

@Component({
  selector: 'app-heritage-slider',
  imports: [MatIconModule, SlideEmblemComponent, SlideNavigationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown.arrowRight)': 'sliderService.nextSlide()',
    '(keydown.arrowLeft)': 'sliderService.prevSlide()',
  },
  template: `
    <section
      (mouseenter)="sliderService.pauseOnHover()"
      (mouseleave)="sliderService.resumeAfterHover()"
      aria-label="Cumhuriyet Aydınlanması, Hünkâr Hacı Bektâş-ı Velî ve Yedi Ulu Ozan Özlü Sözler Slaytı"
      class="relative overflow-hidden rounded-3xl bg-glass-blue p-6 sm:p-8 space-y-6"
    >
      <!-- Ambient Cloud & Horizon Lighting -->
      <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-sky-400/15 blur-3xl pointer-events-none"></div>
      <div class="absolute left-1/2 -translate-x-1/2 -bottom-24 w-[85%] h-44 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none"></div>

      <!-- Top Header Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sky-400/25 relative z-10">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2 text-xs text-cyan-300 font-serif">
            <span class="font-semibold tracking-wide">CUMHURİYET VE ANADOLU İRFAN KÜRSÜSÜ</span>
            <span aria-hidden="true">·</span>
            <span class="text-sky-100">Gazi Mustafa Kemal Atatürk · Hünkâr Hacı Bektâş-ı Velî · Yedi Ulu Ozan</span>
          </div>
          <p class="text-xs text-sky-200/80 font-sans">
            Birincil tarihsel kaynaklardan doğrulanmış vecizeler, nefesler ve felsefi şerhler
          </p>
        </div>

        <!-- Action Controls: Audio, Quote Switch, Poster Download -->
        <div class="flex flex-wrap items-center gap-2">
          @if (sliderService.currentSlide().quotes.length > 1) {
            <button
              type="button"
              (click)="sliderService.nextQuoteInSlide()"
              class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              title="Bu şahsiyetin diğer özlü sözünü göster"
            >
              <mat-icon class="!w-4 !h-4 !text-sm text-amber-400">format_quote</mat-icon>
              <span>Söz {{ sliderService.activeQuoteIndex() + 1 }}/{{ sliderService.currentSlide().quotes.length }}</span>
            </button>
          }

          <button
            type="button"
            (click)="listenActiveSlide()"
            class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-sky-500/20 text-stone-200 hover:text-sky-200 border border-white/10 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            title="Özlü sözü ve felsefi şerhi sesli dinle"
          >
            <mat-icon class="!w-4 !h-4 !text-sm text-sky-400">volume_up</mat-icon>
            <span class="hidden sm:inline">Sesli Dinle</span>
          </button>

          <button
            type="button"
            (click)="shareActiveSlide()"
            class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-stone-200 hover:text-emerald-200 border border-white/10 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            title="Bu özlü sözü ve şerhi paylaş / kopyala"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">share</mat-icon>
            <span class="hidden sm:inline">Sözü Paylaş</span>
          </button>

          <button
            type="button"
            (click)="exportPoster()"
            class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-stone-200 hover:text-amber-200 border border-white/10 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            title="1080x1920 yüksek çözünürlüklü afiş olarak indir"
          >
            <mat-icon class="!w-4 !h-4 !text-sm text-amber-400">download</mat-icon>
            <span class="hidden sm:inline">Afiş İndir</span>
          </button>
        </div>
      </div>

      <!-- Main Slide Content Grid -->
      @let slide = sliderService.currentSlide();
      @let quote = sliderService.currentQuote();

      <div class="grid grid-cols-1 2xl:grid-cols-12 gap-6 items-center relative z-10 py-2">
        <!-- Left/Top Column: Symbolic Medallion & Identity -->
        <div class="2xl:col-span-4 flex flex-col sm:flex-row 2xl:flex-col items-center justify-center sm:justify-start 2xl:justify-center text-center sm:text-left 2xl:text-center gap-5 2xl:gap-4 bg-white/[0.02] 2xl:bg-transparent p-4 2xl:p-0 rounded-2xl border border-white/5 2xl:border-0">
          <div class="w-28 h-28 sm:w-32 sm:h-32 2xl:w-48 2xl:h-48 shrink-0">
            <app-slide-emblem [slide]="slide" />
          </div>

          <div class="space-y-1 pt-1">
            <div class="text-xs text-amber-300/90 font-serif">
              {{ slide.categoryLabel }} · {{ slide.era }}
            </div>
            <h2 class="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              {{ slide.name }}
            </h2>
            <p class="text-xs sm:text-sm text-stone-300 font-serif italic">
              {{ slide.title }}
            </p>
            <p class="text-[11px] text-stone-400 font-sans">
              {{ slide.region }}
            </p>
          </div>
        </div>

        <!-- Right/Bottom Column: Primary Quote, Source Metadata & Scholarly Synthesis -->
        <div class="2xl:col-span-8 space-y-4">
          <!-- Calligraphic Quote Frame -->
          <div class="p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-[#081736]/90 via-[#0c224d]/90 to-[#13336e]/90 border border-sky-300/30 shadow-[0_18px_40px_-10px_rgba(2,8,23,0.85),inset_0_-18px_32px_-10px_rgba(186,230,253,0.18)] space-y-4 relative">
            <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-sky-200/80 border-b border-sky-400/20 pb-2.5">
              <span class="text-amber-300 font-serif font-medium">{{ quote.theme }}</span>
              <div class="flex items-center gap-1.5">
                @for (q of slide.quotes; track q.id; let qIdx = $index) {
                  <button
                    type="button"
                    (click)="sliderService.selectQuoteInSlide(qIdx)"
                    class="w-6 h-6 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border"
                    [class.bg-amber-500]="qIdx === sliderService.activeQuoteIndex()"
                    [class.text-stone-950]="qIdx === sliderService.activeQuoteIndex()"
                    [class.border-amber-300]="qIdx === sliderService.activeQuoteIndex()"
                    [class.font-bold]="qIdx === sliderService.activeQuoteIndex()"
                    [class.bg-white/5]="qIdx !== sliderService.activeQuoteIndex()"
                    [class.text-stone-300]="qIdx !== sliderService.activeQuoteIndex()"
                    [class.border-white/10]="qIdx !== sliderService.activeQuoteIndex()"
                    [title]="(qIdx + 1) + '. Özlü Söz'"
                  >
                    {{ qIdx + 1 }}
                  </button>
                }
              </div>
            </div>

            <blockquote class="space-y-2 py-1">
              <p class="font-serif text-lg sm:text-xl xl:text-2xl text-amber-100 font-medium leading-relaxed">
                &ldquo;{{ quote.text }}@if (!quote.secondLine) {&rdquo;}
              </p>
              @if (quote.secondLine) {
                <p class="font-serif text-lg sm:text-xl xl:text-2xl text-amber-200 font-medium leading-relaxed">
                  {{ quote.secondLine }}&rdquo;
                </p>
              }
            </blockquote>

            <div class="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-300">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-serif font-bold text-amber-300">— {{ slide.name }}</span>
                <span aria-hidden="true">·</span>
                <span class="text-stone-300 italic">{{ quote.source }}</span>
              </div>
              <span class="text-stone-400 font-mono text-[11px]">{{ quote.yearOrContext }}</span>
            </div>
          </div>

          <!-- Scholarly Synthesis & Action Row -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                (click)="toggleSynthesis()"
                class="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer hover:text-amber-200"
              >
                <mat-icon class="!w-4 !h-4 !text-sm">history_edu</mat-icon>
                <span>Orçun Kundakcı Tefekkür & Felsefi Bağlam Notu</span>
                <mat-icon class="!w-4 !h-4 !text-sm">
                  {{ showSynthesis() ? 'expand_less' : 'expand_more' }}
                </mat-icon>
              </button>

              <span class="text-[11px] text-stone-400 font-mono">
                {{ slide.philosophicalAxis }}
              </span>
            </div>

            @if (showSynthesis()) {
              <p class="text-xs sm:text-sm text-stone-200 font-serif leading-relaxed italic">
                {{ slide.scholarlySynthesis }}
              </p>
            }

            <div class="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <span class="text-[11px] text-stone-400">
                Külliyat İlişkisi: <strong class="text-stone-200">{{ slide.searchKeyword }}</strong> araştırmaları
              </span>

              <button
                type="button"
                (click)="filterByKeyword.emit(slide.searchKeyword)"
                class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <mat-icon class="!w-4 !h-4 !text-sm">search</mat-icon>
                <span>İlgili Makaleleri Külliyatta Filtrele</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 9-Figure Navigation & Category Selector -->
      <app-slide-navigation
        [slides]="sliderService.filteredSlides()"
        [activeIndex]="sliderService.activeSlideIndex()"
        [isAutoPlay]="sliderService.isAutoPlay()"
        [activeCategory]="sliderService.activeCategoryFilter()"
        (selectSlide)="sliderService.selectSlide($event)"
        (prev)="sliderService.prevSlide()"
        (next)="sliderService.nextSlide()"
        (toggleAutoPlay)="sliderService.toggleAutoPlay()"
        (categoryChange)="sliderService.setCategoryFilter($event)"
      />
    </section>
  `,
})
export class HeritageSliderComponent {
  readonly sliderService = inject(HeritageSliderService);
  private readonly speechService = inject(SpeechService);
  private readonly seoCard = inject(SeoCardService);

  readonly filterByKeyword = output<string>();
  readonly showSynthesis = signal<boolean>(true);

  toggleSynthesis(): void {
    this.showSynthesis.update((v) => !v);
  }

  shareActiveSlide(): void {
    const slide = this.sliderService.currentSlide();
    const quote = this.sliderService.currentQuote();
    const fullQuote = quote.secondLine ? `${quote.text} / ${quote.secondLine}` : quote.text;
    this.seoCard.shareNativeOrCopy({
      title: `${slide.name} — ${slide.title}`,
      subtitle: `${quote.theme} (${quote.source})`,
      quote: fullQuote,
      summary: slide.scholarlySynthesis,
      url: '/',
    });
  }

  listenActiveSlide(): void {
    const slide = this.sliderService.currentSlide();
    const quote = this.sliderService.currentQuote();
    const fullQuote = quote.secondLine ? `${quote.text}. ${quote.secondLine}` : quote.text;
    const narration = `${slide.name}, ${slide.title}. Özlü sözü: ${fullQuote}. Kaynak: ${quote.source}. Felsefi bağlam: ${slide.scholarlySynthesis}`;
    this.speechService.speak(narration, `${slide.name} — Özlü Söz ve Tefekkür`);
  }

  exportPoster(): void {
    downloadHeritageSlidePoster(
      this.sliderService.currentSlide(),
      this.sliderService.currentQuote(),
    );
  }
}
