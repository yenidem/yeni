import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {LiveChangeLogService} from '../../../core/services/live-change-log.service';
import {CookieConsentService} from '../../../core/services/cookie-consent.service';

@Component({
  selector: 'app-bottom-change-ticker',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- EXPANDABLE LIVE CHANGE LOG & DRAFT DISCLAIMER DRAWER (Above Bottom Green Bar) -->
    @if (changeLog.isLogDrawerOpen()) {
      <div
        class="fixed bottom-9 left-0 right-0 z-40 max-h-[68vh] overflow-y-auto bg-[#031f17]/98 backdrop-blur-xl border-t-2 border-emerald-400/70 shadow-[0_-16px_48px_rgba(0,0,0,0.85)] text-white p-4 sm:p-6 reveal-up"
        role="region"
        aria-label="Son Sistem Değişimleri ve Yapım Aşaması Taslak İkaz Bülteni"
      >
        <div class="max-w-7xl mx-auto space-y-4">
          <!-- Top Warning Banner inside Drawer -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-amber-500/15 border border-amber-300/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="flex items-start gap-2.5">
              <mat-icon class="!w-5 !h-5 !text-xl text-amber-300 shrink-0 mt-0.5">warning_amber</mat-icon>
              <div class="space-y-0.5">
                <div class="text-xs sm:text-sm font-bold text-amber-200">
                  YAPIM AŞAMASINDA &amp; ÖN İZLEME TASLAĞI UYARISI (CONSTRUCTION &amp; DRAFT NOTICE)
                </div>
                <p class="text-[11px] sm:text-xs text-white/90 font-light leading-relaxed">
                  Bu platform şu anda aktif yazılım inşası, kriptografik test ve topluluk hazırlığı aşamasındadır (<strong class="font-semibold text-amber-200">Bu sadece mimari bir taslaktır</strong>). Sitedeki 1.000.000 üye barajı, %96 oylama ve <code class="text-emerald-200">ORXUN</code> ödül jetonu simülasyon modundadır; kurucu müellif <strong class="font-semibold text-white">Orçun KUNDAKCI</strong>’ya ait 16 eser tam telif ve SHA3-512 koruması altındadır.
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                (click)="triggerSampleChange()"
                class="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/35 border border-amber-300/60 text-xs font-semibold text-amber-100 cursor-pointer flex items-center gap-1.5 transition-all"
                title="Yeşil bantta anlık son dakika değişim haberi simülasyonu tetikler"
              >
                <mat-icon class="!w-4 !h-4 !text-sm text-amber-300">bolt</mat-icon>
                <span>Anlık Değişim Haberi Test Et</span>
              </button>
              <button
                type="button"
                (click)="openCookiePolicyFromDrawer()"
                class="px-3 py-1.5 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/40 border border-emerald-300/60 text-xs font-semibold text-white cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <mat-icon class="!w-4 !h-4 !text-sm text-emerald-200">policy</mat-icon>
                <span>Uluslararası Çerez &amp; Hukuk Dosyaları</span>
              </button>
              <button
                type="button"
                (click)="changeLog.isLogDrawerOpen.set(false)"
                class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-semibold text-white cursor-pointer flex items-center gap-1"
              >
                <mat-icon class="!w-4 !h-4 !text-sm">close</mat-icon>
                <span>Kapat</span>
              </button>
            </div>
          </div>

          <!-- Change Log Feed List -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs text-emerald-200 font-mono">
              <span>CANLI SİSTEM DEĞİŞİM &amp; SON HABER AKIM KAYITLARI ({{ changeLog.items().length }} KAYIT)</span>
              <span>SHA3-512 · CLOUDFLARE D1 · PQC-WORM</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              @for (item of changeLog.items(); track item.id) {
                <div
                  class="p-3 rounded-xl border transition-all flex flex-col justify-between gap-1.5"
                  [class.bg-emerald-900/45]="item.isLiveEvent"
                  [class.border-emerald-300/70]="item.isLiveEvent"
                  [class.bg-black/35]="!item.isLiveEvent"
                  [class.border-emerald-400/25]="!item.isLiveEvent"
                >
                  <div class="flex items-center justify-between gap-2 text-[10px] font-mono">
                    <span class="px-2 py-0.5 rounded bg-emerald-500/25 text-emerald-200 font-bold">
                      {{ item.category }}
                    </span>
                    <span class="text-white/75">{{ item.timestampLabel }} · {{ item.hashBadge }}</span>
                  </div>
                  <p class="text-xs text-white font-light leading-relaxed">
                    {{ item.headline }}
                  </p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }

    <!-- BOTTOM GREEN BREAKING-NEWS & LIVE CHANGE TICKER BAR (İnce Beyaz Yazılı Yeşil Bant) -->
    <div
      class="fixed bottom-0 left-0 right-0 z-40 h-9 emerald-news-ribbon text-white px-2.5 sm:px-4 flex items-center justify-between gap-2 select-none"
      role="status"
      aria-live="polite"
    >
      <!-- LEFT: Construction / Draft Warning Badge + Breaking Change Indicator -->
      <div class="flex items-center gap-2 shrink-0">
        <button
          type="button"
          (click)="changeLog.toggleLogDrawer()"
          class="px-2 py-0.5 rounded-md emerald-draft-tag text-amber-100 font-mono text-[10px] sm:text-[11px] font-semibold tracking-wide flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
          title="Yapım Aşaması ve Taslak Sürüm İkazını Görüntüle"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping"></span>
          <span>YAPIM AŞAMASINDA · BU SADECE TASLAK</span>
        </button>

        <span class="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-400/20 border border-emerald-300/45 text-[10px] font-mono text-emerald-100">
          <span
            class="w-1.5 h-1.5 rounded-full"
            [class.bg-white]="changeLog.flashIndicator()"
            [class.animate-ping]="changeLog.flashIndicator()"
            [class.bg-emerald-300]="!changeLog.flashIndicator()"
          ></span>
          <span>SON DEĞİŞİM:</span>
        </span>
      </div>

      <!-- CENTER: Fine White Typography Breaking News / Change Headline -->
      @let current = changeLog.currentItem();
      <button
        type="button"
        (click)="changeLog.toggleLogDrawer()"
        class="flex-1 min-w-0 flex items-center gap-2 text-left cursor-pointer group overflow-hidden"
        title="Tüm son değişim haberlerini ve taslak bültenini açmak için tıklayın"
      >
        <span class="hidden sm:inline-block shrink-0 text-[10px] font-mono text-emerald-200/95 bg-black/30 px-1.5 py-0.5 rounded border border-white/15">
          [{{ current.category }}]
        </span>
        <span class="text-[11px] sm:text-xs text-white font-light tracking-wide truncate group-hover:underline">
          {{ current.headline }}
        </span>
        <span class="hidden lg:inline-block shrink-0 text-[10px] font-mono text-emerald-200/85">
          · {{ current.timestampLabel }}
        </span>
      </button>

      <!-- RIGHT: Ticker Controls + Timed Cookie Policy Trigger -->
      <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
        @if (cookieService.scheduledReminderSeconds() > 0) {
          <span class="px-2 py-0.5 rounded bg-rose-500/40 border border-rose-300/70 text-[10px] font-mono text-white animate-pulse">
            ⏱ İkaz: {{ cookieService.scheduledReminderSeconds() }}sn
          </span>
        }

        <div class="hidden sm:flex items-center bg-black/30 rounded-lg border border-white/15 px-1 py-0.5 gap-0.5">
          <span class="text-[9px] font-mono text-emerald-200/90 px-1 tabular-nums">
            {{ changeLog.activeIndex() + 1 }}/{{ changeLog.items().length }}
          </span>
          <button
            type="button"
            (click)="changeLog.prev()"
            class="w-5 h-5 rounded hover:bg-white/15 flex items-center justify-center text-white/90 cursor-pointer"
            title="Önceki Değişim Haberi"
            aria-label="Önceki Değişim Haberi"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm">chevron_left</mat-icon>
          </button>
          <button
            type="button"
            (click)="changeLog.togglePause()"
            class="w-5 h-5 rounded hover:bg-white/15 flex items-center justify-center text-white/90 cursor-pointer"
            [title]="changeLog.isPaused() ? 'Haber Akışını Başlat' : 'Haber Akışını Duraklat'"
            [attr.aria-label]="changeLog.isPaused() ? 'Haber Akışını Başlat' : 'Haber Akışını Duraklat'"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm">{{ changeLog.isPaused() ? 'play_arrow' : 'pause' }}</mat-icon>
          </button>
          <button
            type="button"
            (click)="changeLog.next()"
            class="w-5 h-5 rounded hover:bg-white/15 flex items-center justify-center text-white/90 cursor-pointer"
            title="Sonraki Değişim Haberi"
            aria-label="Sonraki Değişim Haberi"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm">chevron_right</mat-icon>
          </button>
        </div>

        <button
          type="button"
          (click)="cookieService.openGateModal('overview')"
          class="px-2 sm:px-2.5 py-0.5 rounded-md bg-white/15 hover:bg-white/25 border border-white/35 text-white text-[10px] sm:text-[11px] font-light tracking-wide flex items-center gap-1 cursor-pointer transition-all"
          title="Ultra-Pro Uluslararası Çerez Politikası, KVKK/GDPR Dosyaları ve Zaman Ayarlı İkaz Ayarları"
        >
          <mat-icon class="!w-3.5 !h-3.5 !text-xs text-emerald-200">cookie</mat-icon>
          <span class="hidden xs:inline">Çerez &amp; Hukuk</span>
          <span class="text-[9px] font-mono text-emerald-200 hidden md:inline">(KVKK/GDPR)</span>
        </button>
      </div>
    </div>
  `,
})
export class BottomChangeTickerComponent {
  readonly changeLog = inject(LiveChangeLogService);
  readonly cookieService = inject(CookieConsentService);

  openCookiePolicyFromDrawer(): void {
    this.changeLog.isLogDrawerOpen.set(false);
    this.cookieService.openGateModal('overview');
  }

  triggerSampleChange(): void {
    this.changeLog.pushLiveChange(
      'ANLIK DEĞİŞİM',
      'Canlı Sistem Senkronizasyonu: 7 korunan çekirdek dosya, Cloudflare D1 şeması ve 4 uluslararası hukuk dosyası SHA3-512 ile doğrulandı.',
      `SYNC-${Math.random().toString(16).substring(2, 8).toUpperCase()}`
    );
  }
}
