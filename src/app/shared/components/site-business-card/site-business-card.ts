import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {SeoCardService, SharePayload} from '../../../core/services/seo-card.service';

@Component({
  selector: 'app-site-business-card',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (seoCard.isBusinessCardOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#020817]/80 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="YENİDEM Resmi Dijital Kartviziti ve Paylaşım Stüdyosu"
      >
        <button
          type="button"
          (click)="seoCard.closeBusinessCard()"
          class="fixed inset-0 w-full h-full border-0 p-0 cursor-default"
          aria-label="Kapat"
        ></button>

        <div class="relative z-10 w-full max-w-3xl rounded-3xl bg-glass-blue border border-sky-300/45 shadow-[0_25px_75px_rgba(2,8,23,0.95)] overflow-hidden my-auto">
          <!-- Top Bar -->
          <div class="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#071938] via-[#0d2b5e] to-[#071938] border-b border-sky-300/30 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/50 flex items-center justify-center">
                <mat-icon class="!w-5 !h-5 !text-xl icon-luminous-amber">badge</mat-icon>
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-serif font-bold text-white">
                  YENİDEM — Resmi Site Dijital Kartviziti
                </h2>
                <p class="text-xs text-sky-200/90">
                  Site adresini paylaştığınızda yayınlanan OpenGraph kimliği ve indirilebilir HD kartvizit
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="seoCard.closeBusinessCard()"
              class="luxury-icon-btn !w-9 !h-9"
              title="Kapat"
            >
              <mat-icon class="!w-4 !h-4 !text-base">close</mat-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 sm:p-6 space-y-6 max-h-[82vh] overflow-y-auto custom-scrollbar">
            <!-- Live Interactive Digital Business Card Preview -->
            <div class="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-[#061531] via-[#0b2554] to-[#12387a] border-2 border-amber-300/55 shadow-[0_20px_50px_rgba(2,8,23,0.85),inset_0_-24px_44px_rgba(56,189,248,0.22)] space-y-5">
              <div class="flex flex-wrap items-start justify-between gap-4 border-b border-sky-300/25 pb-4">
                <div class="flex items-center gap-3.5">
                  <div class="w-15 h-15 rounded-full p-0.5 bg-gradient-to-br from-cyan-300/70 via-sky-500/50 to-blue-800/70 flex items-center justify-center shadow-[0_0_24px_rgba(56,189,248,0.5)] shrink-0 overflow-hidden">
                    <img
                      src="/logo.svg"
                      alt="YENİDEM Resmi Logosu"
                      class="w-14 h-14 object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                        RESMİ AKADEMİK KÜRSÜ KARTVİZİTİ
                      </span>
                      <span class="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono text-emerald-200 flex items-center gap-1">
                        <mat-icon class="!w-3 !h-3 !text-[11px]">verified</mat-icon>
                        SHA-512 Tescilli
                      </span>
                    </div>
                    <h3 class="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-0.5">
                      YENİDEM — Orçun KUNDAKCI
                    </h3>
                    <p class="text-xs sm:text-sm text-sky-200 font-medium">
                      Edebiyat, Felsefe ve Tefekkür Mecmuası · AÖF Türk Dili ve Edebiyatı & Felsefe
                    </p>
                  </div>
                </div>

                <div class="px-3 py-1.5 rounded-xl bg-[#051026]/90 border border-sky-300/35 text-right">
                  <div class="text-[10px] font-mono text-sky-300 uppercase">Külliyat Kapsamı</div>
                  <div class="text-xs font-serif font-bold text-amber-300">12 Makale · 7 Ulu Ozan · 40 Makam</div>
                </div>
              </div>

              <!-- Central Motto -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div class="p-3.5 rounded-2xl bg-[#05122b]/80 border border-sky-300/25 space-y-1">
                  <div class="text-[11px] font-serif font-bold text-cyan-300 flex items-center gap-1.5">
                    <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">school</mat-icon>
                    <span>Cumhuriyet & İlim Rehberi</span>
                  </div>
                  <p class="text-xs font-serif italic text-stone-100">
                    “Hayatta en hakiki mürşit ilimdir, fendir.” — Gazi Mustafa Kemal Atatürk
                  </p>
                </div>

                <div class="p-3.5 rounded-2xl bg-[#05122b]/80 border border-amber-300/25 space-y-1">
                  <div class="text-[11px] font-serif font-bold text-amber-300 flex items-center gap-1.5">
                    <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">auto_awesome</mat-icon>
                    <span>Anadolu İrfan Rehberi</span>
                  </div>
                  <p class="text-xs font-serif italic text-amber-100">
                    “İlimden gidilmeyen yolun sonu karanlıktır.” — Hünkâr Hacı Bektâş-ı Velî
                  </p>
                </div>
              </div>

              <!-- Bottom URL & Seal Strip -->
              <div class="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-sky-200">
                <div class="flex items-center gap-2 font-mono text-xs bg-[#040d20]/90 px-3.5 py-2 rounded-xl border border-sky-300/30 text-cyan-200 truncate max-w-full">
                  <mat-icon class="!w-4 !h-4 !text-sm icon-luminous shrink-0">link</mat-icon>
                  <span class="truncate">{{ seoCard.getOriginUrl() }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    (click)="copyLink()"
                    class="nav-pill-btn !h-9 !px-3.5 text-xs"
                  >
                    <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">
                      {{ linkCopied() ? 'check' : 'content_copy' }}
                    </mat-icon>
                    <span>{{ linkCopied() ? 'Adres Kopyalandı!' : 'Site Adresini Kopyala' }}</span>
                  </button>

                  <button
                    type="button"
                    (click)="downloadBusinessCardPng()"
                    class="luxury-btn-primary !h-9 !px-4 text-xs"
                  >
                    <mat-icon class="!w-4 !h-4 !text-sm">download</mat-icon>
                    <span>HD Kartvizit İndir (.PNG)</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Hidden High-Resolution Canvas for PNG Business Card Export -->
            <canvas #cardCanvas width="1200" height="630" class="hidden"></canvas>

            <!-- Direct Social Network Share Grid -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs sm:text-sm font-serif font-bold text-amber-300 flex items-center gap-1.5">
                  <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">share</mat-icon>
                  <span>Site Kartvizitini Sosyal Ağlarda Tek Tıkla Yayınla</span>
                </h4>
                <span class="text-[11px] text-sky-200/80">OpenGraph önizleme kartı otomatik görünür</span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <a
                  [href]="seoCard.getWhatsAppShareUrl(sitePayload)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="nav-pill-btn !h-10 justify-center !border-emerald-400/40 hover:!border-emerald-300"
                >
                  <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">chat</mat-icon>
                  <span>WhatsApp</span>
                </a>

                <a
                  [href]="seoCard.getXShareUrl(sitePayload)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="nav-pill-btn !h-10 justify-center !border-sky-400/40 hover:!border-sky-300"
                >
                  <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">campaign</mat-icon>
                  <span>X (Twitter)</span>
                </a>

                <a
                  [href]="seoCard.getLinkedInShareUrl(sitePayload)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="nav-pill-btn !h-10 justify-center !border-blue-400/40 hover:!border-blue-300"
                >
                  <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">work</mat-icon>
                  <span>LinkedIn</span>
                </a>

                <a
                  [href]="seoCard.getTelegramShareUrl(sitePayload)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="nav-pill-btn !h-10 justify-center !border-cyan-400/40 hover:!border-cyan-300"
                >
                  <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">send</mat-icon>
                  <span>Telegram</span>
                </a>

                <button
                  type="button"
                  (click)="copyFullCardText()"
                  class="nav-pill-btn !h-10 justify-center col-span-2 sm:col-span-1 !border-amber-400/50"
                >
                  <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">
                    {{ textCopied() ? 'check' : 'assignment' }}
                  </mat-icon>
                  <span>{{ textCopied() ? 'Kopyalandı!' : 'Kart Metni' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class SiteBusinessCardComponent implements AfterViewInit {
  readonly seoCard = inject(SeoCardService);
  readonly cardCanvas = viewChild<ElementRef<HTMLCanvasElement>>('cardCanvas');

  readonly linkCopied = signal<boolean>(false);
  readonly textCopied = signal<boolean>(false);

  readonly sitePayload: SharePayload = {
    title: 'YENİDEM — Edebiyat, Felsefe ve Tefekkür Mecmuası | Orçun KUNDAKCI',
    subtitle: 'Cumhuriyet Aydınlanması ve Anadolu İrfan Kürsüsü',
    quote: 'Hayatta en hakiki mürşit ilimdir, fendir. · İlimden gidilmeyen yolun sonu karanlıktır.',
    summary:
      'Orçun Kundakcı Akademik Külliyatı: Türk Dili ve Edebiyatı ile Felsefe disiplinlerinde SHA-512 mühürlü akademik makaleler, beyit şerhleri, Yedi Ulu Ozan ve Dört Kapı Kırk Makam Atlası.',
    hashtags: ['#YENİDEM', '#OrçunKundakcı', '#Edebiyat', '#Felsefe', '#Anadoluİrfanı'],
  };

  constructor() {
    effect(() => {
      if (this.seoCard.isBusinessCardOpen()) {
        setTimeout(() => this.drawCanvasCard(), 50);
      }
    });
  }

  ngAfterViewInit(): void {
    this.drawCanvasCard();
  }

  async copyLink(): Promise<void> {
    await this.seoCard.copyDirectLink();
    this.linkCopied.set(true);
    setTimeout(() => this.linkCopied.set(false), 2200);
  }

  async copyFullCardText(): Promise<void> {
    await this.seoCard.copyShareCardText(this.sitePayload);
    this.textCopied.set(true);
    setTimeout(() => this.textCopied.set(false), 2200);
  }

  downloadBusinessCardPng(): void {
    this.drawCanvasCard();
    const canvas = this.cardCanvas()?.nativeElement;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'yenidem-orcun-kundakci-kartvizit.png';
    a.click();
  }

  private drawCanvasCard(): void {
    const canvas = this.cardCanvas()?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1200;
    const h = 630;

    // Sapphire & Horizon Cloud Background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#040d1f');
    grad.addColorStop(0.5, '#092047');
    grad.addColorStop(1, '#12387a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Bottom cloud glow
    const glow = ctx.createRadialGradient(w / 2, h, 30, w / 2, h, 520);
    glow.addColorStop(0, 'rgba(125, 211, 252, 0.28)');
    glow.addColorStop(1, 'rgba(125, 211, 252, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Gold outer frame
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    // Badge
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('YENİDEM • AKADEMİK EDEBİYAT VE FELSEFE KÜRSÜSÜ', 80, 105);

    // Main Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px Georgia, serif';
    ctx.fillText('Orçun KUNDAKCI Akademik Külliyatı', 80, 180);

    // Subtitle
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '28px sans-serif';
    ctx.fillText('Türk Dili ve Edebiyatı • Felsefe • Cumhuriyet ve Anadolu İrfanı', 80, 230);

    // Divider
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 265);
    ctx.lineTo(w - 80, 265);
    ctx.stroke();

    // Quotes
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'italic 26px Georgia, serif';
    ctx.fillText('“Hayatta en hakiki mürşit ilimdir, fendir.” — Gazi Mustafa Kemal Atatürk', 80, 330);
    ctx.fillText('“İlimden gidilmeyen yolun sonu karanlıktır.” — Hünkâr Hacı Bektâş-ı Velî', 80, 385);

    // Summary line
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '22px sans-serif';
    ctx.fillText(
      '12 Akademik Makale • Aruz & Hece Laboratuvarı • Yedi Ulu Ozan • Dört Kapı Kırk Makam',
      80,
      465
    );

    // Footer URL & SHA-512 Seal
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(this.seoCard.getOriginUrl(), 80, 545);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('✓ SHA-512 KRİPTOGRAFİK MÜHÜRLÜ KÜLLİYAT', w - 540, 545);
  }
}
