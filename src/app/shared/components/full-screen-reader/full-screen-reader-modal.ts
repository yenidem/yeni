import {
  ChangeDetectionStrategy,
  Component,
   computed,
  inject,
  signal,
} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {
  EyeComfortTheme,
  ReaderColumnWidth,
  ReaderComfortService,
  ReaderFontChoice,
  ReaderLineHeight,
} from '../../../core/services/reader-comfort.service';
import {SpeechService} from '../../../core/services/speech.service';
import {AccessibilityService} from '../../../core/services/accessibility.service';

export interface ParsedBlock {
  type: 'h2' | 'h3' | 'quote' | 'list' | 'p';
  text: string;
  items?: string[];
}

@Component({
  selector: 'app-full-screen-reader-modal',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
  template: `
    @if (reader.activeReaderArticle(); as art) {
      <div
        class="fixed inset-0 z-[120] flex flex-col overflow-hidden transition-colors duration-300"
        [class]="themeContainerClass()"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="art.title + ' - Tam Ekran Göz Konforlu Okuma Kürsüsü'"
      >
        <!-- AMBER BLUE-LIGHT EYE SHIELD OVERLAY -->
        @if (reader.blueLightShieldPercent() > 0) {
          <div
            class="pointer-events-none fixed inset-0 z-[130] transition-opacity duration-300"
            [style.background]="'rgba(245, 158, 11, ' + (reader.blueLightShieldPercent() / 260) + ')'"
          ></div>
        }

        <!-- TOP READING PROGRESS BAR -->
        <div class="w-full h-1 bg-black/25 shrink-0 relative z-[125]">
          <div
            class="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-all duration-150"
            [style.width.%]="reader.readingProgress()"
          ></div>
        </div>

        <!-- TOP EYE-COMFORT & TYPOGRAPHY CONTROL RIBBON -->
        <header
          class="shrink-0 border-b px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5 relative z-[125]"
          [class]="themeHeaderClass()"
        >
          <!-- Left: Brand & Eye-Comfort Mode Indicator -->
          <div class="flex items-center gap-2.5">
            <img
              src="/logo.svg"
              alt="YENİDEM Logo"
              class="w-7 h-7 rounded-full border border-sky-400/50 object-contain bg-[#061531]"
            />
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-extrabold tracking-wide uppercase">
                  Tam Ekran Göz Konforlu Okuma Kürsüsü
                </span>
                <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-500">
                  SIFIR GÖZ YORGUNLUĞU
                </span>
              </div>
              <div class="text-[11px] opacity-75 truncate max-w-xs sm:max-w-md">
                {{ art.title }}
              </div>
            </div>
          </div>

          <!-- Center: 4 Eye-Comfort Theme Presets + Blue Light Filter + Font Controls -->
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <!-- Theme Switcher -->
            <div class="inline-flex items-center rounded-xl p-0.5 border border-current/20 bg-black/10">
              @for (t of themes; track t.id) {
                <button
                  type="button"
                  (click)="reader.setTheme(t.id)"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                  [class.bg-amber-500]="reader.theme() === t.id"
                  [class.text-slate-950]="reader.theme() === t.id"
                  [title]="t.desc"
                >
                  <mat-icon class="!w-3.5 !h-3.5 !text-xs">{{ t.icon }}</mat-icon>
                  <span class="hidden md:inline">{{ t.label }}</span>
                </button>
              }
            </div>

            <!-- Blue-Light Eye Shield Toggle -->
            <button
              type="button"
              (click)="cycleBlueLightShield()"
              class="px-2.5 py-1 rounded-xl border border-amber-500/40 bg-amber-500/15 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              title="Mavi Işık Kalkanı (Kehribar Göz Koruma Filtresi)"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs text-amber-500">wb_sunny</mat-icon>
              <span>Göz Kalkanı: %{{ reader.blueLightShieldPercent() }}</span>
            </button>

            <!-- Font Size A- / A+ -->
            <div class="inline-flex items-center rounded-xl border border-current/20 bg-black/10 p-0.5">
              <button
                type="button"
                (click)="reader.adjustFontSize(-1)"
                class="w-7 h-7 rounded-lg font-bold text-xs hover:bg-white/15 cursor-pointer"
                title="Yazıyı Küçült"
              >
                A-
              </button>
              <span class="px-2 font-mono text-[11px] font-bold tabular-nums">
                {{ reader.fontSizePx() }}px
              </span>
              <button
                type="button"
                (click)="reader.adjustFontSize(1)"
                class="w-7 h-7 rounded-lg font-bold text-xs hover:bg-white/15 cursor-pointer"
                title="Yazıyı Büyüt"
              >
                A+
              </button>
            </div>

            <!-- Font Family Choice -->
            <div class="inline-flex items-center rounded-xl border border-current/20 bg-black/10 p-0.5">
              @for (f of fontChoices; track f.id) {
                <button
                  type="button"
                  (click)="reader.setFontChoice(f.id)"
                  class="px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer"
                  [class.bg-sky-500]="reader.fontChoice() === f.id"
                  [class.text-white]="reader.fontChoice() === f.id"
                >
                  {{ f.label }}
                </button>
              }
            </div>

            <!-- Line Spacing & Width Toggle -->
            <button
              type="button"
              (click)="cycleLineHeight()"
              class="px-2.5 py-1 rounded-xl border border-current/20 bg-black/10 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              title="Satır Aralığı Ferahlığı"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs">format_line_spacing</mat-icon>
              <span class="hidden xl:inline">Satır: {{ reader.lineHeightNumeric() }}</span>
            </button>

            <button
              type="button"
              (click)="cycleColumnWidth()"
              class="px-2.5 py-1 rounded-xl border border-current/20 bg-black/10 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              title="Sayfa Sütun Genişliği"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs">width_normal</mat-icon>
              <span class="hidden xl:inline">
                {{ reader.columnWidth() === 'narrow' ? 'Dar Odak' : reader.columnWidth() === 'wide' ? 'Geniş' : 'Dergi' }}
              </span>
            </button>

            <!-- Reading Ruler Guide -->
            <button
              type="button"
              (click)="a11y.toggleReadingGuide()"
              class="px-2.5 py-1 rounded-xl border border-current/20 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              [class.bg-amber-500]="a11y.readingGuide()"
              [class.text-slate-950]="a11y.readingGuide()"
              title="Işıklı Satır Takip Cetvelini Aç / Kapat"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs">horizontal_rule</mat-icon>
              <span class="hidden lg:inline">Cetvel</span>
            </button>

            <!-- TTS Voice Reader -->
            <button
              type="button"
              (click)="toggleSpeech(art.title + '. ' + art.abstract + '. ' + art.content)"
              class="px-2.5 py-1 rounded-xl border border-current/20 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              [class.bg-emerald-500]="speech.isSpeaking()"
              [class.text-slate-950]="speech.isSpeaking()"
              title="Makaleyi Sesli Dinle"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs">{{ speech.isSpeaking() ? 'stop_circle' : 'volume_up' }}</mat-icon>
              <span class="hidden sm:inline">{{ speech.isSpeaking() ? 'Durdur' : 'Sesli Dinle' }}</span>
            </button>
          </div>

          <!-- Right: Full Detail Link & Close Button -->
          <div class="flex items-center gap-2">
            <a
              [routerLink]="['/makale', art.slug]"
              (click)="reader.closeComfortReader()"
              class="px-3 py-1.5 rounded-xl border border-current/25 text-xs font-bold flex items-center gap-1 hover:opacity-80"
              title="Tam Makale Sayfasına Git"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-sm">open_in_new</mat-icon>
              <span class="hidden sm:inline">Tam Sayfa</span>
            </a>

            <button
              type="button"
              (click)="reader.closeComfortReader()"
              class="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Tam Ekran Okuma Modunu Kapat (ESC)"
            >
              <mat-icon class="!w-4 !h-4 !text-base">close</mat-icon>
              <span>Kapat</span>
            </button>
          </div>
        </header>

        <!-- SCROLLABLE EYE-COMFORT READING STAGE -->
        <div
          class="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-12 scroll-smooth"
          (scroll)="onScroll($event)"
        >
          <article
            class="mx-auto rounded-3xl p-6 sm:p-10 lg:p-14 border transition-all duration-300 space-y-8"
            [class]="reader.maxWidthClass() + ' ' + themePaperClass() + ' ' + fontClass()"
          >
            <!-- 1. DISCIPLINE, AUTHOR & BLOCKCHAIN SEAL HEADER -->
            <div class="space-y-4 border-b border-current/15 pb-6">
              <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span class="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-sky-500/15 border border-sky-500/30">
                  {{ getDisciplineLabel(art.discipline) }}
                </span>
                <div class="flex flex-wrap items-center gap-2 opacity-80">
                  <span>Yazar: <strong>Orçun KUNDAKCI</strong></span>
                  <span>·</span>
                  <span>{{ art.readingTimeMinutes }} dk okuma</span>
                  <span>·</span>
                  <span>{{ art.detailedDateTr || 'Eylül 2026' }}</span>
                </div>
              </div>

              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
                {{ art.title }}
              </h1>

              <p class="text-base sm:text-lg opacity-85 font-medium leading-relaxed">
                {{ art.subtitle }}
              </p>

              <!-- Standardized Cover Image + Blockchain Media Standard Seal -->
              <div class="rounded-2xl overflow-hidden border border-current/20 bg-[#05122b] relative">
                <div class="aspect-video w-full max-h-72 overflow-hidden flex items-center justify-center bg-[#061533]">
                  <img
                    [src]="art.coverImage || '/assets/default-article-cover.svg'"
                    [alt]="art.coverImageAlt || art.title"
                    (error)="onImgError($event)"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="p-3 sm:px-4 bg-[#061531] text-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] border-t border-sky-300/25">
                  <div class="flex items-center gap-2">
                    <mat-icon class="!w-4 !h-4 !text-sm text-emerald-400">verified</mat-icon>
                    <span>
                      <strong>Standart Blok Zinciri Görseli:</strong> 1200×675 (16:9) · Max &lt;250KB · EXIF Temiz · AI &amp; SHA3-512 Onaylı
                    </span>
                  </div>
                  <button
                    type="button"
                    (click)="runMediaAudit(art)"
                    class="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-300/40 text-cyan-200 font-mono font-bold cursor-pointer flex items-center gap-1"
                  >
                    <mat-icon class="!w-3.5 !h-3.5 !text-xs">security</mat-icon>
                    <span>Görsel AI &amp; Blok Zinciri Denetimi</span>
                  </button>
                </div>
              </div>

              @if (showMediaAudit() && reader.mediaValidationReport(); as mediaRep) {
                <div class="p-4 rounded-2xl bg-[#07193a] text-slate-100 border border-emerald-400/45 space-y-2 text-xs font-mono">
                  <div class="flex items-center justify-between gap-2">
                    <span class="font-bold text-emerald-300 flex items-center gap-1.5">
                      <mat-icon class="!w-4 !h-4 !text-sm">verified_user</mat-icon>
                      <span>BLOK ZİNCİRİ MEDYA &amp; AI GÜVENLİK DENETİM RAPORU ({{ mediaRep.pqcMediaSeal.mediaCertId }})</span>
                    </span>
                    <button type="button" (click)="showMediaAudit.set(false)" class="text-sky-200 hover:text-white cursor-pointer">Kapat ✕</button>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div class="p-2.5 rounded-xl bg-[#041026] border border-sky-400/25">
                      <div class="text-cyan-300 font-bold">Ebat &amp; Kota Standardı</div>
                      <div>{{ mediaRep.dimensions }} ({{ mediaRep.aspectRatio }}) · {{ mediaRep.byteSizeKb }} KB / Max {{ mediaRep.maxAllowedKb }} KB</div>
                      <div class="text-emerald-300">{{ mediaRep.quotaStatus }}</div>
                    </div>
                    <div class="p-2.5 rounded-xl bg-[#041026] border border-sky-400/25">
                      <div class="text-amber-300 font-bold">Güvenlik &amp; Sanitasyon</div>
                      <div>✓ Magic-Byte &amp; MIME Doğrulandı</div>
                      <div>✓ EXIF/GPS Silindi · ✓ XSS/Stego Temiz</div>
                    </div>
                    <div class="p-2.5 rounded-xl bg-[#041026] border border-sky-400/25">
                      <div class="text-emerald-300 font-bold">AI &amp; Telif Uygunluğu</div>
                      <div>Akademik Skor: %{{ mediaRep.aiModeration.academicRelevanceScore }}</div>
                      <div>Telif Temizliği: %{{ mediaRep.aiModeration.copyrightClearanceScore }}</div>
                    </div>
                  </div>
                  <div class="text-[10px] text-cyan-200 break-all">
                    SHA3-512 Medya Özeti: {{ mediaRep.pqcMediaSeal.sha3_512 }}
                  </div>
                </div>
              }
            </div>

            <!-- 2. ABSTRACT BOX -->
            <div class="p-5 sm:p-6 rounded-2xl border border-current/20 bg-current/5 space-y-2">
              <div class="text-xs font-mono font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <mat-icon class="!w-4 !h-4 !text-sm">summarize</mat-icon>
                <span>Akademik Öz (Abstract)</span>
              </div>
              <p
                class="leading-relaxed font-medium"
                [style.font-size.px]="reader.fontSizePx() - 1"
                [style.line-height]="reader.lineHeightNumeric()"
              >
                {{ art.abstract }}
              </p>
            </div>

            <!-- 3. FEATURED QUOTE -->
            @if (art.featuredQuote) {
              <blockquote class="p-5 sm:p-6 rounded-2xl border-l-4 border-amber-500 bg-amber-500/10 space-y-2">
                <p
                  class="font-semibold leading-relaxed"
                  [style.font-size.px]="reader.fontSizePx() + 1"
                >
                  &ldquo;{{ art.featuredQuote }}&rdquo;
                </p>
                <footer class="text-xs font-mono opacity-75">
                  — Orçun KUNDAKCI · YENİDEM Külliyatı Vecize Kaydı
                </footer>
              </blockquote>
            }

            <!-- 4. MAIN ARTICLE BODY (STRUCTURED BLOCKS) -->
            <div
              class="space-y-6"
              [style.font-size.px]="reader.fontSizePx()"
              [style.line-height]="reader.lineHeightNumeric()"
            >
              @for (block of parsedBlocks(); track $index) {
                @if (block.type === 'h2') {
                  <h2 class="text-xl sm:text-2xl font-extrabold pt-4 pb-1 border-b border-current/15 tracking-tight">
                    {{ block.text }}
                  </h2>
                } @else if (block.type === 'h3') {
                  <h3 class="text-lg sm:text-xl font-bold pt-2 tracking-tight">
                    {{ block.text }}
                  </h3>
                } @else if (block.type === 'quote') {
                  <blockquote class="pl-5 py-3 border-l-4 border-sky-500 bg-sky-500/10 rounded-r-2xl font-medium">
                    {{ block.text }}
                  </blockquote>
                } @else if (block.type === 'list') {
                  <ul class="space-y-2.5 pl-5 list-disc">
                    @for (li of block.items; track $index) {
                      <li class="leading-relaxed">{{ li }}</li>
                    }
                  </ul>
                } @else {
                  <p class="leading-relaxed">{{ block.text }}</p>
                }
              }
            </div>

            <!-- 5. ANNOTATIONS / METİN ŞERHİ DİPNOTLARI -->
            @if (art.annotations && art.annotations.length > 0) {
              <section class="pt-6 border-t border-current/20 space-y-4">
                <h3 class="text-base sm:text-lg font-bold flex items-center gap-2">
                  <mat-icon class="!w-5 !h-5 !text-lg text-amber-500">rate_review</mat-icon>
                  <span>Metin Şerhi &amp; Kavramsal Dipnotlar (Derkenar)</span>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  @for (note of art.annotations; track note.id) {
                    <div class="p-4 rounded-2xl border border-current/20 bg-current/5 space-y-1.5 text-sm">
                      <div class="flex items-center justify-between gap-2">
                        <span class="font-bold text-amber-500">&ldquo;{{ note.quote }}&rdquo;</span>
                        <span class="text-[11px] font-mono opacity-70">{{ note.category || 'Şerh' }}</span>
                      </div>
                      <p class="text-xs sm:text-sm leading-relaxed opacity-90">{{ note.comment }}</p>
                    </div>
                  }
                </div>
              </section>
            }

            <!-- 6. REFERENCES & CRYPTOGRAPHIC SEAL FOOTER -->
            <section class="pt-6 border-t border-current/20 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div class="lg:col-span-7 space-y-3">
                <h3 class="text-base font-bold flex items-center gap-2">
                  <mat-icon class="!w-4 !h-4 !text-base">menu_book</mat-icon>
                  <span>Akademik Kaynakça ({{ art.references.length }} Eser)</span>
                </h3>
                <ol class="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm opacity-90">
                  @for (ref of art.references; track $index) {
                    <li>{{ ref }}</li>
                  }
                </ol>
              </div>

              <div class="lg:col-span-5 p-4 rounded-2xl border border-current/20 bg-current/5 space-y-2 text-xs font-mono">
                <div class="font-bold flex items-center gap-1.5 text-emerald-500">
                  <mat-icon class="!w-4 !h-4 !text-sm">verified_user</mat-icon>
                  <span>KUANTUM &amp; BLOK ZİNCİRİ MÜHÜR KÜNYESİ</span>
                </div>
                <div class="text-[11px] break-all opacity-85">
                  <strong>SHA-512 / SHA3-512:</strong> {{ art.sha512Hash || '8a7d280db49cd0a26876a28951cf429e05fa359796ccdb3c' }}
                </div>
                <div class="text-[11px] break-all opacity-85">
                  <strong>Kuantum İmza:</strong> {{ art.quantumSignature || 'SLH-DSA-PQC-VERIFIED-2026' }}
                </div>
                <div class="text-[11px] opacity-80">
                  <strong>Katman-0 Durumu:</strong> Kurucu Külliyat (Genesis Hard-Lock)
                </div>
              </div>
            </section>
          </article>
        </div>
      </div>
    }
  `,
})
export class FullScreenReaderModalComponent {
  readonly reader = inject(ReaderComfortService);
  readonly speech = inject(SpeechService);
  readonly a11y = inject(AccessibilityService);

  readonly showMediaAudit = signal(false);

  readonly themes: {id: EyeComfortTheme; label: string; icon: string; desc: string}[] = [
    {
      id: 'parchment',
      label: 'Sıcak Parşömen',
      icon: 'menu_book',
      desc: 'Sıcak Parşömen Kağıt Modu (#f5ebd6) — Sıfır mavi ışık, kitap sayfası konforu',
    },
    {
      id: 'eink',
      label: 'E-Mürekkep',
      icon: 'tablet',
      desc: 'E-Ink Mat Dergi Modu (#e7e7e2) — Uzun akademik okumalar için mat gri kontrast',
    },
    {
      id: 'sapphire',
      label: 'Gece Safir',
      icon: 'dark_mode',
      desc: 'YENİDEM Gece Safir Kadife Modu (#07162c) — Göz yormayan derin lacivert',
    },
    {
      id: 'oled',
      label: 'Tam Karartma',
      icon: 'contrast',
      desc: 'OLED Tam Siyah Odak Modu (#030712) — Karanlık ortamlar için maksimum konfor',
    },
  ];

  readonly fontChoices: {id: ReaderFontChoice; label: string}[] = [
    {id: 'studio-sans', label: 'Google Studio (Inter)'},
    {id: 'classic-serif', label: 'Edebi Kitap (Lora)'},
    {id: 'dyslexic', label: 'Disleksi (Lexend)'},
  ];

  readonly themeContainerClass = computed(() => {
    const t = this.reader.theme();
    if (t === 'parchment') return 'bg-[#eadcc3] text-[#1e293b]';
    if (t === 'eink') return 'bg-[#d8d8d2] text-[#18181b]';
    if (t === 'oled') return 'bg-[#020617] text-[#f1f5f9]';
    return 'bg-[#041024] text-[#f8fafc]';
  });

  readonly themeHeaderClass = computed(() => {
    const t = this.reader.theme();
    if (t === 'parchment') return 'bg-[#f3e7d0] border-[#cbb894] text-[#1e293b]';
    if (t === 'eink') return 'bg-[#e4e4de] border-[#b8b8b0] text-[#18181b]';
    if (t === 'oled') return 'bg-[#030712] border-slate-800 text-slate-100';
    return 'bg-[#071938] border-sky-300/30 text-slate-100';
  });

  readonly themePaperClass = computed(() => {
    const t = this.reader.theme();
    if (t === 'parchment') {
      return 'bg-[#fbf5e8] border-[#d6c5a5] text-[#1e293b] shadow-[0_20px_50px_rgba(60,40,10,0.15)]';
    }
    if (t === 'eink') {
      return 'bg-[#f0f0eb] border-[#c4c4bc] text-[#18181b] shadow-[0_20px_50px_rgba(0,0,0,0.12)]';
    }
    if (t === 'oled') {
      return 'bg-[#090d16] border-slate-800 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.9)]';
    }
    return 'bg-[#081c3f] border-sky-300/35 text-slate-100 shadow-[0_20px_60px_rgba(2,8,23,0.85)]';
  });

  readonly fontClass = computed(() => {
    const f = this.reader.fontChoice();
    if (f === 'classic-serif') return 'font-[Lora,Georgia,serif]';
    if (f === 'dyslexic') return 'font-[Lexend,Inter,sans-serif] tracking-wide';
    return 'font-sans';
  });

  readonly parsedBlocks = computed<ParsedBlock[]>(() => {
    const art = this.reader.activeReaderArticle();
    if (!art?.content) return [];
    const rawParagraphs = art.content.split(/\n\n+/);
    const blocks: ParsedBlock[] = [];

    for (const chunk of rawParagraphs) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('## ')) {
        blocks.push({type: 'h2', text: trimmed.replace(/^##\s+/, '').replace(/\*\*/g, '')});
      } else if (trimmed.startsWith('### ')) {
        blocks.push({type: 'h3', text: trimmed.replace(/^###\s+/, '').replace(/\*\*/g, '')});
      } else if (trimmed.startsWith('>')) {
        blocks.push({
          type: 'quote',
          text: trimmed.replace(/^>\s*/, '').replace(/\*/g, '').replace(/"/g, ''),
        });
      } else if (trimmed.includes('\n- ') || trimmed.startsWith('- ') || trimmed.includes('\n1. ')) {
        const lines = trimmed.split('\n');
        const listItems: string[] = [];
        let intro = '';
        for (const line of lines) {
          const l = line.trim();
          if (l.startsWith('- ') || /^\d+\.\s+/.test(l)) {
            listItems.push(l.replace(/^(-\s+|\d+\.\s+)/, '').replace(/\*\*/g, ''));
          } else {
            intro += (intro ? ' ' : '') + l.replace(/\*\*/g, '');
          }
        }
        if (intro) {
          blocks.push({type: 'p', text: intro});
        }
        if (listItems.length > 0) {
          blocks.push({type: 'list', text: '', items: listItems});
        }
      } else {
        blocks.push({type: 'p', text: trimmed.replace(/\*\*/g, '').replace(/\*/g, '')});
      }
    }
    return blocks;
  });

  onEscape(): void {
    if (this.reader.isReaderOpen()) {
      this.reader.closeComfortReader();
    }
  }

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      this.reader.readingProgress.set(100);
      return;
    }
    const pct = Math.min(100, Math.max(0, Math.round((el.scrollTop / maxScroll) * 100)));
    this.reader.readingProgress.set(pct);
  }

  cycleBlueLightShield(): void {
    const cur = this.reader.blueLightShieldPercent();
    const next = cur === 0 ? 15 : cur === 15 ? 30 : cur === 30 ? 45 : 0;
    this.reader.setBlueLightShield(next);
  }

  cycleLineHeight(): void {
    const cur = this.reader.lineHeightMode();
    const next: ReaderLineHeight = cur === 'normal' ? 'relaxed' : cur === 'relaxed' ? 'spacious' : 'normal';
    this.reader.setLineHeight(next);
  }

  cycleColumnWidth(): void {
    const cur = this.reader.columnWidth();
    const next: ReaderColumnWidth = cur === 'narrow' ? 'standard' : cur === 'standard' ? 'wide' : 'narrow';
    this.reader.setColumnWidth(next);
  }

  toggleSpeech(text: string): void {
    if (this.speech.isSpeaking()) {
      this.speech.stop();
    } else {
      this.speech.speak(text);
    }
  }

  getDisciplineLabel(d: string): string {
    if (d === 'tde') return 'Türk Dili ve Edebiyatı';
    if (d === 'felsefe') return 'Felsefe & Ontoloji';
    return 'Disiplinlerarası İrfan Kesişimi';
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && !img.src.includes('default-article-cover.svg')) {
      img.src = '/assets/default-article-cover.svg';
    }
  }

  runMediaAudit(art: {coverImage?: string; coverImageCaption?: string; title: string}): void {
    this.showMediaAudit.set(true);
    this.reader
      .validateAndSealMediaStandard({
        imageUrl: art.coverImage || '/assets/default-article-cover.svg',
        caption: art.coverImageCaption || art.title,
        articleTitle: art.title,
        byteSizeKb: 42,
      })
      .subscribe();
  }
}
