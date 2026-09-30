import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {ArticleService} from '../../../core/services/article.service';
import {SecurityService} from '../../../core/services/security.service';
import {BookmarkService} from '../../../core/services/bookmark.service';
import {SpeechService} from '../../../core/services/speech.service';
import {AccessibilityService} from '../../../core/services/accessibility.service';
import {SeoCardService} from '../../../core/services/seo-card.service';
import {ReaderComfortService} from '../../../core/services/reader-comfort.service';
import {AcademicArticle, BlockchainCertificate} from '../../../core/models/article.model';
import {SocialShareModal} from '../../social/social-share-modal/social-share-modal';
import {QuickShareBarComponent} from '../../../shared/components/quick-share-bar/quick-share-bar';

// Subcomponents
import {DetailHeaderComponent} from './components/detail-header/detail-header';
import {DetailSealCardComponent} from './components/detail-seal-card/detail-seal-card';
import {DetailReferencesComponent} from './components/detail-references/detail-references';
import {DetailRevisionModalComponent} from './components/detail-revision-modal/detail-revision-modal';
import {DetailCitationModalComponent} from './components/detail-citation-modal/detail-citation-modal';
import {DetailAudioPlayerComponent} from './components/detail-audio-player/detail-audio-player';
import {DetailMarginaliaComponent} from './components/detail-marginalia/detail-marginalia';
import {DetailQuoteCardComponent} from './components/detail-quote-card/detail-quote-card';
import {DetailCommentsComponent} from './components/detail-comments/detail-comments';

@Component({
  selector: 'app-article-detail',
  imports: [
    RouterLink,
    DatePipe,
    MatIconModule,
    SocialShareModal,
    QuickShareBarComponent,
    DetailHeaderComponent,
    DetailSealCardComponent,
    DetailReferencesComponent,
    DetailRevisionModalComponent,
    DetailCitationModalComponent,
    DetailAudioPlayerComponent,
    DetailMarginaliaComponent,
    DetailQuoteCardComponent,
    DetailCommentsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (articleService.loading()) {
      <div class="py-32 flex flex-col items-center justify-center space-y-4 text-amber-300">
        <mat-icon class="!w-10 !h-10 !text-4xl animate-spin text-amber-400">sync</mat-icon>
        <p class="text-sm font-serif">Metin ve şerh hazırlanıyor...</p>
      </div>
    } @else if (article(); as art) {
      <div class="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-6 sm:py-10 space-y-8">
        
        <!-- Navigation & Reading Comfort Controls Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-glass-card">
          <a
            routerLink="/"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
          >
            <mat-icon class="!w-4 !h-4 !text-base icon-luminous">arrow_back</mat-icon>
            <span>Külliyata Dön</span>
          </a>

          <!-- Reading Tool: Font Size, Font Family & Accessibility Switcher -->
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              (click)="readerComfort.openArticleInComfortReader(art)"
              class="luxury-btn-primary !h-8 !px-3 text-xs"
              title="Göz Yormayan Tam Ekran Okuma Modunu Aç (Sıcak Parşömen / E-Mürekkep / Gece Safir / Göz Kalkanı)"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs">fullscreen</mat-icon>
              <span>Tam Ekran Göz Konforlu Oku</span>
            </button>

            <button
              type="button"
              (click)="toggleFontFamily()"
              class="nav-pill-btn !h-8 !px-2.5 text-xs"
              title="Google Studio Sans / Klasik Edebiyat Serif Yazı Tipi Değiştir"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">font_download</mat-icon>
              <span>{{ isSerif() ? 'Edebi Serif' : 'Studio Netliği' }}</span>
            </button>

            <div class="inline-flex items-center rounded-xl bg-[#071736] border border-sky-300/30 p-0.5">
              <button
                type="button"
                (click)="decreaseFontSize()"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-sky-200 hover:text-white hover:bg-sky-400/15 transition-colors cursor-pointer"
                title="Makale Yazı Boyutunu Küçült"
              >
                <span class="text-xs font-bold">A-</span>
              </button>
              <span class="px-1.5 font-mono text-[11px] text-amber-300 font-bold tabular-nums">{{ fontSize() }}px</span>
              <button
                type="button"
                (click)="increaseFontSize()"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-sky-200 hover:text-white hover:bg-sky-400/15 transition-colors cursor-pointer"
                title="Makale Yazı Boyutunu Büyüt"
              >
                <span class="text-xs font-bold">A+</span>
              </button>
            </div>

            <button
              type="button"
              (click)="a11y.toggleReadingGuide()"
              class="nav-pill-btn !h-8 !px-2.5 text-xs"
              [class.nav-pill-btn-active]="a11y.readingGuide()"
              title="Işıklı Satır Takip Cetvelini Aç / Kapat"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">horizontal_rule</mat-icon>
              <span class="hidden sm:inline">Satır Cetveli</span>
            </button>

            <button
              type="button"
              (click)="a11y.togglePanel()"
              class="nav-pill-btn !h-8 !px-2.5 text-xs"
              title="Gelişmiş Okunurluk ve Erişilebilirlik Ayarları"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">accessibility_new</mat-icon>
              <span class="hidden md:inline">Erişilebilirlik</span>
            </button>

            <!-- Admin Edit Button if Authenticated -->
            @if (securityService.isAuthor()) {
              <a
                [routerLink]="['/yaz']"
                class="nav-pill-btn !h-8 !px-2.5 text-xs !border-amber-400/50 text-amber-300"
                title="Makaleyi Düzenle"
              >
                <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">edit</mat-icon>
                <span>Düzenle</span>
              </a>
            }
          </div>
        </div>

        <!-- Primary Velvety Sapphire Reading Sheet Container -->
        <div class="reading-paper-card rounded-3xl p-5 sm:p-8 lg:p-10 space-y-8">
          <!-- Article Header Subcomponent -->
          <app-detail-header
            [article]="art"
            [isBookmarked]="bookmarkService.isBookmarked(art.id)"
            (share)="showSocialModal.set(true)"
            (copyCitation)="showCitationModal.set(true)"
            (bookmark)="bookmarkService.toggleBookmark(art)"
            (quoteCard)="showQuoteCardModal.set(true)"
          />

          <!-- Sesli Dinle / Audio Player Subcomponent -->
          <app-detail-audio-player [article]="art" />

          <!-- Cryptographic and Blockchain Seal Card Subcomponent -->
          <app-detail-seal-card
            [article]="art"
            (verifyIntegrity)="verifyIntegrity(art)"
            (openCertificate)="loadFullCertificate(art.id)"
            (viewHistory)="showRevisionModal.set(true)"
          />

          <!-- Featured Quote (if present) -->
          @if (art.featuredQuote) {
            <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#071836] via-[#0b234d] to-[#081b3b] border-l-4 border-amber-400 text-amber-100 font-serif italic text-base sm:text-lg leading-relaxed shadow-md">
              &ldquo;{{ art.featuredQuote }}&rdquo;
            </div>
          }

          <!-- Abstract Block -->
          @if (art.abstract) {
            <div class="p-5 sm:p-6 rounded-2xl bg-[#071633]/90 border border-sky-300/30 text-stone-100 text-sm sm:text-base leading-relaxed space-y-2 shadow-inner">
              <h3 class="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">subject</mat-icon>
                <span>Özet / Kuramsal Çerçeve</span>
              </h3>
              <p class="font-sans">{{ art.abstract }}</p>
            </div>
          }

          <!-- Cover Image (with automatic official logo cover fallback) -->
          <div class="rounded-2xl overflow-hidden border border-sky-300/30 bg-[#06132b] shadow-2xl space-y-2">
            @if (art.coverImage && !coverImgError()) {
              <img
                [src]="art.coverImage"
                [alt]="art.coverImageAlt || art.title"
                (error)="coverImgError.set(true)"
                class="w-full max-h-[460px] object-cover"
                referrerpolicy="no-referrer"
              />
            } @else {
              <img
                src="/assets/default-article-cover.svg"
                [alt]="art.title"
                class="w-full max-h-[360px] object-cover"
              />
            }
            @if (art.coverImageCaption) {
              <p class="text-xs text-sky-200/90 font-serif italic text-center py-2 px-4">
                {{ art.coverImageCaption }}
              </p>
            }
          </div>

          <!-- Main Article Content Body -->
          <article
            class="academic-prose drop-cap text-stone-100 leading-relaxed pt-2"
            [style.fontSize.px]="fontSize()"
            [class.font-academic-serif]="isSerif()"
            [class.font-academic-sans]="!isSerif()"
          >
            @for (block of parsedContent(); track $index) {
              @switch (block.type) {
                @case ('heading') {
                  <h2>{{ block.text }}</h2>
                }
                @case ('subheading') {
                  <h3>{{ block.text }}</h3>
                }
                @case ('quote') {
                  <blockquote>{{ block.text }}</blockquote>
                }
                @case ('poem') {
                  <div class="beyit">{{ block.text }}</div>
                }
                @default {
                  <p>{{ block.text }}</p>
                }
              }
            }
          </article>

          <!-- Keywords & Tags -->
          @if (art.keywords && art.keywords.length > 0) {
            <div class="pt-6 border-t border-sky-300/25 flex flex-wrap items-center gap-2">
              <span class="text-xs text-sky-200 font-serif mr-1">Anahtar Kavramlar:</span>
              @for (kw of art.keywords; track kw) {
                <a
                  [routerLink]="['/']"
                  [queryParams]="{q: kw}"
                  class="text-[11px] px-3 py-1 rounded-xl bg-[#071633] hover:bg-sky-500/25 text-cyan-200 hover:text-amber-300 border border-sky-300/25 font-mono transition-colors"
                >
                  #{{ kw }}
                </a>
              }
            </div>
          }

          <!-- Universal Social Share Bar for This Article -->
          <app-quick-share-bar
            [title]="art.title"
            [subtitle]="art.subtitle || ''"
            [summary]="art.abstract"
            [quote]="art.featuredQuote || ''"
            [url]="'/makale/' + art.id"
            label="Bu Akademik Makaleyi & Kartvizitini Paylaş"
            [showStudioButton]="true"
            (openStudio)="showSocialModal.set(true)"
          />
        </div>

        <!-- References Subcomponent -->
        <app-detail-references
          [references]="art.references || []"
          (copyAllReferences)="copyAllReferences(art)"
        />

        <!-- Marginalia / Derkenar System -->
        <app-detail-marginalia [article]="art" />

        <!-- Derkenar Kürsüsü & Tenkit Meclisi (Scholarly Reader Critiques & Q&A) -->
        <app-detail-comments [article]="art" />

      </div>

      <!-- Revision History Modal Subcomponent -->
      @if (showRevisionModal()) {
        <app-detail-revision-modal
          [article]="art"
          (dismiss)="showRevisionModal.set(false)"
        />
      }

      <!-- Multi-Standard Academic Citation Modal -->
      @if (showCitationModal()) {
        <app-detail-citation-modal
          [article]="art"
          (dismiss)="showCitationModal.set(false)"
        />
      }

      <!-- Authenticity Certificate Modal -->
      @if (showCertificate() && certificateData()) {
        <div
          role="presentation"
          tabindex="-1"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020817]/80"
          (click)="closeCertificateOnBackdrop($event)"
          (keydown.escape)="showCertificate.set(false)"
        >
          <div
            role="dialog"
            aria-modal="true"
            class="relative w-full max-w-xl p-8 rounded-3xl bg-glass-blue border-2 border-amber-400/55 shadow-2xl text-stone-100 space-y-6"
          >
            <!-- Certificate Header -->
            <div class="text-center space-y-2 border-b border-sky-300/25 pb-4">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-400/45 flex items-center justify-center text-amber-300 shadow-md">
                <mat-icon class="text-2xl">verified</mat-icon>
              </div>
              <h3 class="text-xl font-serif font-bold text-white tracking-wide">
                Kültür Hazinesi &amp; Külliyat Orijinallik Sertifikası
              </h3>
              <p class="text-xs text-amber-300 font-mono">
                Sertifika No: {{ certificateData()?.certificateId }}
              </p>
            </div>

            <!-- Certificate Body -->
            <div class="space-y-3 text-xs font-mono bg-[#06142e] p-4 rounded-2xl border border-sky-300/25">
              <div class="flex justify-between">
                <span class="text-sky-200/80">Hak Sahibi:</span>
                <span class="text-white font-bold">{{ certificateData()?.holder }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sky-200/80">Tescil Tarihi:</span>
                <span class="text-stone-200">{{ certificateData()?.issueDate | date: 'dd.MM.yyyy HH:mm' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sky-200/80">Blok Zinciri Bloğu:</span>
                <span class="text-cyan-300 font-bold">#{{ certificateData()?.blockNumber }}</span>
              </div>
              <div class="border-t border-sky-300/20 pt-2">
                <span class="text-sky-200/80 block mb-1">SHA-512 Kuantum Özeti:</span>
                <span class="text-amber-200 break-all text-[10px] leading-tight block">
                  {{ certificateData()?.articleHash }}
                </span>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                (click)="showCertificate.set(false)"
                class="luxury-btn-primary"
              >
                <span>Kapat</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Social Share Modal -->
      @if (showSocialModal()) {
        <app-social-share-modal
          [article]="art"
          (closeModal)="showSocialModal.set(false)"
        />
      }

      <!-- Academic Quote Card Modal -->
      @if (showQuoteCardModal()) {
        <app-detail-quote-card
          [article]="art"
          (dismiss)="showQuoteCardModal.set(false)"
        />
      }

    } @else {
      <div class="py-32 flex flex-col items-center justify-center space-y-4 text-center">
        <mat-icon class="!w-12 !h-12 !text-5xl text-sky-400">article</mat-icon>
        <h2 class="text-xl font-serif font-bold text-white">Makale Bulunamadı</h2>
        <p class="text-xs text-sky-200/80">Talep edilen akademik metin arşivde mevcut değil veya kaldırılmış.</p>
        <a routerLink="/" class="luxury-btn-primary">Külliyata Dön</a>
      </div>
    }
  `,
})
export class ArticleDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  readonly articleService = inject(ArticleService);
  readonly securityService = inject(SecurityService);
  readonly bookmarkService = inject(BookmarkService);
  readonly speechService = inject(SpeechService);
  readonly a11y = inject(AccessibilityService);
  readonly seoCard = inject(SeoCardService);
  readonly readerComfort = inject(ReaderComfortService);

  readonly article = computed(() => this.articleService.currentArticle());
  readonly fontSize = signal<number>(18);
  readonly isSerif = signal<boolean>(false);
  readonly showSocialModal = signal<boolean>(false);
  readonly showRevisionModal = signal<boolean>(false);
  readonly showCitationModal = signal<boolean>(false);
  readonly showCertificate = signal<boolean>(false);
  readonly showQuoteCardModal = signal<boolean>(false);
  readonly coverImgError = signal<boolean>(false);
  readonly certificateData = signal<BlockchainCertificate | null>(null);

  constructor() {
    effect(() => {
      const art = this.article();
      if (art) {
        this.seoCard.setArticleBusinessCardMeta(art);
      }
    });
  }

  readonly parsedContent = computed(() => {
    const art = this.article();
    if (!art || !art.content) return [];
    const lines = art.content.split('\n');
    const result: {type: 'heading' | 'subheading' | 'quote' | 'poem' | 'paragraph'; text: string}[] = [];

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;
      if (line.startsWith('## ')) {
        result.push({type: 'heading', text: line.substring(3).trim()});
      } else if (line.startsWith('### ')) {
        result.push({type: 'subheading', text: line.substring(4).trim()});
      } else if (line.startsWith('> ')) {
        result.push({type: 'quote', text: line.substring(2).trim()});
      } else if (line.startsWith('| ')) {
        result.push({type: 'poem', text: line.substring(2).trim()});
      } else {
        result.push({type: 'paragraph', text: line});
      }
    }
    return result;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idOrSlug = params.get('id');
      if (idOrSlug) {
        this.articleService.getArticle(idOrSlug).subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.speechService.isSpeaking()) {
      this.speechService.stop();
    }
  }

  toggleFontFamily(): void {
    this.isSerif.update((v) => !v);
  }

  increaseFontSize(): void {
    this.fontSize.update((s) => Math.min(26, s + 1));
  }

  decreaseFontSize(): void {
    this.fontSize.update((s) => Math.max(15, s - 1));
  }

  copyAllReferences(art: AcademicArticle): void {
    if (!art.references || !art.references.length) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(art.references.join('\n'));
    }
  }

  verifyIntegrity(art: AcademicArticle): void {
    this.securityService.openVerifierModal(art);
  }

  loadFullCertificate(articleId: string): void {
    this.articleService.getCertificate(articleId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.certificateData.set(res.data);
          this.showCertificate.set(true);
        }
      },
    });
  }

  closeCertificateOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.showCertificate.set(false);
    }
  }
}
