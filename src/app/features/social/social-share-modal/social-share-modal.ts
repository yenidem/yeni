import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {ReactiveFormsModule, FormControl} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {
  AcademicArticle,
  SOCIAL_CARD_FORMATS,
  SocialCardFormat,
  SocialCardTheme,
} from '../../../core/models/article.model';
import {SocialCardService} from '../../../core/services/social-card.service';
import {AiAcademicService} from '../../../core/services/ai-academic.service';
import {SeoCardService, SharePayload} from '../../../core/services/seo-card.service';

@Component({
  selector: 'app-social-share-modal',
  imports: [MatIconModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="social-modal-title"
    >
      <!-- Backdrop click listener -->
      <button
        type="button"
        (click)="closeModal.emit()"
        class="fixed inset-0 bg-[#01081a]/85 backdrop-blur-md w-full h-full border-0 p-0 cursor-default focus:outline-hidden"
        aria-label="Pencereyi kapat"
      ></button>

      <div
        class="relative w-full max-w-4xl bg-gradient-to-br from-[#10182a] via-[#0d1424] to-[#070b14] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10"
      >
        <!-- Modal Top Bar -->
        <div class="px-6 py-4 border-b border-amber-500/20 flex items-center justify-between bg-[#080d1a]/95">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <mat-icon class="!w-5 !h-5 !text-lg">share</mat-icon>
            </div>
            <div>
              <h2 id="social-modal-title" class="text-base font-serif font-bold text-white">YENİDEM Sosyal Paylaşım & Kartvizit Stüdyosu</h2>
              <p class="text-xs text-stone-300">YENİDEM mühürlü yüksek çözünürlüklü görsel kart ve hikaye (Story) üretimi</p>
            </div>
          </div>
          <button
            type="button"
            (click)="closeModal.emit()"
            class="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-6 space-y-6 overflow-y-auto">
          
          <!-- Visual Canvas Container -->
          <div class="space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <span class="text-xs font-serif font-bold uppercase tracking-wider text-amber-300">
                Görsel Kart Önizleme (HD Çözünürlük)
              </span>

              <!-- Theme Palette Selector -->
              <div class="flex items-center gap-1.5 p-1 bg-[#050811] rounded-xl border border-white/10">
                <button
                  type="button"
                  (click)="selectedTheme.set('royal-blue')"
                  class="px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer"
                  [class.bg-amber-500]="selectedTheme() === 'royal-blue'"
                  [class.text-stone-950]="selectedTheme() === 'royal-blue'"
                  [class.font-bold]="selectedTheme() === 'royal-blue'"
                  [class.text-stone-300]="selectedTheme() !== 'royal-blue'"
                >
                  Mürekkep & Altın
                </button>
                <button
                  type="button"
                  (click)="selectedTheme.set('parchment')"
                  class="px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer"
                  [class.bg-amber-100]="selectedTheme() === 'parchment'"
                  [class.text-stone-900]="selectedTheme() === 'parchment'"
                  [class.font-bold]="selectedTheme() === 'parchment'"
                  [class.text-stone-300]="selectedTheme() !== 'parchment'"
                >
                  Klasik Parşömen
                </button>
                <button
                  type="button"
                  (click)="selectedTheme.set('dark-editorial')"
                  class="px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer"
                  [class.bg-stone-800]="selectedTheme() === 'dark-editorial'"
                  [class.text-white]="selectedTheme() === 'dark-editorial'"
                  [class.font-bold]="selectedTheme() === 'dark-editorial'"
                  [class.text-stone-300]="selectedTheme() !== 'dark-editorial'"
                >
                  Obsidiyen Gece
                </button>
              </div>
            </div>

            <!-- Canvas Display Box -->
            <div class="relative w-full rounded-2xl overflow-hidden border border-amber-500/25 bg-[#050812] shadow-inner flex items-center justify-center p-3">
              <canvas
                #cardCanvas
                class="w-full h-auto max-h-[380px] object-contain rounded-xl shadow-2xl border border-white/10"
              ></canvas>
            </div>

            <!-- Format Selector Controls -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div class="flex items-center gap-2">
                <span class="text-xs text-stone-300">Biçim & Boyut:</span>
                @for (fmt of formats; track fmt.id) {
                  <button
                    type="button"
                    (click)="selectedFormat.set(fmt.id)"
                    class="px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer"
                    [class.border-amber-400]="selectedFormat() === fmt.id"
                    [class.bg-amber-500/20]="selectedFormat() === fmt.id"
                    [class.text-amber-300]="selectedFormat() === fmt.id"
                    [class.border-white/10]="selectedFormat() !== fmt.id"
                    [class.text-stone-300]="selectedFormat() !== fmt.id"
                  >
                    {{ fmt.name }}
                  </button>
                }
              </div>

              <!-- Canvas Export Action Buttons -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="downloadImage()"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111929] hover:bg-[#162238] text-amber-200 text-xs font-semibold border border-amber-500/30 transition-colors cursor-pointer shadow-md"
                >
                  <mat-icon class="!w-4 !h-4 !text-base">download</mat-icon>
                  <span>Görseli İndir (.PNG)</span>
                </button>

                <button
                  type="button"
                  (click)="shareImage()"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md shadow-amber-950/50 transition-all cursor-pointer border border-amber-300"
                >
                  <mat-icon class="!w-4 !h-4 !text-base">share</mat-icon>
                  <span>Paylaş</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Direct Social Media Share Bar -->
          <div class="p-4 rounded-2xl bg-[#071633] border border-sky-300/30 space-y-2.5">
            <div class="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">public</mat-icon>
              <span>Makale Bağlantısını &amp; Kartvizitini Sosyal Ağlarda Doğrudan Paylaş</span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <a
                [href]="seoCard.getWhatsAppShareUrl(getSharePayload())"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-pill-btn !h-9 !px-3 text-xs !border-emerald-400/45"
              >
                <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">chat</mat-icon>
                <span>WhatsApp</span>
              </a>
              <a
                [href]="seoCard.getXShareUrl(getSharePayload())"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-pill-btn !h-9 !px-3 text-xs !border-sky-400/45"
              >
                <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">campaign</mat-icon>
                <span>X (Twitter)</span>
              </a>
              <a
                [href]="seoCard.getLinkedInShareUrl(getSharePayload())"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-pill-btn !h-9 !px-3 text-xs !border-blue-400/45"
              >
                <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">work</mat-icon>
                <span>LinkedIn</span>
              </a>
              <a
                [href]="seoCard.getTelegramShareUrl(getSharePayload())"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-pill-btn !h-9 !px-3 text-xs !border-cyan-400/45"
              >
                <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">send</mat-icon>
                <span>Telegram</span>
              </a>
              <button
                type="button"
                (click)="seoCard.copyShareCardText(getSharePayload())"
                class="nav-pill-btn !h-9 !px-3 text-xs !border-amber-400/50"
              >
                <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">content_copy</mat-icon>
                <span>Kartvizit Bağlantısını Kopyala</span>
              </button>
            </div>
          </div>

          <!-- Quote Customizer Input -->
          <div class="space-y-1.5">
            <label for="quoteCustomizerInput" class="text-xs font-semibold text-sky-200 block">
              Görsel Karta Basılacak Alıntı / Düşünce (Düzenlenebilir):
            </label>
            <div class="flex gap-2">
              <input
                id="quoteCustomizerInput"
                type="text"
                [formControl]="quoteControl"
                class="flex-1 px-3.5 py-2.5 bg-[#02081c] border border-sky-500/30 rounded-xl text-xs sm:text-sm text-white placeholder-sky-400/50 focus:outline-hidden focus:border-sky-400 shadow-inner"
                placeholder="Görsel kartın üzerinde yer alacak en vurucu felsefi veya edebi cümle..."
              />
              <button
                type="button"
                (click)="regenerateCanvas()"
                class="px-3.5 py-2 bg-[#072054] hover:bg-[#0c317e] text-sky-200 hover:text-white text-xs font-medium rounded-xl border border-sky-400/35 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Karta Uygula"
              >
                <mat-icon class="!w-4 !h-4 !text-base">refresh</mat-icon>
                <span>Yenile</span>
              </button>
            </div>
          </div>

          <!-- AI Social Post Generator Section -->
          <div class="p-5 sm:p-6 rounded-2xl bg-[#080d1a] border border-amber-500/25 space-y-4 shadow-xl">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <mat-icon class="!w-5 !h-5 !text-lg text-amber-400">auto_awesome</mat-icon>
                <span class="text-sm font-serif font-bold text-white">Yapay Zekâ Akademik Metin Yazarı</span>
                <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-mono">
                  Gemini Flash
                </span>
              </div>

              <button
                type="button"
                (click)="generateSocialText()"
                [disabled]="aiService.generatingSocial()"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-md shadow-amber-950/40 cursor-pointer disabled:opacity-50 border border-amber-300"
              >
                @if (aiService.generatingSocial()) {
                  <mat-icon class="!w-4 !h-4 !text-base animate-spin">sync</mat-icon>
                  <span>Metin Üretiliyor...</span>
                } @else {
                  <mat-icon class="!w-4 !h-4 !text-base">magic_button</mat-icon>
                  <span>Sosyal Ağ Metinleri Üret</span>
                }
              </button>
            </div>

            <!-- Social Text Result Tabs -->
            @if (aiService.lastSocialPost(); as post) {
              <div class="space-y-3 pt-2">
                <!-- Platform Tab Selection -->
                <div class="flex border-b border-amber-500/20 gap-3">
                  <button
                    type="button"
                    (click)="activeSocialTab.set('x')"
                    class="pb-2 text-xs font-medium border-b-2 transition-colors cursor-pointer"
                    [class.border-amber-400]="activeSocialTab() === 'x'"
                    [class.text-amber-300]="activeSocialTab() === 'x'"
                    [class.font-bold]="activeSocialTab() === 'x'"
                    [class.border-transparent]="activeSocialTab() !== 'x'"
                    [class.text-stone-400]="activeSocialTab() !== 'x'"
                  >
                    X (Twitter)
                  </button>
                  <button
                    type="button"
                    (click)="activeSocialTab.set('linkedin')"
                    class="pb-2 text-xs font-medium border-b-2 transition-colors cursor-pointer"
                    [class.border-amber-400]="activeSocialTab() === 'linkedin'"
                    [class.text-amber-300]="activeSocialTab() === 'linkedin'"
                    [class.font-bold]="activeSocialTab() === 'linkedin'"
                    [class.border-transparent]="activeSocialTab() !== 'linkedin'"
                    [class.text-stone-400]="activeSocialTab() !== 'linkedin'"
                  >
                    LinkedIn
                  </button>
                  <button
                    type="button"
                    (click)="activeSocialTab.set('instagram')"
                    class="pb-2 text-xs font-medium border-b-2 transition-colors cursor-pointer"
                    [class.border-amber-400]="activeSocialTab() === 'instagram'"
                    [class.text-amber-300]="activeSocialTab() === 'instagram'"
                    [class.font-bold]="activeSocialTab() === 'instagram'"
                    [class.border-transparent]="activeSocialTab() !== 'instagram'"
                    [class.text-stone-400]="activeSocialTab() !== 'instagram'"
                  >
                    Instagram
                  </button>
                </div>

                <!-- Active Content Display -->
                <div class="relative p-4 rounded-xl bg-[#050812] border border-amber-500/20 text-xs text-stone-200 leading-relaxed font-sans shadow-inner">
                  @switch (activeSocialTab()) {
                    @case ('x') {
                      <p class="whitespace-pre-wrap">{{ post.xThread }}</p>
                    }
                    @case ('linkedin') {
                      <p class="whitespace-pre-wrap">{{ post.linkedInPost }}</p>
                    }
                    @case ('instagram') {
                      <p class="whitespace-pre-wrap">{{ post.instagramCaption }}</p>
                    }
                  }

                  <div class="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <div class="flex flex-wrap gap-1.5">
                      @for (tag of post.hashtags; track tag) {
                        <span class="text-[11px] text-amber-300 bg-white/5 px-2.5 py-0.5 rounded-md border border-amber-500/20 font-mono">{{ tag }}</span>
                      }
                    </div>
                    <button
                      type="button"
                      (click)="copyActiveText()"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium border border-amber-500/30 transition-colors cursor-pointer shadow-sm"
                    >
                      <mat-icon class="!w-3.5 !h-3.5 !text-sm">
                        {{ copied() ? 'check' : 'content_copy' }}
                      </mat-icon>
                      <span>{{ copied() ? 'Kopyalandı!' : 'Metni Kopyala' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            } @else {
              <p class="text-xs text-stone-400 italic">
                Tek tıkla X (Twitter), LinkedIn ve Instagram için akademik ciddiyette, fikri tahlili öne çıkaran hazır paylaşım metinleri üretin.
              </p>
            }
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-3.5 border-t border-amber-500/20 bg-[#080d1a] flex items-center justify-between text-xs text-stone-400">
          <span>&copy; Orçun KUNDAKCI &bull; AÖF TDE & Felsefe</span>
          <button
            type="button"
            (click)="closeModal.emit()"
            class="px-4 py-1.5 rounded-xl bg-[#111929] hover:bg-[#162238] text-amber-200 border border-amber-500/30 font-medium transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SocialShareModal implements AfterViewInit {
  readonly article = input.required<AcademicArticle>();
  readonly closeModal = output<void>();

  private readonly socialCardService = inject(SocialCardService);
  readonly aiService = inject(AiAcademicService);
  readonly seoCard = inject(SeoCardService);

  getSharePayload(): SharePayload {
    const art = this.article();
    return {
      title: art.title,
      subtitle: art.subtitle,
      summary: art.abstract,
      quote: this.quoteControl.value || art.featuredQuote,
      url: `/makale/${art.id}`,
    };
  }

  readonly cardCanvas = viewChild<ElementRef<HTMLCanvasElement>>('cardCanvas');

  readonly formats = SOCIAL_CARD_FORMATS;
  readonly selectedFormat = signal<SocialCardFormat>('x-twitter');
  readonly selectedTheme = signal<SocialCardTheme>('royal-blue');
  readonly activeSocialTab = signal<'x' | 'linkedin' | 'instagram'>('x');
  readonly copied = signal<boolean>(false);

  readonly quoteControl = new FormControl<string>('');

  constructor() {
    // Effect to re-render canvas when format or theme changes
    effect(() => {
      // track dependencies
      this.selectedFormat();
      this.selectedTheme();
      const canvasEl = this.cardCanvas()?.nativeElement;
      if (canvasEl) {
        this.renderCanvas();
      }
    });
  }

  ngAfterViewInit(): void {
    const art = this.article();
    this.quoteControl.setValue(art.featuredQuote || art.abstract.substring(0, 140));
    setTimeout(() => {
      this.renderCanvas();
    }, 50);
  }

  async renderCanvas(): Promise<void> {
    const canvas = this.cardCanvas()?.nativeElement;
    if (!canvas) return;

    await this.socialCardService.renderCard(canvas, {
      article: this.article(),
      theme: this.selectedTheme(),
      format: this.selectedFormat(),
      customQuote: this.quoteControl.value || undefined,
    });
  }

  regenerateCanvas(): void {
    this.renderCanvas();
  }

  downloadImage(): void {
    const canvas = this.cardCanvas()?.nativeElement;
    if (!canvas) return;
    const slug = this.article().slug || 'makale';
    this.socialCardService.downloadCanvasAsPng(canvas, `orcun-kundakci-${slug}-${this.selectedFormat()}`);
  }

  async shareImage(): Promise<void> {
    const canvas = this.cardCanvas()?.nativeElement;
    if (!canvas) return;
    const art = this.article();
    await this.socialCardService.shareCanvas(
      canvas,
      art.title,
      `${art.title} - Orçun KUNDAKCI (AÖF TDE & Felsefe)`,
    );
  }

  generateSocialText(): void {
    const art = this.article();
    this.aiService
      .generateSocialPost({
        title: art.title,
        discipline: art.discipline,
        excerpt: art.abstract,
        featuredQuote: this.quoteControl.value || art.featuredQuote,
      })
      .subscribe({
        next: (res) => {
          if (res.data?.socialCardQuote && !this.quoteControl.value) {
            this.quoteControl.setValue(res.data.socialCardQuote);
            this.renderCanvas();
          }
        },
      });
  }

  copyActiveText(): void {
    const post = this.aiService.lastSocialPost();
    if (!post) return;

    let textToCopy = '';
    if (this.activeSocialTab() === 'x') {
      textToCopy = `${post.xThread}\n\n${post.hashtags.join(' ')}`;
    } else if (this.activeSocialTab() === 'linkedin') {
      textToCopy = `${post.linkedInPost}\n\n${post.hashtags.join(' ')}`;
    } else {
      textToCopy = `${post.instagramCaption}\n\n${post.hashtags.join(' ')}`;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}

