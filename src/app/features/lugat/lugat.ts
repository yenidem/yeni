import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {LugatService} from '../../core/services/lugat.service';
import {SpeechService} from '../../core/services/speech.service';
import {LugatCategory, LugatTerm} from '../../core/models/lugat.model';

@Component({
  selector: 'app-lugat',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      <!-- Scholarly Hero Banner -->
      <header class="relative p-8 sm:p-12 rounded-3xl cloud-lit-hero overflow-hidden">
        <div class="max-w-3xl space-y-4 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">translate</mat-icon>
            <span>Kavramlar & Istılahlar Atlası</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Akademik Felsefe & <span class="text-amber-400">Edebiyat Lügatı</span>
          </h1>

          <p class="text-stone-300 text-sm sm:text-base leading-relaxed font-sans">
            AÖF Türk Dili ve Edebiyatı ile Felsefe disiplinlerinde geçen klasik metin şerhi ıstılahları, tasavvufi ontoloji kavramları ve Batı epistemolojisinin kilit terimlerinin etimolojik, felsefi ve edebi tahlil hazinesi.
          </p>
        </div>

        <!-- Search Bar Inside Hero -->
        <div class="mt-8 relative max-w-2xl">
          <div class="relative flex items-center">
            <mat-icon class="absolute left-4 !w-5 !h-5 !text-xl text-stone-400">search</mat-icon>
            <input
              type="text"
              [value]="lugatService.searchQuery()"
              (input)="onSearchInput($event)"
              placeholder="Terim, Osmanlıca imla, düşünür veya kavram ara (örn. Vahdet, Aporia, Sebk-i Hindi)..."
              class="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#0e172a] border border-white/10 text-stone-100 placeholder-stone-400 text-sm focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
            />
            @if (lugatService.searchQuery()) {
              <button
                type="button"
                (click)="lugatService.setSearchQuery('')"
                class="absolute right-3.5 text-stone-400 hover:text-white cursor-pointer"
                title="Aramayı Temizle"
              >
                <mat-icon class="!w-4 !h-4 !text-base">close</mat-icon>
              </button>
            }
          </div>
        </div>
      </header>

      <!-- Filter Controls: Categories & Alphabet Jump -->
      <div class="space-y-4">
        <!-- Category Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            (click)="setCategory('all')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            [class.bg-amber-500]="lugatService.selectedCategory() === 'all'"
            [class.text-stone-950]="lugatService.selectedCategory() === 'all'"
            [class.bg-[#0c1424]]="lugatService.selectedCategory() !== 'all'"
            [class.text-stone-300]="lugatService.selectedCategory() !== 'all'"
            [class.border]="lugatService.selectedCategory() !== 'all'"
            [class.border-white/10]="lugatService.selectedCategory() !== 'all'"
          >
            <span>Tüm Istılahlar</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" [class.bg-stone-950/20]="lugatService.selectedCategory() === 'all'" [class.bg-white/10]="lugatService.selectedCategory() !== 'all'">
              {{ lugatService.filteredTerms().length }}
            </span>
          </button>

          <button
            type="button"
            (click)="setCategory('tde')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            [class.bg-amber-500]="lugatService.selectedCategory() === 'tde'"
            [class.text-stone-950]="lugatService.selectedCategory() === 'tde'"
            [class.bg-[#0c1424]]="lugatService.selectedCategory() !== 'tde'"
            [class.text-stone-300]="lugatService.selectedCategory() !== 'tde'"
            [class.border]="lugatService.selectedCategory() !== 'tde'"
            [class.border-white/10]="lugatService.selectedCategory() !== 'tde'"
          >
            <mat-icon class="!w-4 !h-4 !text-base" [class.text-stone-950]="lugatService.selectedCategory() === 'tde'" [class.text-amber-400]="lugatService.selectedCategory() !== 'tde'">menu_book</mat-icon>
            <span>Türk Dili & Edebiyatı (TDE)</span>
          </button>

          <button
            type="button"
            (click)="setCategory('tasavvuf')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            [class.bg-amber-500]="lugatService.selectedCategory() === 'tasavvuf'"
            [class.text-stone-950]="lugatService.selectedCategory() === 'tasavvuf'"
            [class.bg-[#0c1424]]="lugatService.selectedCategory() !== 'tasavvuf'"
            [class.text-stone-300]="lugatService.selectedCategory() !== 'tasavvuf'"
            [class.border]="lugatService.selectedCategory() !== 'tasavvuf'"
            [class.border-white/10]="lugatService.selectedCategory() !== 'tasavvuf'"
          >
            <mat-icon class="!w-4 !h-4 !text-base" [class.text-stone-950]="lugatService.selectedCategory() === 'tasavvuf'" [class.text-amber-400]="lugatService.selectedCategory() !== 'tasavvuf'">auto_stories</mat-icon>
            <span>Tasavvuf & Doğu Hikmeti</span>
          </button>

          <button
            type="button"
            (click)="setCategory('felsefe')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            [class.bg-amber-500]="lugatService.selectedCategory() === 'felsefe'"
            [class.text-stone-950]="lugatService.selectedCategory() === 'felsefe'"
            [class.bg-[#0c1424]]="lugatService.selectedCategory() !== 'felsefe'"
            [class.text-stone-300]="lugatService.selectedCategory() !== 'felsefe'"
            [class.border]="lugatService.selectedCategory() !== 'felsefe'"
            [class.border-white/10]="lugatService.selectedCategory() !== 'felsefe'"
          >
            <mat-icon class="!w-4 !h-4 !text-base" [class.text-stone-950]="lugatService.selectedCategory() === 'felsefe'" [class.text-emerald-400]="lugatService.selectedCategory() !== 'felsefe'">psychology</mat-icon>
            <span>Felsefe & Mantık</span>
          </button>

          <button
            type="button"
            (click)="setCategory('estetik')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            [class.bg-amber-500]="lugatService.selectedCategory() === 'estetik'"
            [class.text-stone-950]="lugatService.selectedCategory() === 'estetik'"
            [class.bg-[#0c1424]]="lugatService.selectedCategory() !== 'estetik'"
            [class.text-stone-300]="lugatService.selectedCategory() !== 'estetik'"
            [class.border]="lugatService.selectedCategory() !== 'estetik'"
            [class.border-white/10]="lugatService.selectedCategory() !== 'estetik'"
          >
            <mat-icon class="!w-4 !h-4 !text-base" [class.text-stone-950]="lugatService.selectedCategory() === 'estetik'" [class.text-sky-400]="lugatService.selectedCategory() !== 'estetik'">palette</mat-icon>
            <span>Estetik & Poetika</span>
          </button>
        </div>

        <!-- Root Language Filters -->
        <div class="flex items-center gap-1.5 overflow-x-auto py-1 text-xs scrollbar-none">
          <span class="text-[11px] text-stone-400 font-serif mr-1">Köken:</span>
          @for (lang of rootLanguages; track lang.value) {
            <button
              type="button"
              (click)="lugatService.setRootLanguage(lang.value)"
              class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] font-mono whitespace-nowrap"
              [class.bg-amber-400]="lugatService.selectedRootLanguage() === lang.value"
              [class.text-stone-950]="lugatService.selectedRootLanguage() === lang.value"
              [class.bg-white/5]="lugatService.selectedRootLanguage() !== lang.value"
              [class.text-stone-300]="lugatService.selectedRootLanguage() !== lang.value"
              [class.hover:bg-white/10]="lugatService.selectedRootLanguage() !== lang.value"
            >
              {{ lang.label }}
            </button>
          }
        </div>

        <!-- Spotlight Term Card (Visible when browsing without strict search) -->
        @if (!lugatService.searchQuery() && lugatService.selectedCategory() === 'all' && lugatService.selectedLetter() === 'all' && spotlightTerm(); as spot) {
          <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#111c33] via-[#091122] to-[#0d1628] border-2 border-amber-500/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                <mat-icon class="!w-4 !h-4 !text-sm text-amber-400">auto_awesome</mat-icon>
                <span>Günün İstılahı & Felsefi Odak</span>
              </div>
              <button
                type="button"
                (click)="speakTerm(spot, $event)"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-mono transition-colors cursor-pointer"
                title="Sesli Telaffuz ve Tanım"
              >
                <mat-icon class="!w-4 !h-4 !text-sm text-cyan-400">volume_up</mat-icon>
                <span>Sesli Dinle</span>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div class="md:col-span-2 space-y-2">
                <h3 class="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-3">
                  <span>{{ spot.term }}</span>
                  @if (spot.osmanlica) {
                    <span class="text-amber-400 font-serif text-2xl" dir="rtl">{{ spot.osmanlica }}</span>
                  }
                </h3>
                <p class="text-xs text-amber-300/80 font-mono">{{ spot.rootLanguage }} &bull; {{ spot.etymology }}</p>
                <p class="text-stone-200 text-xs sm:text-sm leading-relaxed">{{ spot.shortDefinition }}</p>
              </div>

              <div class="p-4 rounded-2xl bg-[#060a14] border border-white/10 space-y-2">
                @if (spot.quote) {
                  <p class="font-serif italic text-xs text-amber-100">"{{ spot.quote.text }}"</p>
                  <span class="block text-[11px] text-amber-300/80 font-mono text-right">&mdash; {{ spot.quote.source }}</span>
                }
                <button
                  type="button"
                  (click)="lugatService.openTermModal(spot)"
                  class="w-full mt-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all cursor-pointer text-center block"
                >
                  Kapsamlı Şerhi İncele
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Alphabet Quick Bar -->
        <div class="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs">
          <button
            type="button"
            (click)="lugatService.setLetter('all')"
            class="px-2.5 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer"
            [class.bg-amber-400]="lugatService.selectedLetter() === 'all'"
            [class.text-stone-950]="lugatService.selectedLetter() === 'all'"
            [class.text-stone-400]="lugatService.selectedLetter() !== 'all'"
            [class.hover:text-white]="lugatService.selectedLetter() !== 'all'"
          >
            TÜMÜ
          </button>
          @for (letter of lugatService.availableLetters(); track letter) {
            <button
              type="button"
              (click)="lugatService.setLetter(letter)"
              class="w-7 h-7 flex items-center justify-center rounded-lg font-mono font-bold transition-colors cursor-pointer"
              [class.bg-amber-400]="lugatService.selectedLetter() === letter"
              [class.text-stone-950]="lugatService.selectedLetter() === letter"
              [class.text-stone-400]="lugatService.selectedLetter() !== letter"
              [class.hover:bg-white/5]="lugatService.selectedLetter() !== letter"
              [class.hover:text-white]="lugatService.selectedLetter() !== letter"
            >
              {{ letter }}
            </button>
          }
        </div>
      </div>

      <!-- Term Cards Grid -->
      @if (lugatService.filteredTerms().length === 0) {
        <div class="py-20 text-center space-y-3 bg-[#0c1424] rounded-3xl border border-white/5 p-8">
          <mat-icon class="!w-12 !h-12 !text-5xl text-stone-600">search_off</mat-icon>
          <p class="text-stone-300 font-serif text-lg">Aradığınız kriterlere uygun kavram bulunamadı.</p>
          <p class="text-stone-500 text-xs">Farklı bir anahtar kelime deneyebilir veya kategori filtresini sıfırlayabilirsiniz.</p>
          <button
            type="button"
            (click)="resetFilters()"
            class="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (term of lugatService.filteredTerms(); track term.id) {
            <div
              class="group flex flex-col justify-between p-6 rounded-2xl bg-[#090f1d] hover:bg-[#0c1424] border border-white/10 hover:border-amber-500/40 transition-all duration-300 shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1"
            >
              <div class="space-y-4">
                <!-- Card Header: Term Name & Calligraphy -->
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      {{ term.term }}
                    </h3>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-[10px] px-2 py-0.5 rounded bg-white/5 text-stone-300 border border-white/10 font-mono">
                        {{ term.rootLanguage }} &bull; {{ term.etymology }}
                      </span>
                    </div>
                  </div>

                  @if (term.osmanlica) {
                    <span class="text-xl text-amber-400/80 font-serif select-none" dir="rtl">
                      {{ term.osmanlica }}
                    </span>
                  }
                </div>

                <!-- Short Definition -->
                <p class="text-stone-300 text-xs leading-relaxed line-clamp-3">
                  {{ term.shortDefinition }}
                </p>

                <!-- Thinkers -->
                @if (term.associatedThinkers.length > 0) {
                  <div class="flex flex-wrap gap-1.5 pt-2">
                    @for (th of term.associatedThinkers; track th) {
                      <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300/90 border border-amber-500/20 font-sans">
                        {{ th }}
                      </span>
                    }
                  </div>
                }
              </div>

              <!-- Card Footer Action -->
              <div class="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    (click)="lugatService.openTermModal(term)"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer group-hover:underline"
                  >
                    <mat-icon class="!w-4 !h-4 !text-base">menu_book</mat-icon>
                    <span>Şerhi Oku</span>
                  </button>

                  <button
                    type="button"
                    (click)="speakTerm(term, $event)"
                    class="p-1 rounded-lg text-stone-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer"
                    title="Sesli Telaffuz ve Tanım"
                  >
                    <mat-icon class="!w-4 !h-4 !text-base">volume_up</mat-icon>
                  </button>
                </div>

                <span class="text-[10px] text-stone-300 uppercase tracking-widest font-mono">
                  {{ term.category }}
                </span>
              </div>
            </div>
          }
        </div>
      }

      <!-- Detailed Term Modal -->
      @if (lugatService.selectedTerm(); as modalTerm) {
        <div
          role="presentation"
          tabindex="-1"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          (click)="closeModalOnBackdrop($event)"
          (keydown.escape)="lugatService.closeTermModal()"
        >
          <div
            role="dialog"
            aria-modal="true"
            class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0e172a] via-[#091122] to-[#060a14] border border-amber-500/40 shadow-2xl text-stone-200 space-y-6"
          >
            <!-- Modal Header -->
            <div class="flex items-start justify-between gap-4 border-b border-amber-500/20 pb-5">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono uppercase tracking-wider">
                    {{ modalTerm.category }}
                  </span>
                  <span class="text-xs text-stone-400 font-mono">{{ modalTerm.rootLanguage }}</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-3">
                  <span>{{ modalTerm.term }}</span>
                  @if (modalTerm.osmanlica) {
                    <span class="text-amber-400 font-serif text-2xl" dir="rtl">{{ modalTerm.osmanlica }}</span>
                  }
                </h2>
                <p class="text-xs text-stone-400 font-mono">
                  <span class="text-stone-300 font-semibold">Etimoloji:</span> {{ modalTerm.etymology }}
                </p>
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  (click)="speakTerm(modalTerm)"
                  class="p-2 rounded-xl text-stone-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer"
                  title="Sesli Telaffuz ve Şerhi Dinle"
                >
                  <mat-icon class="!w-5 !h-5 !text-xl">volume_up</mat-icon>
                </button>

                <button
                  type="button"
                  (click)="lugatService.closeTermModal()"
                  class="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Kapat"
                >
                  <mat-icon class="!w-5 !h-5 !text-xl">close</mat-icon>
                </button>
              </div>
            </div>

            <!-- Deep Explanation -->
            <div class="space-y-3">
              <h3 class="text-xs font-serif font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <mat-icon class="!w-4 !h-4 !text-base">import_contacts</mat-icon>
                <span>Felsefi & Edebi Şerh</span>
              </h3>
              <p class="text-stone-200 text-sm leading-relaxed whitespace-pre-line font-sans">
                {{ modalTerm.deepExplanation }}
              </p>
            </div>

            <!-- Quote Block if Present -->
            @if (modalTerm.quote) {
              <div class="p-5 rounded-2xl bg-[#070c18] border-l-4 border-amber-400 space-y-2">
                <p class="font-serif italic text-amber-100 text-sm sm:text-base leading-relaxed">
                  "{{ modalTerm.quote.text }}"
                </p>
                <div class="flex items-center justify-between text-xs text-amber-300/80 font-mono pt-1">
                  <span>&mdash; {{ modalTerm.quote.source }}</span>
                </div>
                @if (modalTerm.quote.commentary) {
                  <p class="text-xs text-stone-400 pt-1 font-sans">
                    <span class="text-amber-300 font-semibold">İnceleme:</span> {{ modalTerm.quote.commentary }}
                  </p>
                }
              </div>
            }

            <!-- Thinkers and Related Keywords -->
            <div class="space-y-3 pt-2">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs text-stone-400 font-serif mr-1">İlişkili Düşünürler:</span>
                @for (thinker of modalTerm.associatedThinkers; track thinker) {
                  <span class="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-amber-300 border border-white/10 font-sans">
                    {{ thinker }}
                  </span>
                }
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs text-stone-400 font-serif mr-1">Bağlantılı Kavramlar:</span>
                @for (kw of modalTerm.relatedKeywords; track kw) {
                  <span class="text-xs px-2.5 py-0.5 rounded-md bg-[#0e172a] text-stone-300 border border-white/5 font-mono">
                    #{{ kw }}
                  </span>
                }
              </div>
            </div>

            <!-- Related Articles Link -->
            @if (modalTerm.relatedArticleSlugs && modalTerm.relatedArticleSlugs.length > 0) {
              <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <mat-icon class="!w-5 !h-5 !text-xl text-amber-400">auto_stories</mat-icon>
                  <div>
                    <h4 class="text-xs font-bold text-white">İlgili Akademik Makale</h4>
                    <p class="text-[11px] text-stone-300">Bu kavramın Orçun Kundakcı külliyatındaki derin tahlilini okuyun.</p>
                  </div>
                </div>
                <a
                  [routerLink]="['/makale', modalTerm.relatedArticleSlugs[0]]"
                  (click)="lugatService.closeTermModal()"
                  class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Makaleyi Aç
                </a>
              </div>
            }

            <!-- Modal Footer -->
            <div class="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                (click)="copyTermCitation(modalTerm)"
                class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <mat-icon class="!w-4 !h-4 !text-base">content_copy</mat-icon>
                <span>{{ copied() ? 'Atıf Kopyalandı!' : 'Lügat Atfı Al' }}</span>
              </button>

              <button
                type="button"
                (click)="lugatService.closeTermModal()"
                class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
})
export class LugatComponent {
  readonly lugatService = inject(LugatService);
  readonly speechService = inject(SpeechService);
  readonly copied = signal<boolean>(false);

  readonly rootLanguages = [
    { label: 'Tümü', value: 'all' },
    { label: 'Arapça', value: 'Arapça' },
    { label: 'Farsça', value: 'Farsça' },
    { label: 'Grekçe', value: 'Grekçe' },
    { label: 'Fransızca', value: 'Fransızca' },
    { label: 'Türkçe', value: 'Türkçe' },
    { label: 'Almanca', value: 'Almanca' },
    { label: 'Latince', value: 'Latince' },
  ];

  readonly spotlightTerm = computed<LugatTerm | null>(() => {
    const list = this.lugatService.terms();
    return list.find((t) => t.id === 'vahdet-i-vucud') || list[0] || null;
  });

  speakTerm(term: LugatTerm, event?: MouseEvent): void {
    event?.stopPropagation();
    let text = `${term.term}. `;
    if (term.etymology) text += `Etimoloji: ${term.etymology}. `;
    text += `${term.shortDefinition}. `;
    if (term.quote) text += `Alıntı: ${term.quote.text}. Kaynak: ${term.quote.source}. `;
    text += `${term.deepExplanation}`;
    this.speechService.speak(text, term.term);
  }

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.lugatService.setSearchQuery(val);
  }

  setCategory(category: LugatCategory | 'all'): void {
    this.lugatService.setCategory(category);
  }

  resetFilters(): void {
    this.lugatService.setCategory('all');
    this.lugatService.setRootLanguage('all');
    this.lugatService.setLetter('all');
    this.lugatService.setSearchQuery('');
  }

  closeModalOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.lugatService.closeTermModal();
    }
  }

  copyTermCitation(term: LugatTerm): void {
    const citation = `Kundakcı, Orçun. "${term.term}". Akademik Felsefe & Edebiyat Lügatı, 2026.`;
    navigator.clipboard?.writeText(citation).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
