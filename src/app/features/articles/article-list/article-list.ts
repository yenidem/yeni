import {ChangeDetectionStrategy, Component, OnInit, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {ArticleService} from '../../../core/services/article.service';
import {BookmarkService} from '../../../core/services/bookmark.service';
import {SpeechService} from '../../../core/services/speech.service';
import {SeoCardService} from '../../../core/services/seo-card.service';
import {AcademicArticle, DISCIPLINE_DEFINITIONS, DisciplineType} from '../../../core/models/article.model';
import {SocialShareModal} from '../../social/social-share-modal/social-share-modal';
import {DailyVerseComponent} from '../../daily-verse/daily-verse-card';
import {HeritageSliderComponent} from '../../heritage-slider/heritage-slider';
import {ArticleFilterBar, ArchiveSortOrder, ArchiveViewMode} from './components/article-filter-bar';
import {ArticleCard} from './components/article-card';
import {AtaturkBektasHero} from './components/ataturk-bektas-hero';
import {QuickShareBarComponent} from '../../../shared/components/quick-share-bar/quick-share-bar';

@Component({
  selector: 'app-article-list',
  imports: [
    RouterLink,
    DatePipe,
    MatIconModule,
    DailyVerseComponent,
    HeritageSliderComponent,
    SocialShareModal,
    ArticleFilterBar,
    ArticleCard,
    AtaturkBektasHero,
    QuickShareBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 sm:space-y-10 pb-20">

      <!-- MERKEZ SAHNE KOMUTA & KÜRSÜ SEÇİCİ BARI (Sağ Menü İle Tam Senkronize) -->
      <div class="p-3 sm:p-4 rounded-3xl bg-glass-blue flex flex-wrap items-center justify-between gap-2.5">
        <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            (click)="switchStage('dashboard')"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
            [class.nav-pill-btn-active]="articleService.centerStageView() === 'dashboard' && articleService.selectedDiscipline() === 'all' && !articleService.searchQuery()"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">dashboard</mat-icon>
            <span>Ana Kürsü Vitrin</span>
          </button>

          <button
            type="button"
            (click)="onDisciplineChange('tde')"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
            [class.nav-pill-btn-active]="articleService.selectedDiscipline() === 'tde'"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">menu_book</mat-icon>
            <span>Türk Dili ve Edebiyatı</span>
          </button>

          <button
            type="button"
            (click)="onDisciplineChange('felsefe')"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
            [class.nav-pill-btn-active]="articleService.selectedDiscipline() === 'felsefe'"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">psychology</mat-icon>
            <span>Felsefe &amp; Ontoloji</span>
          </button>

          <button
            type="button"
            (click)="onDisciplineChange('kesisim')"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
            [class.nav-pill-btn-active]="articleService.selectedDiscipline() === 'kesisim'"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">auto_stories</mat-icon>
            <span>İrfan &amp; Arakesit</span>
          </button>

          <button
            type="button"
            (click)="switchStage('ataturk-bektas')"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
            [class.nav-pill-btn-active]="articleService.centerStageView() === 'ataturk-bektas'"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">account_balance</mat-icon>
            <span class="hidden sm:inline">Atatürk &amp; Hacı Bektaş</span>
          </button>

          <button
            type="button"
            (click)="switchStage('mirat-irfan')"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
            [class.nav-pill-btn-active]="articleService.centerStageView() === 'mirat-irfan'"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">auto_awesome</mat-icon>
            <span class="hidden md:inline">Mirat-ı İrfan (9 Ulu)</span>
          </button>

          <a
            routerLink="/topluluk-onayi"
            class="nav-pill-btn !h-9 !px-3.5 text-xs !border-amber-400/50"
            title="1.000.000 Üye Taban Sınırı, Sıkı Tel/Mail KYC, %85 Ön Onay ve %96 Blok Zinciri Oylama Merkezî"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">how_to_vote</mat-icon>
            <span>%96 Topluluk Onayı (1M Baraj)</span>
          </a>
        </div>

        <div class="flex items-center gap-2 text-xs font-mono text-sky-200 px-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{{ sortedArticles().length }} Eser Açık</span>
        </div>
      </div>

      <!-- =======================================================================
           DURUM A: SAĞ MENÜDEN VEYA ÜSTTEN BİR KATEGORİ / DİSİPLİN SEÇİLDİĞİNDE
           DOĞRUDAN SAYFANIN ORTASINDA EN ÜSTTE AÇILAN KÜRSÜ SAHNESİ
           ======================================================================= -->
      @if (isCategoryStageActive()) {
        <section
          aria-label="Aktif Kürsü ve Kategori İnceleme Sahnesi"
          class="rounded-3xl bg-glass-blue p-6 sm:p-8 border-2 border-amber-300/55 space-y-5 reveal-up"
        >
          <div class="flex flex-wrap items-start justify-between gap-4 border-b border-sky-300/25 pb-4">
            <div class="space-y-1.5 max-w-3xl">
              <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span class="px-2.5 py-0.5 rounded-lg bg-amber-400 text-stone-950 font-extrabold uppercase">
                  AKTİF KÜRSÜ SAHNESİ
                </span>
                <span class="text-cyan-200 font-semibold">
                  {{ getActiveDisciplineTitle() }}
                </span>
                <span aria-hidden="true" class="text-sky-300/40">·</span>
                <span class="text-emerald-300 flex items-center gap-1">
                  <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-emerald">verified</mat-icon>
                  {{ sortedArticles().length }} Makale · {{ activeStageMinutes() }} dk Toplam Etüt
                </span>
              </div>

              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-white tracking-tight">
                {{ articleService.activeCategoryName() || getActiveDisciplineTitle() }}
              </h1>

              <p class="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-sans">
                {{ articleService.activeCategoryDescription() || getActiveDisciplineDesc() }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                (click)="resetFilters()"
                class="luxury-btn-primary !h-10 !px-4 text-xs"
              >
                <mat-icon class="!w-4 !h-4 !text-base">home</mat-icon>
                <span>Ana Vitrine Dön</span>
              </button>
            </div>
          </div>

          <!-- Quick Sub-Topic Pills inside the Active Center Stage -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <span class="text-xs font-bold text-amber-300 mr-1 flex items-center gap-1">
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">tune</mat-icon>
              <span>Hızlı Alt Başlıklar:</span>
            </span>
            @for (preset of quickCategoryPresets; track preset.title) {
              <button
                type="button"
                (click)="selectPresetCategory(preset)"
                class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                [class.bg-amber-400]="articleService.activeCategoryName() === preset.title"
                [class.text-stone-950]="articleService.activeCategoryName() === preset.title"
                [class.border-amber-200]="articleService.activeCategoryName() === preset.title"
                [class.font-extrabold]="articleService.activeCategoryName() === preset.title"
                [class.bg-[#071836]]="articleService.activeCategoryName() !== preset.title"
                [class.text-sky-100]="articleService.activeCategoryName() !== preset.title"
                [class.border-sky-300/30]="articleService.activeCategoryName() !== preset.title"
              >
                {{ preset.title }}
              </button>
            }
          </div>
        </section>
      }

      <!-- =======================================================================
           DURUM B: ÖZEL KÜRSÜ SEKMELERİ VEYA VARSAYILAN TEMİZ ANA DASHBOARD
           ======================================================================= -->
      @if (articleService.centerStageView() === 'ataturk-bektas') {
        <div class="reveal-up">
          <app-ataturk-bektas-hero (filterKeyword)="quickSearch($event)" />
        </div>
      } @else if (articleService.centerStageView() === 'mirat-irfan') {
        <div class="reveal-up space-y-8">
          <app-heritage-slider (filterByKeyword)="quickSearch($event)" />
          <app-daily-verse-card />
        </div>
      } @else if (!isCategoryStageActive()) {
        <!-- Varsayılan Ana Giriş Dashboard: Başköşe + Hemen Altında Külliyat Makaleleri -->
        <div class="reveal-up">
          <app-ataturk-bektas-hero (filterKeyword)="quickSearch($event)" />
        </div>
      }

      <!-- =======================================================================
           MERKEZ KÜLLİYAT & TARTIŞMA MEYDANI (Sağ Menü Seçimleri Burada Anında Açılır)
           ======================================================================= -->
      <div id="kulliyat-arsivi" class="reveal-up space-y-6">
        <app-article-filter-bar
          [selectedDiscipline]="articleService.selectedDiscipline()"
          [searchQuery]="articleService.searchQuery()"
          [totalCount]="sortedArticles().length"
          [sortOrder]="sortOrder()"
          [viewMode]="viewMode()"
          (disciplineChange)="onDisciplineChange($event)"
          (searchChange)="quickSearch($event)"
          (sortOrderChange)="sortOrder.set($event)"
          (viewModeChange)="viewMode.set($event)"
          (resetAll)="resetFilters()"
        />

        @if (sortedArticles().length > 0) {
          @if (viewMode() === 'grid') {
            <!-- TIER 1: Lead Featured Article ("Kürsü Başmakalesi / Vitrin İncelemesi") -->
            @if (leadArticle(); as lead) {
              <article class="rounded-3xl bg-glass-blue overflow-hidden border border-sky-300/40 group">
                <div class="grid grid-cols-1 2xl:grid-cols-12">
                  <!-- Lead Visual Column -->
                  <a
                    [routerLink]="['/makale', lead.id]"
                    class="2xl:col-span-5 relative min-h-[240px] sm:min-h-[280px] overflow-hidden bg-gradient-to-br from-[#0e295c] via-[#0a1d42] to-[#061229] block"
                  >
                    @if (lead.coverImage && !leadImgError()) {
                      <img
                        [src]="lead.coverImage"
                        [alt]="lead.coverImageAlt || lead.title"
                        (error)="leadImgError.set(true)"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerpolicy="no-referrer"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-[#06142e] via-[#06142e]/30 to-transparent"></div>
                    } @else {
                      <img
                        src="/assets/default-article-cover.svg"
                        [alt]="lead.title"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-[#06142e] via-transparent to-transparent"></div>
                    }

                    <div class="absolute top-4 left-4 px-3 py-1 rounded-xl bg-[#050f24]/90 border border-amber-400/50 flex items-center gap-1.5 text-[11px] font-serif font-bold text-amber-300 shadow-lg">
                      <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">workspace_premium</mat-icon>
                      <span>{{ isCategoryStageActive() ? 'SEÇİLİ KÜRSÜ BAŞMAKALESİ' : 'KÜRSÜ BAŞMAKALESİ' }}</span>
                    </div>
                  </a>

                  <!-- Lead Content Column -->
                  <div class="2xl:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                    <div class="space-y-3.5">
                      <div class="flex flex-wrap items-center gap-2 text-xs text-sky-200/90 font-medium">
                        <span class="text-amber-300 font-bold">{{ getDisciplineLabel(lead.discipline) }}</span>
                        <span aria-hidden="true">·</span>
                        <span class="font-mono tabular-nums">{{ lead.publishedAt | date:'dd.MM.yyyy' }}</span>
                        <span aria-hidden="true">·</span>
                        <span class="font-mono tabular-nums">{{ lead.readingTimeMinutes }} dk etüt</span>
                        <span aria-hidden="true">·</span>
                        <span class="inline-flex items-center gap-1 text-emerald-300 font-mono text-[11px]">
                          <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-emerald">verified</mat-icon>
                          SHA-512 Mühürlü
                        </span>
                      </div>

                      <a [routerLink]="['/makale', lead.id]" class="block space-y-1.5">
                        <h2 class="text-xl sm:text-2xl lg:text-3xl font-serif font-extrabold text-white leading-snug group-hover:text-cyan-200 transition-colors">
                          {{ lead.title }}
                        </h2>
                        @if (lead.subtitle) {
                          <p class="text-xs sm:text-sm font-serif italic text-sky-200/90">
                            {{ lead.subtitle }}
                          </p>
                        }
                      </a>

                      <p class="text-xs sm:text-sm text-stone-100 leading-relaxed font-sans">
                        {{ lead.abstract }}
                      </p>

                      @if (lead.featuredQuote) {
                        <blockquote class="p-3.5 rounded-2xl bg-[#071633]/90 border-l-3 border-amber-400 text-xs sm:text-sm font-serif italic text-amber-100/95">
                          &ldquo;{{ lead.featuredQuote }}&rdquo;
                        </blockquote>
                      }
                    </div>

                    <div class="pt-4 border-t border-sky-300/20 flex flex-wrap items-center justify-between gap-3">
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          (click)="listenArticleSummary(lead)"
                          class="nav-pill-btn !h-9 !px-3.5 text-xs"
                        >
                          <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">volume_up</mat-icon>
                          <span>Sesli Dinle</span>
                        </button>

                        <button
                          type="button"
                          (click)="bookmarkService.toggleBookmark(lead)"
                          class="luxury-icon-btn !w-9 !h-9"
                          title="Okuma Listesine Ekle / Çıkar"
                        >
                          <mat-icon
                            class="!w-4 !h-4 !text-sm"
                            [class.icon-luminous-amber]="bookmarkService.isBookmarked(lead.id)"
                          >
                            {{ bookmarkService.isBookmarked(lead.id) ? 'bookmark' : 'bookmark_border' }}
                          </mat-icon>
                        </button>

                        <button
                          type="button"
                          (click)="activeModalArticle.set(lead)"
                          class="luxury-icon-btn !w-9 !h-9"
                          title="Sosyal Paylaşım Kartı Üret"
                        >
                          <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">share</mat-icon>
                        </button>
                      </div>

                      <a
                        [routerLink]="['/makale', lead.id]"
                        class="luxury-btn-primary !h-10 px-5"
                      >
                        <span>İncelemeyi &amp; Tartışmayı Aç</span>
                        <mat-icon class="!w-4 !h-4 !text-base">arrow_forward</mat-icon>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            }

            <!-- TIER 2: Secondary Feature Cards Grid -->
            @if (secondaryArticles().length > 0) {
              <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                @for (article of secondaryArticles(); track article.id) {
                  <app-article-card
                    [article]="article"
                    [isBookmarked]="bookmarkService.isBookmarked(article.id)"
                    (bookmarkToggle)="bookmarkService.toggleBookmark($event)"
                    (listenClick)="listenArticleSummary($event)"
                    (shareClick)="activeModalArticle.set($event)"
                    (keywordClick)="quickSearch($event)"
                  />
                }
              </div>
            }
          } @else {
            <!-- Scholarly Fihrist / Compact Index View -->
            <div class="rounded-3xl bg-glass-blue overflow-hidden divide-y divide-sky-300/15">
              @for (article of sortedArticles(); track article.id; let idx = $index) {
                <div class="p-5 sm:p-6 hover:bg-sky-400/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="flex items-start gap-4 min-w-0">
                    <span class="font-mono text-sm font-bold text-amber-300/90 tabular-nums pt-0.5">
                      {{ (idx + 1) < 10 ? '0' + (idx + 1) : (idx + 1) }}.
                    </span>
                    <div class="space-y-1 min-w-0">
                      <div class="flex flex-wrap items-center gap-2 text-[11px] text-sky-200/85">
                        <span class="font-semibold text-cyan-300">{{ getDisciplineLabel(article.discipline) }}</span>
                        <span aria-hidden="true">·</span>
                        <span class="font-mono tabular-nums">{{ article.publishedAt | date:'dd.MM.yyyy' }}</span>
                        <span aria-hidden="true">·</span>
                        <span class="font-mono tabular-nums">{{ article.readingTimeMinutes }} dk okuma</span>
                      </div>
                      <a
                        [routerLink]="['/makale', article.id]"
                        class="block text-base sm:text-lg font-serif font-bold text-white hover:text-cyan-200 transition-colors"
                      >
                        {{ article.title }}
                      </a>
                      <p class="text-xs text-stone-200 line-clamp-1 font-sans">
                        {{ article.abstract }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      (click)="listenArticleSummary(article)"
                      class="luxury-icon-btn !w-9 !h-9"
                      title="Sesli Dinle"
                    >
                      <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">volume_up</mat-icon>
                    </button>
                    <a
                      [routerLink]="['/makale', article.id]"
                      class="nav-pill-btn !h-9 !px-3.5 text-xs"
                    >
                      <span>Oku</span>
                      <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">arrow_forward</mat-icon>
                    </a>
                  </div>
                </div>
              }
            </div>
          }
        } @else {
          <div class="p-12 rounded-3xl bg-glass-card text-center space-y-4">
            <div class="w-12 h-12 mx-auto rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
              <mat-icon class="!w-6 !h-6 !text-2xl icon-luminous">search_off</mat-icon>
            </div>
            <h3 class="text-lg font-serif font-bold text-white">Aranan Kriterde Makale Bulunamadı</h3>
            <p class="text-xs text-stone-200 max-w-md mx-auto">
              Seçili disiplin veya arama terimiyle eşleşen inceleme bulunamadı. Tüm külliyatı görüntülemek için filtreyi sıfırlayabilirsiniz.
            </p>
            <button
              type="button"
              (click)="resetFilters()"
              class="luxury-btn-primary mx-auto"
            >
              <mat-icon class="!w-4 !h-4 !text-base">restart_alt</mat-icon>
              <span>Tüm Külliyatı Göster</span>
            </button>
          </div>
        }
      </div>

      <!-- Mirat-ı İrfan & Günün Beyti (Varsayılan Dashboard Modunda Külliyatın Altında Dengeli Yer Alır) -->
      @if (!isCategoryStageActive() && articleService.centerStageView() === 'dashboard') {
        <div class="reveal-up space-y-8">
          <app-heritage-slider (filterByKeyword)="quickSearch($event)" />
          <app-daily-verse-card />
        </div>
      }

      <!-- Sitenin Resmi Dijital Kartviziti & Evrensel Sosyal Paylaşım Kürsüsü -->
      <div class="reveal-up">
        <app-quick-share-bar
          title="YENİDEM — Edebiyat, Felsefe ve Tefekkür Mecmuası | Orçun KUNDAKCI"
          subtitle="Cumhuriyet Aydınlanması ve Anadolu İrfan Kürsüsü"
          summary="Türk Dili ve Edebiyatı ile Felsefe disiplinlerinde SHA-512 mühürlü akademik makaleler, beyit şerhleri, Yedi Ulu Ozan ve Dört Kapı Kırk Makam Atlası."
          quote="Hayatta en hakiki mürşit ilimdir, fendir. · İlimden gidilmeyen yolun sonu karanlıktır."
          url="/"
          label="YENİDEM Resmi Site Kartvizitini & Külliyat Adresini Paylaş"
          [showStudioButton]="true"
          (openStudio)="seoCard.openBusinessCard()"
        />
      </div>

      <!-- Social Share Studio Modal -->
      @if (activeModalArticle(); as article) {
        <app-social-share-modal
          [article]="article"
          (closeModal)="closeSocialModal()"
        />
      }

    </div>
  `,
})
export class ArticleList implements OnInit {
  readonly articleService = inject(ArticleService);
  readonly bookmarkService = inject(BookmarkService);
  readonly seoCard = inject(SeoCardService);
  private readonly speechService = inject(SpeechService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly activeModalArticle = signal<AcademicArticle | null>(null);
  readonly sortOrder = signal<ArchiveSortOrder>('newest');
  readonly viewMode = signal<ArchiveViewMode>('grid');
  readonly leadImgError = signal<boolean>(false);

  readonly quickCategoryPresets: {
    title: string;
    discipline: DisciplineType | 'all';
    query: string;
    description: string;
  }[] = [
    {
      title: 'Tasavvuf & Klasik Şiir',
      discipline: 'tde',
      query: 'Tasavvuf|Fuzûlî|Şeyh Gâlib|Nesîmî',
      description: 'Divan edebiyatında vahdet-i vücûd, aşk metafiziği, Fuzûlî, Şeyh Gâlib ve Seyyid Nesîmî tahlilleri.',
    },
    {
      title: 'Metin Şerhi & Belagat',
      discipline: 'tde',
      query: 'Şerh|Su Kasidesi|Bâkî|Hüsn-i Aşk',
      description: 'Klasik beyit şerhi metodolojisi, mazmun coğrafyası, Bâkî ve Su Kasidesi belagat incelemeleri.',
    },
    {
      title: 'Modern Türk Şiiri',
      discipline: 'tde',
      query: 'Haşim|Tanpınar|Poetika',
      description: 'Ahmet Haşim saf şiir estetiği, Ahmet Hamdi Tanpınar’da Bergsoncu süre ve modern poetika.',
    },
    {
      title: 'Varlık Felsefesi (Ontoloji)',
      discipline: 'felsefe',
      query: 'Ontoloji|İbn Sînâ|Varlık',
      description: 'İbn Sînâ’da zorunlu-mümkün varlık ayrımı, Heideggerci Dasein ve varoluşsal ontoloji.',
    },
    {
      title: 'Bilgi & Dil Felsefesi',
      discipline: 'felsefe',
      query: 'Epistemoloji|Kant|Wittgenstein',
      description: 'Immanuel Kant’ın transandantal idealizmi, Wittgenstein dil felsefesi ve bilimsel yöntem.',
    },
    {
      title: 'Ahlak & Etik Tefekkür',
      discipline: 'felsefe',
      query: 'Etik|Spinoza|Fârâbî|Erdem',
      description: 'Aristoteles ve Fârâbî’de mutluluk etiği ile Spinoza’nın duygulanım felsefesi.',
    },
    {
      title: 'Atatürk & Hacı Bektaş İrfanı',
      discipline: 'kesisim',
      query: 'Atatürk|Hacı Bektaş|Makâlât',
      description: 'Cumhuriyet aydınlanmasının bilimsel mürşit ilkesi ile Hünkâr Hacı Bektâş-ı Velî’nin Anadolu hümanizmi.',
    },
  ];

  readonly isCategoryStageActive = computed(() => {
    return (
      this.articleService.centerStageView() === 'category' ||
      this.articleService.selectedDiscipline() !== 'all' ||
      this.articleService.searchQuery().trim().length > 0
    );
  });

  readonly sortedArticles = computed(() => {
    const list = [...this.articleService.articles()];
    const order = this.sortOrder();
    if (order === 'popular') {
      return list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    }
    if (order === 'quick') {
      return list.sort((a, b) => a.readingTimeMinutes - b.readingTimeMinutes);
    }
    return list.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });

  readonly activeStageMinutes = computed(() => {
    return this.sortedArticles().reduce((sum, a) => sum + (a.readingTimeMinutes || 0), 0);
  });

  readonly leadArticle = computed(() => {
    const list = this.sortedArticles();
    return list.length > 0 ? list[0] : null;
  });

  readonly secondaryArticles = computed(() => {
    const list = this.sortedArticles();
    return list.length > 1 ? list.slice(1) : [];
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const disciplineParam = params.get('discipline') as DisciplineType | 'all' | null;
      const qParam = params.get('q');

      if (disciplineParam || qParam !== null) {
        const validDiscipline: DisciplineType | 'all' =
          disciplineParam === 'tde' || disciplineParam === 'felsefe' || disciplineParam === 'kesisim'
            ? disciplineParam
            : 'all';
        this.articleService.loadArticles(validDiscipline, qParam || '');
      }
    });
  }

  switchStage(mode: 'dashboard' | 'ataturk-bektas' | 'mirat-irfan'): void {
    if (mode === 'dashboard') {
      this.resetFilters();
    } else {
      this.articleService.centerStageView.set(mode);
    }
  }

  selectPresetCategory(preset: {
    title: string;
    discipline: DisciplineType | 'all';
    query: string;
    description: string;
  }): void {
    this.leadImgError.set(false);
    this.articleService.openCategoryInCenter(preset);
    this.router.navigate(['/'], {
      queryParams: {discipline: preset.discipline, q: preset.query},
    });
  }

  getActiveDisciplineTitle(): string {
    const d = this.articleService.selectedDiscipline();
    if (d === 'all') return 'Tüm Akademik Külliyat & Arama Sonuçları';
    return DISCIPLINE_DEFINITIONS[d]?.label || 'Akademik Kürsü';
  }

  getActiveDisciplineDesc(): string {
    const d = this.articleService.selectedDiscipline();
    if (d === 'all') {
      return 'Aranan kavram ve anahtar kelimelerle eşleşen SHA-512 mühürlü akademik makaleler.';
    }
    return DISCIPLINE_DEFINITIONS[d]?.description || '';
  }

  getDisciplineLabel(discipline: DisciplineType): string {
    return DISCIPLINE_DEFINITIONS[discipline]?.label || 'Akademik İnceleme';
  }

  listenArticleSummary(article: AcademicArticle): void {
    const quotePart = article.featuredQuote ? ` Öne çıkan vecize: ${article.featuredQuote}` : '';
    const narration = `${article.title}. ${article.subtitle || ''}. Özet: ${article.abstract}.${quotePart}`;
    this.speechService.speak(narration, article.title);
  }

  onDisciplineChange(discipline: DisciplineType | 'all'): void {
    this.leadImgError.set(false);
    if (discipline === 'all') {
      this.resetFilters();
      return;
    }
    const def = DISCIPLINE_DEFINITIONS[discipline];
    this.articleService.openCategoryInCenter({
      discipline,
      query: '',
      title: def.label,
      description: def.description,
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        discipline,
        q: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  quickSearch(term: string): void {
    this.leadImgError.set(false);
    if (!term.trim()) {
      this.articleService.setSearchQuery('');
      return;
    }
    this.articleService.openCategoryInCenter({
      discipline: this.articleService.selectedDiscipline(),
      query: term,
      title: `“${term}” Araştırma & Kürsü Sonuçları`,
      description: `Külliyat içinde “${term}” kavramı, şahsiyeti veya felsefi izleğiyle bağlantılı makaleler.`,
    });
  }

  resetFilters(): void {
    this.leadImgError.set(false);
    this.articleService.resetToMainDashboard();
    this.router.navigate(['/']);
  }

  closeSocialModal(): void {
    this.activeModalArticle.set(null);
  }
}
