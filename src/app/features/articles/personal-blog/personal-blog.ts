import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import {ArticleService} from '../../../core/services/article.service';
import {BookmarkService} from '../../../core/services/bookmark.service';
import {SpeechService} from '../../../core/services/speech.service';
import {SecurityService} from '../../../core/services/security.service';
import {AcademicArticle, DisciplineType} from '../../../core/models/article.model';
import {DisciplineBadge} from '../../../shared/components/badge/discipline-badge';
import {SocialShareModal} from '../../social/social-share-modal/social-share-modal';
import {DetailQuoteCardComponent} from '../article-detail/components/detail-quote-card/detail-quote-card';

type ViewMode = 'cards' | 'timeline' | 'index';
type SortOrder = 'newest' | 'views' | 'quick-read' | 'deep-dive';

@Component({
  selector: 'app-personal-blog',
  imports: [
    RouterLink,
    DatePipe,
    MatIconModule,
    DisciplineBadge,
    SocialShareModal,
    DetailQuoteCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">

      <!-- Hero Header: Personal Intellectual Commentary & Blog -->
      <header class="relative p-8 sm:p-12 rounded-3xl cloud-lit-hero overflow-hidden">
        <!-- Ambient Background Glows -->
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-4xl space-y-5 relative z-10">
          
          <!-- Badge -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
              <mat-icon class="!w-4 !h-4 !text-base text-amber-400">history_edu</mat-icon>
              <span>Şahsi Makalelerim & Tefekkür Günlüğü</span>
            </span>
            <span class="text-white/20">&bull;</span>
            <span class="text-xs text-stone-300 font-mono">
              YENİDEM Mecmuası &bull; Yazar: Orçun KUNDAKCI
            </span>
          </div>

          <!-- Main Title -->
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Gelenekten Bugüne <br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
              Şahsi Düşünce Süzgecim
            </span> ve Güncel Yorumlar
          </h1>

          <!-- Intellectual Mission / User statement -->
          <p class="text-sm sm:text-base text-stone-300 font-sans leading-relaxed max-w-3xl">
            Klasik Türk edebiyatının mazmun hazinesini, Divan şiirinin ahenk matematiğini ve Doğu-Batı felsefe mirasını
            tahrif etmeden; <strong>kendi zihin süzgecimden geçirerek</strong> günümüz insanının varoluşsal, estetik ve düşünsel
            sorularına hitap eden şerh, deneme ve akademik incelemelerim.
          </p>

          <!-- Quick Stats Ribbon -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-2xl font-serif font-bold text-amber-400">{{ articleService.articles().length }}</span>
              <span class="text-[11px] text-stone-400">Özgün Makale & Şerh</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-2xl font-serif font-bold text-emerald-400">~{{ totalReadingTime() }} dk</span>
              <span class="text-[11px] text-stone-400">Kapsamlı Etüt Hacmi</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-2xl font-serif font-bold text-cyan-400">SHA-512</span>
              <span class="text-[11px] text-stone-400">Kriptografik Orijinallik</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-2xl font-serif font-bold text-amber-300">{{ totalKeywordsCount() }}</span>
              <span class="text-[11px] text-stone-400">Kavram & Mazmun Bağı</span>
            </div>
          </div>

        </div>
      </header>

      <!-- Search, Filter & View Controls Masthead -->
      <section class="space-y-4">
        
        <!-- Top Search & Sort Row -->
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          <!-- Instant Search Box -->
          <div class="relative flex-1 max-w-2xl">
            <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 !w-5 !h-5 !text-xl text-stone-400">search</mat-icon>
            <input
              type="text"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              placeholder="Yazılarım arasında ara: başlık, filozof, mazmun, vezin veya kavram..."
              class="w-full pl-12 pr-10 py-3 rounded-2xl bg-[#090f1d] border border-white/10 text-stone-100 placeholder-stone-400 text-sm focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
            />
            @if (searchQuery()) {
              <button
                type="button"
                (click)="searchQuery.set('')"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
                title="Aramayı Temizle"
              >
                <mat-icon class="!w-4 !h-4 !text-base">close</mat-icon>
              </button>
            }
          </div>

          <!-- Sort and View Mode Controls -->
          <div class="flex flex-wrap items-center gap-2">
            
            <!-- Sort Filter Dropdown -->
            <div class="relative flex items-center bg-[#090f1d] border border-white/10 rounded-2xl px-3 py-2 text-xs text-stone-200">
              <mat-icon class="!w-4 !h-4 !text-sm text-amber-400 mr-2">sort</mat-icon>
              <select
                [value]="sortBy()"
                (change)="onSortChange($event)"
                class="bg-transparent text-stone-200 text-xs focus:outline-hidden cursor-pointer pr-2"
              >
                <option value="newest" class="bg-[#090f1d] text-stone-200">En Yeni Yazılar (Tarih Sıralı)</option>
                <option value="views" class="bg-[#090f1d] text-stone-200">En Çok Okunanlar</option>
                <option value="quick-read" class="bg-[#090f1d] text-stone-200">Hızlı Okuma (&lt; 6 dk)</option>
                <option value="deep-dive" class="bg-[#090f1d] text-stone-200">Kapsamlı Etütler (&gt; 10 dk)</option>
              </select>
            </div>

            <!-- View Switcher (Cards / Timeline / Index) -->
            <div class="flex items-center gap-1 p-1 bg-[#090f1d] border border-white/10 rounded-2xl text-xs">
              <button
                type="button"
                (click)="viewMode.set('cards')"
                class="nav-pill-btn !h-8 !px-3 text-xs"
                [class.nav-pill-btn-active]="viewMode() === 'cards'"
                title="Kartvizit Görünümü"
              >
                <mat-icon class="!w-4 !h-4 !text-sm">grid_view</mat-icon>
                <span class="hidden sm:inline">Kartvizit</span>
              </button>

              <button
                type="button"
                (click)="viewMode.set('timeline')"
                class="nav-pill-btn !h-8 !px-3 text-xs"
                [class.nav-pill-btn-active]="viewMode() === 'timeline'"
                title="Kronolojik Akış"
              >
                <mat-icon class="!w-4 !h-4 !text-sm">timeline</mat-icon>
                <span class="hidden sm:inline">Zaman Tüneli</span>
              </button>

              <button
                type="button"
                (click)="viewMode.set('index')"
                class="nav-pill-btn !h-8 !px-3 text-xs"
                [class.nav-pill-btn-active]="viewMode() === 'index'"
                title="Fihrist / İndeks Görünümü"
              >
                <mat-icon class="!w-4 !h-4 !text-sm">list</mat-icon>
                <span class="hidden sm:inline">Fihrist</span>
              </button>
            </div>

          </div>

        </div>

        <!-- Discipline Category Pills (Standardized, Adaptive & Luminous) -->
        <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <button
            type="button"
            (click)="selectedDiscipline.set('all')"
            class="nav-pill-btn !h-9 text-xs"
            [class.nav-pill-btn-active]="selectedDiscipline() === 'all'"
          >
            <span>Tüm Makalelerim</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-white/10 text-stone-200">
              {{ articleService.articles().length }}
            </span>
          </button>

          <button
            type="button"
            (click)="selectedDiscipline.set('tde')"
            class="nav-pill-btn !h-9 text-xs"
            [class.nav-pill-btn-active]="selectedDiscipline() === 'tde'"
          >
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">menu_book</mat-icon>
            <span class="hidden sm:inline">Türk Dili & Edebiyatı (TDE)</span>
            <span class="sm:hidden">TDE</span>
          </button>

          <button
            type="button"
            (click)="selectedDiscipline.set('felsefe')"
            class="nav-pill-btn !h-9 text-xs"
            [class.nav-pill-btn-active]="selectedDiscipline() === 'felsefe'"
          >
            <mat-icon class="!w-4 !h-4 !text-base text-emerald-400">psychology</mat-icon>
            <span class="hidden sm:inline">Felsefe & Mantık</span>
            <span class="sm:hidden">Felsefe</span>
          </button>

          <button
            type="button"
            (click)="selectedDiscipline.set('kesisim')"
            class="nav-pill-btn !h-9 text-xs"
            [class.nav-pill-btn-active]="selectedDiscipline() === 'kesisim'"
          >
            <mat-icon class="!w-4 !h-4 !text-base text-sky-400">auto_stories</mat-icon>
            <span class="hidden sm:inline">Disiplinlerarası Kesişim</span>
            <span class="sm:hidden">Kesişim</span>
          </button>
        </div>

      </section>

      <!-- MAIN CONTENT: 3 Switchable Views -->

      <!-- 1. KARTVİZİT VİTRİNİ (Visual Luxury Card Grid) -->
      @if (viewMode() === 'cards') {
        @if (filteredArticles().length === 0) {
          <div class="py-20 text-center space-y-4 bg-[#090f1d] rounded-3xl border border-white/5 p-8">
            <mat-icon class="!w-12 !h-12 !text-5xl text-stone-600">search_off</mat-icon>
            <p class="text-stone-300 font-serif text-lg">Arama kriterlerine uygun makale bulunamadı.</p>
            <p class="text-stone-500 text-xs">Arama sorgusunu veya filtreleri sıfırlayabilirsiniz.</p>
            <button
              type="button"
              (click)="resetFilters()"
              class="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            @for (article of filteredArticles(); track article.id) {
              <article
                class="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#0b1324] via-[#080d19] to-[#04060d] border border-amber-500/25 luxury-card-sheen overflow-hidden"
              >
                <!-- Card Cover Image (High-Res & Aesthetic with Official Logo Fallback) -->
                <div class="relative w-full h-56 sm:h-64 overflow-hidden bg-[#071633]">
                  <img
                    [src]="hasImgError(article.id) || !article.coverImage ? '/assets/default-article-cover.svg' : article.coverImage"
                    [alt]="article.coverImageAlt || article.title"
                    (error)="markImgError(article.id)"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-[#06132b] via-transparent to-black/30"></div>

                  <!-- Top Floating Badges on Image -->
                  <div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <app-discipline-badge [discipline]="article.discipline" />

                    <div class="flex items-center gap-1.5">
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#051026]/85 text-[10px] font-mono text-stone-200 border border-sky-300/25">
                        <mat-icon class="!w-3.5 !h-3.5 !text-xs text-amber-400">schedule</mat-icon>
                        <span>~{{ article.readingTimeMinutes }} dk</span>
                      </span>
                    </div>
                  </div>

                  <!-- Seal Monogram Plaque on Corner -->
                  <div class="absolute bottom-3 right-4 px-2.5 py-1 rounded-xl bg-[#051026]/90 border border-sky-300/35 text-amber-300 font-serif font-bold text-[10px] flex items-center gap-1.5">
                    <img src="/logo.svg" alt="YENİDEM" class="w-4 h-4 rounded-full object-contain" />
                    <span class="text-sky-200 font-sans font-semibold text-[10px]">YENİDEM</span>
                  </div>
                </div>

                <!-- Card Body -->
                <div class="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                  
                  <div class="space-y-3">
                    <!-- Publication Date & Post Index -->
                    <div class="flex items-center justify-between text-[11px] font-mono text-stone-400">
                      <span class="text-amber-400/90 font-medium">
                        {{ article.detailedDateTr || (article.publishedAt | date: 'dd MMMM yyyy') }}
                      </span>
                      <span class="text-stone-500">
                        {{ article.viewCount }} okuma
                      </span>
                    </div>

                    <!-- Article Title -->
                    <h2 class="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      <a [routerLink]="['/makale', article.id]">
                        {{ article.title }}
                      </a>
                    </h2>

                    <!-- Subtitle -->
                    @if (article.subtitle) {
                      <p class="text-xs sm:text-sm font-serif italic text-amber-200/80 leading-relaxed">
                        {{ article.subtitle }}
                      </p>
                    }

                    <!-- Featured Quote Callout ("Özlü Söz") -->
                    @if (article.featuredQuote) {
                      <div class="p-3.5 rounded-2xl bg-[#070b16] border-l-3 border-amber-400 text-stone-200 font-serif italic text-xs sm:text-sm leading-relaxed shadow-inner">
                        "{{ article.featuredQuote }}"
                      </div>
                    }

                    <!-- Abstract -->
                    <p class="text-stone-300 text-xs sm:text-sm font-sans leading-relaxed line-clamp-3">
                      {{ article.abstract }}
                    </p>

                    <!-- Keywords Tags -->
                    @if (article.keywords && article.keywords.length > 0) {
                      <div class="flex flex-wrap gap-1.5 pt-2">
                        @for (kw of article.keywords.slice(0, 4); track kw) {
                          <span class="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-stone-300 border border-white/5 font-mono">
                            #{{ kw }}
                          </span>
                        }
                      </div>
                    }
                  </div>

                  <!-- Card Action Footer (Rich & Aesthetic) -->
                  <div class="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    
                    <!-- Main Read Link -->
                    <a
                      [routerLink]="['/makale', article.id]"
                      class="luxury-btn-primary !h-10"
                    >
                      <mat-icon class="!w-4 !h-4 !text-sm text-stone-950">auto_stories</mat-icon>
                      <span>Yazıyı İncele</span>
                    </a>

                    <!-- Secondary Quick Actions -->
                    <div class="flex items-center gap-1.5">
                      <!-- Quick Preview -->
                      <button
                        type="button"
                        (click)="openPreview(article)"
                        class="luxury-icon-btn !w-9 !h-9"
                        title="Hızlı Önizleme"
                      >
                        <mat-icon class="!w-4 !h-4 !text-base">preview</mat-icon>
                      </button>

                      <!-- Quote Card Generator -->
                      <button
                        type="button"
                        (click)="openQuoteCard(article)"
                        class="luxury-icon-btn !w-9 !h-9 text-amber-300/80 hover:text-amber-300"
                        title="Alıntı Kartı Oluştur"
                      >
                        <mat-icon class="!w-4 !h-4 !text-base">palette</mat-icon>
                      </button>

                      <!-- Social Share Modal Trigger -->
                      <button
                        type="button"
                        (click)="openSocialShare(article)"
                        class="luxury-icon-btn !w-9 !h-9 hover:text-amber-300"
                        title="Sosyal Ağlarda Paylaş"
                      >
                        <mat-icon class="!w-4 !h-4 !text-base">share</mat-icon>
                      </button>

                      <!-- Sesli Dinle / TTS -->
                      <button
                        type="button"
                        (click)="speakArticleSummary(article)"
                        class="luxury-icon-btn !w-9 !h-9 hover:text-cyan-300"
                        title="Özeti Sesli Dinle"
                      >
                        <mat-icon class="!w-4 !h-4 !text-base">volume_up</mat-icon>
                      </button>

                      <!-- Bookmark Toggle -->
                      <button
                        type="button"
                        (click)="bookmarkService.toggleBookmark(article)"
                        class="luxury-icon-btn !w-9 !h-9"
                        [class.nav-pill-btn-active]="bookmarkService.isBookmarked(article.id)"
                        [class.text-amber-400]="bookmarkService.isBookmarked(article.id)"
                        [title]="bookmarkService.isBookmarked(article.id) ? 'Listeden Kaldır' : 'Okuma Listeme Ekle'"
                      >
                        <mat-icon class="!w-4 !h-4 !text-base">
                          {{ bookmarkService.isBookmarked(article.id) ? 'bookmark' : 'bookmark_border' }}
                        </mat-icon>
                      </button>
                    </div>

                  </div>

                </div>
              </article>
            }
          </div>
        }
      }

      <!-- 2. KRONOLOJİK AKIŞ (Timeline Stream) -->
      @if (viewMode() === 'timeline') {
        <div class="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-amber-500/40 before:to-transparent">
          @for (article of filteredArticles(); track article.id) {
            <div class="relative group">
              <!-- Timeline Marker Node -->
              <div class="absolute -left-6 sm:-left-10 top-6 w-6 h-6 rounded-full bg-[#080d19] border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-md">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              </div>

              <!-- Timeline Content Card -->
              <div class="p-6 sm:p-8 rounded-3xl bg-[#090f1d] border border-amber-500/20 hover:border-amber-400/40 transition-all shadow-xl space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <span class="text-amber-400 font-bold">
                    {{ article.detailedDateTr || (article.publishedAt | date: 'dd MMMM yyyy') }}
                  </span>
                  <app-discipline-badge [discipline]="article.discipline" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  @if (article.coverImage) {
                    <div class="md:col-span-1 rounded-2xl overflow-hidden h-40 bg-black">
                      <img
                        [src]="article.coverImage"
                        [alt]="article.title"
                        class="w-full h-full object-cover"
                        referrerpolicy="no-referrer"
                      />
                    </div>
                  }

                  <div [class.md:col-span-3]="article.coverImage" [class.md:col-span-4]="!article.coverImage" class="space-y-2">
                    <h3 class="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      <a [routerLink]="['/makale', article.id]">
                        {{ article.title }}
                      </a>
                    </h3>
                    <p class="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed line-clamp-2">
                      {{ article.abstract }}
                    </p>
                    <div class="pt-2 flex flex-wrap items-center gap-2">
                      <a
                        [routerLink]="['/makale', article.id]"
                        class="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 font-semibold"
                      >
                        <span>İncelemeye Devam Et</span>
                        <mat-icon class="!w-4 !h-4 !text-sm">arrow_forward</mat-icon>
                      </a>
                      <span class="text-white/20">&bull;</span>
                      <span class="text-xs text-stone-400 font-mono">~{{ article.readingTimeMinutes }} dk okuma</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- 3. AKADEMİK FİHRİST (Scholarly Index Table) -->
      @if (viewMode() === 'index') {
        <div class="rounded-3xl bg-[#090f1d] border border-white/10 overflow-hidden shadow-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-[#0c1424] text-amber-400 font-mono text-[11px] border-b border-white/10 uppercase tracking-wider">
                <tr>
                  <th class="p-4 sm:px-6">Tarih</th>
                  <th class="p-4 sm:px-6">Makale Başlığı</th>
                  <th class="p-4 sm:px-6">Disiplin</th>
                  <th class="p-4 sm:px-6">Süre</th>
                  <th class="p-4 sm:px-6 text-right">Eylem</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 text-stone-200">
                @for (article of filteredArticles(); track article.id) {
                  <tr class="hover:bg-white/5 transition-colors">
                    <td class="p-4 sm:px-6 font-mono text-[11px] text-stone-400 whitespace-nowrap">
                      {{ article.publishedAt | date: 'dd.MM.yyyy' }}
                    </td>
                    <td class="p-4 sm:px-6 font-serif font-bold text-white max-w-md">
                      <a [routerLink]="['/makale', article.id]" class="hover:text-amber-300 transition-colors">
                        {{ article.title }}
                      </a>
                    </td>
                    <td class="p-4 sm:px-6 whitespace-nowrap">
                      <app-discipline-badge [discipline]="article.discipline" />
                    </td>
                    <td class="p-4 sm:px-6 font-mono text-[11px] text-stone-400 whitespace-nowrap">
                      ~{{ article.readingTimeMinutes }} dk
                    </td>
                    <td class="p-4 sm:px-6 text-right whitespace-nowrap">
                      <a
                        [routerLink]="['/makale', article.id]"
                        class="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
                      >
                        Oku
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

    </div>

    <!-- Quick Preview Modal -->
    @if (previewArticle(); as prev) {
      <div
        role="presentation"
        tabindex="-1"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        (click)="closePreviewOnBackdrop($event)"
        (keydown.escape)="previewArticle.set(null)"
      >
        <div
          role="dialog"
          aria-modal="true"
          class="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#0a1122] to-[#060a14] border border-amber-500/40 shadow-2xl text-stone-200 space-y-6"
        >
          <!-- Preview Header -->
          <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div class="space-y-1">
              <app-discipline-badge [discipline]="prev.discipline" />
              <h2 class="text-xl sm:text-2xl font-serif font-bold text-white pt-1">
                {{ prev.title }}
              </h2>
              @if (prev.subtitle) {
                <p class="text-xs font-serif italic text-amber-300">{{ prev.subtitle }}</p>
              }
            </div>

            <button
              type="button"
              (click)="previewArticle.set(null)"
              class="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <mat-icon class="!w-5 !h-5 !text-xl">close</mat-icon>
            </button>
          </div>

          <!-- Preview Body -->
          <div class="space-y-4 text-xs sm:text-sm font-sans leading-relaxed text-stone-200">
            @if (prev.featuredQuote) {
              <div class="p-4 rounded-xl bg-[#070b16] border-l-4 border-amber-400 font-serif italic text-amber-100">
                "{{ prev.featuredQuote }}"
              </div>
            }

            <div class="space-y-2">
              <h3 class="font-serif font-bold text-amber-400 uppercase tracking-wider text-xs">Kuramsal Çerçeve & Özet:</h3>
              <p>{{ prev.abstract }}</p>
            </div>

            <!-- Preview First Paragraph -->
            <div class="space-y-2 pt-2 border-t border-white/10">
              <h3 class="font-serif font-bold text-stone-300 text-xs">Giriş Bölümü:</h3>
              <p class="font-serif italic text-stone-300">
                {{ prev.content.slice(0, 320) }}...
              </p>
            </div>
          </div>

          <!-- Preview Actions -->
          <div class="pt-4 border-t border-white/10 flex items-center justify-between">
            <span class="text-xs font-mono text-stone-400">
              SHA-512: {{ prev.sha512Hash?.slice(0, 16) }}...
            </span>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="previewArticle.set(null)"
                class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold"
              >
                Kapat
              </button>
              <a
                [routerLink]="['/makale', prev.id]"
                (click)="previewArticle.set(null)"
                class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md"
              >
                Tam Metni Oku &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Social Share Modal -->
    @if (selectedSocialArticle(); as socArt) {
      <app-social-share-modal
        [article]="socArt"
        (closeModal)="selectedSocialArticle.set(null)"
      />
    }

    <!-- Quote Card Modal -->
    @if (selectedQuoteArticle(); as qArt) {
      <app-detail-quote-card
        [article]="qArt"
        (dismiss)="selectedQuoteArticle.set(null)"
      />
    }
  `,
})
export class PersonalBlogComponent {
  readonly articleService = inject(ArticleService);
  readonly bookmarkService = inject(BookmarkService);
  readonly speechService = inject(SpeechService);
  readonly securityService = inject(SecurityService);
  readonly router = inject(Router);

  readonly searchQuery = signal<string>('');
  readonly selectedDiscipline = signal<DisciplineType | 'all'>('all');
  readonly sortBy = signal<SortOrder>('newest');
  readonly viewMode = signal<ViewMode>('cards');

  readonly previewArticle = signal<AcademicArticle | null>(null);
  readonly selectedSocialArticle = signal<AcademicArticle | null>(null);
  readonly selectedQuoteArticle = signal<AcademicArticle | null>(null);
  readonly failedImgIds = signal<Record<string, boolean>>({});

  hasImgError(id: string): boolean {
    return !!this.failedImgIds()[id];
  }

  markImgError(id: string): void {
    this.failedImgIds.update((prev) => ({...prev, [id]: true}));
  }

  readonly totalReadingTime = computed(() => {
    return this.articleService.articles().reduce((acc, a) => acc + (a.readingTimeMinutes || 5), 0);
  });

  readonly totalKeywordsCount = computed(() => {
    const set = new Set<string>();
    this.articleService.articles().forEach((a) => {
      a.keywords?.forEach((k) => set.add(k));
    });
    return set.size;
  });

  readonly filteredArticles = computed(() => {
    let list = [...this.articleService.articles()];
    const query = this.searchQuery().trim().toLowerCase();
    const disc = this.selectedDiscipline();
    const sort = this.sortBy();

    // 1. Discipline filter
    if (disc !== 'all') {
      list = list.filter((a) => a.discipline === disc);
    }

    // 2. Search query filter
    if (query) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          (a.subtitle && a.subtitle.toLowerCase().includes(query)) ||
          a.abstract.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query) ||
          a.keywords?.some((k) => k.toLowerCase().includes(query))
      );
    }

    // 3. Sorting
    switch (sort) {
      case 'newest':
        list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'views':
        list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'quick-read':
        list.sort((a, b) => (a.readingTimeMinutes || 0) - (b.readingTimeMinutes || 0));
        break;
      case 'deep-dive':
        list.sort((a, b) => (b.readingTimeMinutes || 0) - (a.readingTimeMinutes || 0));
        break;
    }

    return list;
  });

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  onSortChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as SortOrder;
    this.sortBy.set(val);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedDiscipline.set('all');
    this.sortBy.set('newest');
  }

  openPreview(article: AcademicArticle): void {
    this.previewArticle.set(article);
  }

  openQuoteCard(article: AcademicArticle): void {
    this.selectedQuoteArticle.set(article);
  }

  openSocialShare(article: AcademicArticle): void {
    this.selectedSocialArticle.set(article);
  }

  speakArticleSummary(article: AcademicArticle): void {
    const text = `${article.title}. ${article.subtitle ? article.subtitle + '. ' : ''}${article.abstract}`;
    this.speechService.speak(text, article.title);
  }

  closePreviewOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.previewArticle.set(null);
    }
  }
}
