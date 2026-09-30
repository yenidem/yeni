import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {
  AccessibilityService,
  ContrastMode,
  FontFamilyMode,
  FontScaleLevel,
} from '../../../core/services/accessibility.service';

@Component({
  selector: 'app-accessibility-bar',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:mousemove)': 'onMouseMove($event)',
  },
  template: `
    <!-- Optional Horizontal Reading Focus Guide Line -->
    @if (a11y.readingGuide()) {
      <div
        class="fixed left-0 right-0 h-9 pointer-events-none z-40 border-y border-amber-300/65 bg-sky-300/10 shadow-[0_0_24px_rgba(56,189,248,0.25)] transition-transform duration-75"
        [style.top.px]="a11y.guideY() - 18"
        aria-hidden="true"
      ></div>
    }

    <!-- Accessibility Settings Popover / Modal -->
    @if (a11y.isPanelOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-[#020817]/75 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Okunurluk, Yazı Tipi ve Erişilebilirlik Ayarları"
      >
        <button
          type="button"
          (click)="a11y.closePanel()"
          class="fixed inset-0 w-full h-full border-0 p-0 cursor-default"
          aria-label="Kapat"
        ></button>

        <div class="relative z-10 w-full max-w-xl rounded-3xl bg-glass-blue border border-sky-300/45 shadow-[0_25px_70px_rgba(2,8,23,0.92)] overflow-hidden my-auto">
          <!-- Header -->
          <div class="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#071938] via-[#0d2b5e] to-[#071938] border-b border-sky-300/30 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-300/45 flex items-center justify-center">
                <mat-icon class="!w-5 !h-5 !text-xl icon-luminous">accessibility_new</mat-icon>
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-serif font-bold text-white">
                  Okunurluk, Tipografi ve Erişilebilirlik Kürsüsü
                </h2>
                <p class="text-xs text-sky-200/90">
                  Yuvarlak hatlı modern yazı tipi, harf büyüklüğü ve göz dinlendirici okuma modları
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="a11y.closePanel()"
              class="luxury-icon-btn !w-9 !h-9"
              title="Kapat"
            >
              <mat-icon class="!w-4 !h-4 !text-base">close</mat-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
            <!-- 1. Font Scale (Yazı Boyutu Büyütme / Küçültme) -->
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="font-serif font-bold text-amber-300 flex items-center gap-1.5">
                  <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">format_size</mat-icon>
                  <span>1. Genel Yazı Boyutu (Tüm Cihazlar İçin Ölçekleme)</span>
                </span>
                <span class="font-mono text-xs text-cyan-200 font-bold">{{ a11y.fontScaleLabel() }}</span>
              </div>

              <div class="grid grid-cols-5 gap-2">
                @for (scale of scales; track scale.id) {
                  <button
                    type="button"
                    (click)="a11y.setFontScale(scale.id)"
                    class="py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
                    [class.bg-amber-400]="a11y.fontScale() === scale.id"
                    [class.text-stone-950]="a11y.fontScale() === scale.id"
                    [class.border-amber-200]="a11y.fontScale() === scale.id"
                    [class.font-bold]="a11y.fontScale() === scale.id"
                    [class.bg-[#071633]]="a11y.fontScale() !== scale.id"
                    [class.text-stone-200]="a11y.fontScale() !== scale.id"
                    [class.border-sky-300/25]="a11y.fontScale() !== scale.id"
                  >
                    <span class="font-serif" [style.fontSize.px]="scale.previewPx">Aa</span>
                    <span class="text-[10px] font-mono">%{{ scale.id }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- 2. Font Family Mode (Yuvarlak Hatlı Modern / Disleksi Dostu / Klasik) -->
            <div class="space-y-2.5">
              <span class="font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">font_download</mat-icon>
                <span>2. Yazı Tipi Ailesi (Google Özel Tipografi Seçimi)</span>
              </span>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                @for (mode of fontModes; track mode.id) {
                  <button
                    type="button"
                    (click)="a11y.setFontMode(mode.id)"
                    class="p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1"
                    [class.bg-sky-500/25]="a11y.fontMode() === mode.id"
                    [class.border-amber-300]="a11y.fontMode() === mode.id"
                    [class.bg-[#071633]]="a11y.fontMode() !== mode.id"
                    [class.border-sky-300/25]="a11y.fontMode() !== mode.id"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-white text-xs">{{ mode.label }}</span>
                      @if (a11y.fontMode() === mode.id) {
                        <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">check_circle</mat-icon>
                      }
                    </div>
                    <p class="text-[11px] text-sky-200/85 leading-snug">{{ mode.desc }}</p>
                  </button>
                }
              </div>
            </div>

            <!-- 3. Contrast & Reading Surface Theme -->
            <div class="space-y-2.5">
              <span class="font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">contrast</mat-icon>
                <span>3. Makale Arka Plan & Göz Konforu Modu</span>
              </span>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                @for (c of contrastModes; track c.id) {
                  <button
                    type="button"
                    (click)="a11y.setContrastMode(c.id)"
                    class="p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1"
                    [class.bg-sky-500/25]="a11y.contrastMode() === c.id"
                    [class.border-amber-300]="a11y.contrastMode() === c.id"
                    [class.bg-[#071633]]="a11y.contrastMode() !== c.id"
                    [class.border-sky-300/25]="a11y.contrastMode() !== c.id"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-white text-xs">{{ c.label }}</span>
                      @if (a11y.contrastMode() === c.id) {
                        <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">check_circle</mat-icon>
                      }
                    </div>
                    <p class="text-[11px] text-sky-200/85 leading-snug">{{ c.desc }}</p>
                  </button>
                }
              </div>
            </div>

            <!-- 4. Extra Reading Aids (Satır Aralığı & Odak Cetveli) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                (click)="a11y.toggleLineSpacing()"
                class="p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all"
                [class.bg-sky-500/25]="a11y.lineSpacing() === 'relaxed'"
                [class.border-amber-300]="a11y.lineSpacing() === 'relaxed'"
                [class.bg-[#071633]]="a11y.lineSpacing() !== 'relaxed'"
                [class.border-sky-300/25]="a11y.lineSpacing() !== 'relaxed'"
              >
                <div class="flex items-center gap-2.5 text-left">
                  <mat-icon class="!w-5 !h-5 !text-lg icon-luminous">format_line_spacing</mat-icon>
                  <div>
                    <div class="text-xs font-bold text-white">Geniş Satır Aralığı (2.1x)</div>
                    <div class="text-[11px] text-sky-200/80">Uzun okumalar için ferah satırlar</div>
                  </div>
                </div>
                <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-white/10 text-amber-300">
                  {{ a11y.lineSpacing() === 'relaxed' ? 'AÇIK' : 'NORMAL' }}
                </span>
              </button>

              <button
                type="button"
                (click)="a11y.toggleReadingGuide()"
                class="p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all"
                [class.bg-sky-500/25]="a11y.readingGuide()"
                [class.border-amber-300]="a11y.readingGuide()"
                [class.bg-[#071633]]="!a11y.readingGuide()"
                [class.border-sky-300/25]="!a11y.readingGuide()"
              >
                <div class="flex items-center gap-2.5 text-left">
                  <mat-icon class="!w-5 !h-5 !text-lg icon-luminous-amber">horizontal_rule</mat-icon>
                  <div>
                    <div class="text-xs font-bold text-white">Işıklı Okuma Cetveli</div>
                    <div class="text-[11px] text-sky-200/80">Satır takibini kolaylaştıran kılavuz</div>
                  </div>
                </div>
                <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-white/10 text-amber-300">
                  {{ a11y.readingGuide() ? 'AÇIK' : 'KAPALI' }}
                </span>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-5 sm:px-6 py-3.5 bg-[#051026] border-t border-sky-300/25 flex items-center justify-between gap-3">
            <button
              type="button"
              (click)="a11y.resetAll()"
              class="nav-pill-btn !h-9 !px-3.5 text-xs"
            >
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">restart_alt</mat-icon>
              <span>Varsayılana Sıfırla</span>
            </button>

            <button
              type="button"
              (click)="a11y.closePanel()"
              class="luxury-btn-primary !h-9 !px-5 text-xs"
            >
              <mat-icon class="!w-4 !h-4 !text-sm">check</mat-icon>
              <span>Ayarları Uygula</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AccessibilityBarComponent {
  readonly a11y = inject(AccessibilityService);

  readonly scales: {id: FontScaleLevel; previewPx: number}[] = [
    {id: '90', previewPx: 13},
    {id: '100', previewPx: 15},
    {id: '110', previewPx: 17},
    {id: '120', previewPx: 19},
    {id: '135', previewPx: 22},
  ];

  readonly fontModes: {id: FontFamilyMode; label: string; desc: string}[] = [
    {
      id: 'rounded',
      label: 'Google Studio Netliği',
      desc: 'Inter & Roboto: Muntazam, jilet keskinliğinde, Türkçe karakter uyumu kusursuz Google UI yazı tipi.',
    },
    {
      id: 'dyslexic',
      label: 'Maksimum Okunurluk',
      desc: 'Lexend: Göz yorgunluğunu ve disleksi takılmalarını önleyen geniş harf yapısı.',
    },
    {
      id: 'classic',
      label: 'Klasik Akademik',
      desc: 'Lora & Inter: Geleneksel edebiyat ve felsefe mecmuası kitap dizgisi.',
    },
  ];

  readonly contrastModes: {id: ContrastMode; label: string; desc: string}[] = [
    {
      id: 'default',
      label: 'Bulut Mavisi & Safir',
      desc: 'Alttan bulut ışıması ve kadife safir mavi okuma yüzeyi.',
    },
    {
      id: 'high',
      label: 'Yüksek Kontrast',
      desc: 'Derin gece siyahı zemin üzerinde keskin beyaz ve altın sarısı vurgu.',
    },
    {
      id: 'sepia',
      label: 'Sıcak Parşömen',
      desc: 'Gece okumaları için mavi ışığı azaltılmış sıcak kehribar-sepya kağıt tonu.',
    },
  ];

  onMouseMove(event: MouseEvent): void {
    if (this.a11y.readingGuide()) {
      this.a11y.updateGuidePosition(event.clientY);
    }
  }
}
