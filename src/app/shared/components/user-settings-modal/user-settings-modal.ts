import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {
  MemberContributionRole,
  SiteThemePalette,
  UserCustomizationService,
} from '../../../core/services/user-customization.service';
import {
  AccessibilityService,
  FontFamilyMode,
  FontScaleLevel,
} from '../../../core/services/accessibility.service';
import {ReaderComfortService} from '../../../core/services/reader-comfort.service';
import {LayoutService} from '../../../core/services/layout.service';

@Component({
  selector: 'app-user-settings-modal',
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (custom.isSettingsOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-5 bg-[#020817]/80 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Kullanıcı Paneli, Tam Site Özelleştirme ve ORXUN Ödül Cüzdanı"
      >
        <button
          type="button"
          (click)="custom.closeSettings()"
          class="fixed inset-0 w-full h-full border-0 p-0 cursor-default"
          aria-label="Kapat"
        ></button>

        <div class="relative z-10 w-full max-w-4xl rounded-3xl bg-glass-blue border border-sky-300/45 shadow-[0_28px_80px_rgba(2,8,23,0.96)] overflow-hidden my-auto reveal-up">
          <!-- Top Modal Header -->
          <div class="px-4 sm:px-6 py-4 bg-gradient-to-r from-[#06152d] via-[#0c2754] to-[#06152d] border-b border-sky-300/30 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <!-- ORXUN Coin Emblem (Uses Official Site Logo) -->
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/25 via-cyan-500/20 to-emerald-500/25 border border-amber-300/60 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)] shrink-0">
                <img
                  src="/logo.svg"
                  alt="ORXUN Token ve YENİDEM Arması"
                  class="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-base sm:text-lg font-serif font-bold text-white">
                    Kullanıcı Paneli, Site Özelleştirme &amp; ORXUN Ödül Cüzdanı
                  </h2>
                  <span class="text-xs font-mono font-bold text-amber-300">
                    · {{ custom.orxunBalance() | number:'1.2-2' }} ORXUN
                  </span>
                </div>
                <p class="text-xs text-sky-200/90">
                  Tam site görünüm kontrolü, göz konforu ayarları ve yazar/çizer/topluluk blok zinciri ödül sistemi
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="custom.closeSettings()"
              class="luxury-icon-btn !w-9 !h-9"
              title="Kapat"
            >
              <mat-icon class="!w-4 !h-4 !text-base">close</mat-icon>
            </button>
          </div>

          <!-- Toast Notification Bar inside Modal -->
          @if (custom.toastMessage(); as msg) {
            <div class="px-5 py-2.5 bg-emerald-950/90 border-b border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">check_circle</mat-icon>
              <span>{{ msg }}</span>
            </div>
          }

          <!-- Navigation Tabs -->
          <div class="px-4 sm:px-6 pt-3.5 pb-2 bg-[#06132c]/90 border-b border-sky-300/25 flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#040d1f] border border-sky-300/20">
              <button
                type="button"
                (click)="custom.activeTab.set('customize')"
                class="px-3.5 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5"
                [class.bg-cyan-500/25]="custom.activeTab() === 'customize'"
                [class.text-cyan-200]="custom.activeTab() === 'customize'"
                [class.border]="custom.activeTab() === 'customize'"
                [class.border-cyan-300/50]="custom.activeTab() === 'customize'"
                [class.text-sky-200/75]="custom.activeTab() !== 'customize'"
              >
                <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">tune</mat-icon>
                <span>Siteyi Özelleştir</span>
              </button>

              <button
                type="button"
                (click)="custom.activeTab.set('wallet')"
                class="px-3.5 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5"
                [class.bg-amber-500/25]="custom.activeTab() === 'wallet'"
                [class.text-amber-200]="custom.activeTab() === 'wallet'"
                [class.border]="custom.activeTab() === 'wallet'"
                [class.border-amber-300/50]="custom.activeTab() === 'wallet'"
                [class.text-sky-200/75]="custom.activeTab() !== 'wallet'"
              >
                <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">toll</mat-icon>
                <span>ORXUN Ödül Cüzdanı ({{ custom.orxunBalance() | number:'1.2-2' }})</span>
              </button>

              <button
                type="button"
                (click)="custom.activeTab.set('profile')"
                class="px-3.5 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5"
                [class.bg-emerald-500/25]="custom.activeTab() === 'profile'"
                [class.text-emerald-200]="custom.activeTab() === 'profile'"
                [class.border]="custom.activeTab() === 'profile'"
                [class.border-emerald-300/50]="custom.activeTab() === 'profile'"
                [class.text-sky-200/75]="custom.activeTab() !== 'profile'"
              >
                <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">badge</mat-icon>
                <span>Üye Profili &amp; Rol</span>
              </button>
            </div>

            <div class="text-[11px] font-mono text-sky-200/85 hidden md:flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{{ custom.memberProfile().displayName }} · {{ custom.memberProfile().role }}</span>
            </div>
          </div>

          <!-- Modal Content Body -->
          <div class="p-4 sm:p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6 text-xs sm:text-sm">
            @if (custom.activeTab() === 'customize') {
              <!-- TAB 1: FULL SITE CUSTOMIZATION -->
              <div class="space-y-6">
                <!-- 1. Site Theme Palette -->
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <h3 class="font-serif font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                      <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">palette</mat-icon>
                      <span>1. Ana Site Atmosferi &amp; Renk Paleti</span>
                    </h3>
                    <span class="text-[11px] font-mono text-cyan-200">Tüm Sayfalarda Anında Uygulanır</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    @for (t of themes; track t.id) {
                      <button
                        type="button"
                        (click)="custom.setSiteTheme(t.id)"
                        class="p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5"
                        [class.bg-sky-500/25]="custom.siteTheme() === t.id"
                        [class.border-amber-300]="custom.siteTheme() === t.id"
                        [class.bg-[#071633]]="custom.siteTheme() !== t.id"
                        [class.border-sky-300/25]="custom.siteTheme() !== t.id"
                      >
                        <div class="flex items-center justify-between gap-2">
                          <span class="w-4 h-4 rounded-full border border-white/40" [style.background]="t.swatch"></span>
                          @if (custom.siteTheme() === t.id) {
                            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">check_circle</mat-icon>
                          }
                        </div>
                        <div class="font-bold text-white text-xs">{{ t.label }}</div>
                        <p class="text-[11px] text-sky-200/80 leading-snug">{{ t.desc }}</p>
                      </button>
                    }
                  </div>
                </div>

                <!-- 2. Typography & Font Scaling -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-sky-300/20">
                  <!-- Font Scale -->
                  <div class="space-y-2.5">
                    <div class="flex items-center justify-between">
                      <h3 class="font-serif font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                        <mat-icon class="!w-4 !h-4 !text-base icon-luminous">format_size</mat-icon>
                        <span>2. Genel Yazı Boyutu</span>
                      </h3>
                      <span class="font-mono text-xs text-cyan-200 font-bold">{{ a11y.fontScaleLabel() }}</span>
                    </div>
                    <div class="grid grid-cols-5 gap-1.5">
                      @for (scale of scales; track scale.id) {
                        <button
                          type="button"
                          (click)="a11y.setFontScale(scale.id)"
                          class="py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center"
                          [class.bg-amber-400]="a11y.fontScale() === scale.id"
                          [class.text-stone-950]="a11y.fontScale() === scale.id"
                          [class.border-amber-200]="a11y.fontScale() === scale.id"
                          [class.font-bold]="a11y.fontScale() === scale.id"
                          [class.bg-[#071633]]="a11y.fontScale() !== scale.id"
                          [class.text-stone-200]="a11y.fontScale() !== scale.id"
                          [class.border-sky-300/25]="a11y.fontScale() !== scale.id"
                        >
                          <span class="font-serif text-sm">Aa</span>
                          <span class="text-[10px] font-mono">%{{ scale.id }}</span>
                        </button>
                      }
                    </div>
                  </div>

                  <!-- Font Family -->
                  <div class="space-y-2.5">
                    <h3 class="font-serif font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                      <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">font_download</mat-icon>
                      <span>3. Yazı Tipi Karakteri</span>
                    </h3>
                    <div class="grid grid-cols-3 gap-2">
                      @for (f of fontModes; track f.id) {
                        <button
                          type="button"
                          (click)="a11y.setFontMode(f.id)"
                          class="p-2.5 rounded-xl border text-left transition-all cursor-pointer"
                          [class.bg-sky-500/25]="a11y.fontMode() === f.id"
                          [class.border-amber-300]="a11y.fontMode() === f.id"
                          [class.bg-[#071633]]="a11y.fontMode() !== f.id"
                          [class.border-sky-300/25]="a11y.fontMode() !== f.id"
                        >
                          <div class="font-bold text-white text-xs truncate">{{ f.label }}</div>
                          <div class="text-[10px] text-sky-200/80 truncate mt-0.5">{{ f.short }}</div>
                        </button>
                      }
                    </div>
                  </div>
                </div>

                <!-- 4. Workspace & Floating Tools Customization -->
                <div class="space-y-2.5 pt-2 border-t border-sky-300/20">
                  <h3 class="font-serif font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                    <mat-icon class="!w-4 !h-4 !text-base icon-luminous">dashboard_customize</mat-icon>
                    <span>4. Çalışma Alanı, Paneller, Göz Konforu ve Titremesiz Mod</span>
                  </h3>

                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    <!-- Reduced Motion / Flicker-Free Lock -->
                    <button
                      type="button"
                      (click)="custom.toggleReducedMotion()"
                      class="p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all text-left"
                      [class.bg-emerald-500/20]="custom.reducedMotion()"
                      [class.border-emerald-300]="custom.reducedMotion()"
                      [class.bg-[#071633]]="!custom.reducedMotion()"
                      [class.border-sky-300/25]="!custom.reducedMotion()"
                    >
                      <div>
                        <div class="text-xs font-bold text-white">Titremesiz Sabit Mod</div>
                        <div class="text-[11px] text-sky-200/80">Tüm animasyonları dondur</div>
                      </div>
                      <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-amber-300">
                        {{ custom.reducedMotion() ? 'AÇIK' : 'NORMAL' }}
                      </span>
                    </button>

                    <!-- Card Density -->
                    <button
                      type="button"
                      (click)="custom.setCardDensity(custom.cardDensity() === 'comfortable' ? 'compact' : 'comfortable')"
                      class="p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all text-left bg-[#071633] border-sky-300/25"
                    >
                      <div>
                        <div class="text-xs font-bold text-white">Makale Kart Yoğunluğu</div>
                        <div class="text-[11px] text-sky-200/80">Liste ve ızgara ferahlığı</div>
                      </div>
                      <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-cyan-200">
                        {{ custom.cardDensity() === 'comfortable' ? 'FERAH' : 'KOMPAKT' }}
                      </span>
                    </button>

                    <!-- Relaxed Line Spacing -->
                    <button
                      type="button"
                      (click)="a11y.toggleLineSpacing()"
                      class="p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all text-left"
                      [class.bg-sky-500/25]="a11y.lineSpacing() === 'relaxed'"
                      [class.border-amber-300]="a11y.lineSpacing() === 'relaxed'"
                      [class.bg-[#071633]]="a11y.lineSpacing() !== 'relaxed'"
                      [class.border-sky-300/25]="a11y.lineSpacing() !== 'relaxed'"
                    >
                      <div>
                        <div class="text-xs font-bold text-white">Geniş Satır Aralığı (2.1x)</div>
                        <div class="text-[11px] text-sky-200/80">Uzun okumalar için ferahlık</div>
                      </div>
                      <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-amber-300">
                        {{ a11y.lineSpacing() === 'relaxed' ? 'AÇIK' : 'NORMAL' }}
                      </span>
                    </button>

                    <!-- Floating AI Guide Visibility -->
                    <button
                      type="button"
                      (click)="custom.toggleFloatingAiButton()"
                      class="p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all text-left"
                      [class.bg-sky-500/20]="custom.showFloatingAiButton()"
                      [class.border-sky-300/50]="custom.showFloatingAiButton()"
                      [class.bg-[#071633]]="!custom.showFloatingAiButton()"
                      [class.border-sky-300/20]="!custom.showFloatingAiButton()"
                    >
                      <div>
                        <div class="text-xs font-bold text-white">Alt Sol AI Rehber Butonu</div>
                        <div class="text-[11px] text-sky-200/80">İrfan Işığı hızlı erişim</div>
                      </div>
                      <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-emerald-300">
                        {{ custom.showFloatingAiButton() ? 'GÖRÜNÜR' : 'GİZLİ' }}
                      </span>
                    </button>

                    <!-- Floating Audio Deck Visibility -->
                    <button
                      type="button"
                      (click)="custom.toggleFloatingAudioButton()"
                      class="p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all text-left"
                      [class.bg-sky-500/20]="custom.showFloatingAudioButton()"
                      [class.border-sky-300/50]="custom.showFloatingAudioButton()"
                      [class.bg-[#071633]]="!custom.showFloatingAudioButton()"
                      [class.border-sky-300/20]="!custom.showFloatingAudioButton()"
                    >
                      <div>
                        <div class="text-xs font-bold text-white">Alt Sağ Deyiş &amp; Bağlama</div>
                        <div class="text-[11px] text-sky-200/80">Akustik çalar hızlı erişim</div>
                      </div>
                      <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-emerald-300">
                        {{ custom.showFloatingAudioButton() ? 'GÖRÜNÜR' : 'GİZLİ' }}
                      </span>
                    </button>

                    <!-- Reading Focus Guide Line -->
                    <button
                      type="button"
                      (click)="a11y.toggleReadingGuide()"
                      class="p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all text-left"
                      [class.bg-amber-500/20]="a11y.readingGuide()"
                      [class.border-amber-300]="a11y.readingGuide()"
                      [class.bg-[#071633]]="!a11y.readingGuide()"
                      [class.border-sky-300/20]="!a11y.readingGuide()"
                    >
                      <div>
                        <div class="text-xs font-bold text-white">Işıklı Okuma Cetveli</div>
                        <div class="text-[11px] text-sky-200/80">Satır takip kılavuzu</div>
                      </div>
                      <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-amber-300">
                        {{ a11y.readingGuide() ? 'AÇIK' : 'KAPALI' }}
                      </span>
                    </button>
                  </div>
                </div>

                <!-- 5. Eye-Comfort Blue Light Warmth Slider -->
                <div class="p-4 rounded-2xl bg-[#071633]/90 border border-sky-300/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="space-y-0.5">
                    <div class="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">wb_incandescent</mat-icon>
                      <span>Tam Ekran Okuma Modu Mavi Işık (Kehribar) Filtresi</span>
                    </div>
                    <p class="text-[11px] text-sky-200/80">
                      Makaleleri tam ekran göz konforu modunda okurken uygulanan sıcak filtre oranı
                    </p>
                  </div>
                  <div class="flex items-center gap-3 sm:w-64">
                    <input
                      type="range"
                      min="0"
                      max="45"
                      step="5"
                      [value]="readerComfort.blueLightShieldPercent()"
                      (input)="onWarmthChange($event)"
                      aria-label="Mavi Işık Kehribar Filtresi"
                      class="flex-1 accent-amber-400 h-1.5 rounded-lg bg-white/20 cursor-pointer"
                    />
                    <span class="font-mono text-xs text-amber-300 font-bold w-10 text-right">
                      %{{ readerComfort.blueLightShieldPercent() }}
                    </span>
                  </div>
                </div>
              </div>
            } @else if (custom.activeTab() === 'wallet') {
              <!-- TAB 2: ORXUN TOKEN WALLET & COMMUNITY REWARDS -->
              <div class="space-y-5">
                <!-- Hero ORXUN Token Card -->
                <div class="p-5 rounded-3xl bg-gradient-to-r from-[#071938] via-[#0e2c5e] to-[#081d40] border border-amber-300/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/30 via-cyan-500/20 to-emerald-400/30 border-2 border-amber-300 flex items-center justify-center shadow-[0_0_28px_rgba(251,191,36,0.35)] shrink-0">
                      <img
                        src="/logo.svg"
                        alt="ORXUN Token İkonu"
                        class="w-11 h-11 object-contain"
                      />
                    </div>
                    <div class="space-y-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                          ORXUN İRFAN &amp; EMEK TOKENİ (SİMÜLE CÜZDAN)
                        </span>
                        <span class="text-[11px] font-mono text-emerald-300">
                          · İlk Üyelik 1.00 ORXUN Hediye Aktif
                        </span>
                      </div>
                      <div class="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight flex items-baseline gap-2">
                        <span>{{ custom.orxunBalance() | number:'1.2-2' }}</span>
                        <span class="text-base font-mono text-amber-300">ORXUN</span>
                      </div>
                      <div class="text-[11px] font-mono text-sky-200/90 break-all">
                        Rust Köprü Adresi: <span class="text-cyan-200">{{ custom.memberProfile().rustWalletAddress }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                    <a
                      routerLink="/topluluk-onayi"
                      (click)="custom.closeSettings()"
                      class="luxury-btn-primary !h-9 !px-4 text-xs justify-center"
                    >
                      <mat-icon class="!w-4 !h-4 !text-sm">hub</mat-icon>
                      <span>Rust Zinciri &amp; %96 Konsensüs</span>
                    </a>
                    <div class="text-[10px] font-mono text-center text-sky-200/80">
                      Ana Ağ (Mainnet) Bağlantısına Hazır
                    </div>
                  </div>
                </div>

                <!-- Why ORXUN Token Explanation -->
                <div class="p-4 rounded-2xl bg-[#06142e]/90 border border-sky-300/25 space-y-1.5">
                  <div class="text-xs font-serif font-bold text-cyan-200 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">auto_awesome</mat-icon>
                    <span>ORXUN Ödül Sistemi Nedir? (Yazar, Çizer, Şerhçi ve Topluluk Teşvik Modeli)</span>
                  </div>
                  <p class="text-xs text-stone-200 leading-relaxed">
                    <strong>ORXUN</strong>, spekülatif bir borsa aracı değil; YENİDEM külliyatına fikrî, edebî, sanatsal ve denetimsel emek veren <strong>yazarları, çizerleri, metin şerhçilerini ve %96 konsensüs hakemlerini</strong> onurlandırmak için tasarlanan <strong>Emek ve İrfan Kanıtı (Proof-of-Intellectual-Contribution)</strong> jetonudur. Her yeni üyeye hoş geldin hediyesi olarak <strong>1.00 ORXUN</strong> simüle olarak tanımlanır; Rust tabanlı ana zincir devreye girdiğinde cüzdan bakiyeleri doğrudan 1:1 oranında ana ağa aktarılır.
                  </p>
                </div>

                <!-- Interactive Contribution Reward Missions -->
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <h3 class="font-serif font-bold text-amber-300 text-sm flex items-center gap-1.5">
                      <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">workspace_premium</mat-icon>
                      <span>Sisteme Destek &amp; Katkı Ödül Görevleri (Simüle Test)</span>
                    </h3>
                    <span class="text-[11px] font-mono text-sky-200/80">Katkı Türüne Göre ORXUN Kazanımı</span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    @for (m of custom.rewardMissions(); track m.id) {
                      <div class="p-3.5 rounded-2xl bg-[#071633]/90 border border-sky-300/25 flex flex-col justify-between gap-3">
                        <div class="space-y-1.5">
                          <div class="flex items-center justify-between gap-2">
                            <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                              {{ m.roleBadge }}
                            </span>
                            <span class="font-mono text-xs font-extrabold text-amber-300">
                              +{{ m.rewardAmount | number:'1.2-2' }} ORXUN
                            </span>
                          </div>
                          <h4 class="text-xs sm:text-sm font-serif font-bold text-white">{{ m.title }}</h4>
                          <p class="text-[11px] text-sky-200/85 leading-relaxed">{{ m.description }}</p>
                        </div>

                        <div class="pt-2 border-t border-sky-300/15 flex items-center justify-between">
                          @if (m.claimed) {
                            <span class="text-[11px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">verified</mat-icon>
                              <span>Cüzdana Tanımlandı</span>
                            </span>
                          } @else {
                            <span class="text-[10px] font-mono text-sky-300/80">Simüle Test Hazır</span>
                            <button
                              type="button"
                              (click)="custom.claimMissionReward(m.id)"
                              class="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                            >
                              <mat-icon class="!w-3.5 !h-3.5 !text-xs">add_task</mat-icon>
                              <span>Simüle Ödülü Al (+{{ m.rewardAmount }} ORXUN)</span>
                            </button>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- SHA3-512 Ledger Transaction History -->
                <div class="space-y-2 pt-2 border-t border-sky-300/20">
                  <h3 class="font-serif font-bold text-cyan-200 text-xs uppercase tracking-wider font-mono">
                    ORXUN Blok Zinciri İşlem Defteri (SHA3-512 Mühürlü Kayıtlar)
                  </h3>
                  <div class="space-y-1.5">
                    @for (tx of custom.ledgerHistory(); track tx.txId) {
                      <div class="p-2.5 rounded-xl bg-[#051024]/90 border border-sky-300/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div class="min-w-0">
                          <div class="font-bold text-white flex items-center gap-2">
                            <span class="font-mono text-[10px] text-amber-300">{{ tx.txId }}</span>
                            <span>·</span>
                            <span class="truncate">{{ tx.title }}</span>
                          </div>
                          <div class="text-[10px] font-mono text-sky-300/75 truncate">
                            SHA3: {{ tx.sha3Hash }} · {{ tx.timestamp }}
                          </div>
                        </div>
                        <span class="font-mono font-bold text-emerald-300 shrink-0">
                          +{{ tx.amount | number:'1.2-2' }} ORXUN
                        </span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            } @else {
              <!-- TAB 3: MEMBER PROFILE & ROLE -->
              <form (submit)="saveProfile($event)" [formGroup]="profileForm" class="space-y-5">
                <div class="p-4 rounded-2xl bg-[#071633]/90 border border-emerald-400/35 flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-serif font-bold text-lg text-emerald-200">
                      {{ custom.memberProfile().displayName.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="text-sm font-serif font-bold text-white">
                        {{ custom.memberProfile().displayName }}
                      </div>
                      <div class="text-xs text-emerald-300 font-mono">
                        {{ custom.memberProfile().role }} · {{ custom.memberProfile().kycLevel }}
                      </div>
                    </div>
                  </div>
                  <a
                    routerLink="/topluluk-onayi"
                    (click)="custom.closeSettings()"
                    class="nav-pill-btn !h-9 !px-3.5 text-xs !border-amber-400/50"
                  >
                    <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">verified_user</mat-icon>
                    <span>4 Kademeli Tel/Mail KYC Doğrulamasına Git</span>
                  </a>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label for="member-name" class="block text-xs font-bold text-sky-200">Ad Soyad / Mahlas</label>
                    <input
                      id="member-name"
                      type="text"
                      formControlName="displayName"
                      class="w-full rounded-xl bg-[#06132c] border border-sky-300/35 px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-300"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label for="member-handle" class="block text-xs font-bold text-sky-200">Kullanıcı Adı</label>
                    <input
                      id="member-handle"
                      type="text"
                      formControlName="username"
                      class="w-full rounded-xl bg-[#06132c] border border-sky-300/35 px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-300"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label for="member-email" class="block text-xs font-bold text-sky-200">E-Posta Adresi</label>
                    <input
                      id="member-email"
                      type="email"
                      formControlName="email"
                      class="w-full rounded-xl bg-[#06132c] border border-sky-300/35 px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-300"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label for="member-role" class="block text-xs font-bold text-sky-200">Topluluk Katkı Rolünüz</label>
                    <select
                      id="member-role"
                      formControlName="role"
                      class="w-full rounded-xl bg-[#06132c] border border-sky-300/35 px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-300"
                    >
                      @for (r of roles; track r) {
                        <option [value]="r">{{ r }}</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="flex justify-end">
                  <button type="submit" class="luxury-btn-primary !h-9 !px-5 text-xs">
                    <mat-icon class="!w-4 !h-4 !text-sm">save</mat-icon>
                    <span>Üye Profilini &amp; Cüzdanı Kaydet</span>
                  </button>
                </div>
              </form>
            }
          </div>

          <!-- Modal Footer -->
          <div class="px-4 sm:px-6 py-3.5 bg-[#051026] border-t border-sky-300/25 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              (click)="custom.resetAllCustomizations()"
              class="nav-pill-btn !h-9 !px-3.5 text-xs"
            >
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">restart_alt</mat-icon>
              <span>Görünümü Varsayılana Sıfırla</span>
            </button>

            <button
              type="button"
              (click)="custom.closeSettings()"
              class="luxury-btn-primary !h-9 !px-5 text-xs"
            >
              <mat-icon class="!w-4 !h-4 !text-sm">check</mat-icon>
              <span>Tamamla ve Uygula</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class UserSettingsModalComponent {
  readonly custom = inject(UserCustomizationService);
  readonly a11y = inject(AccessibilityService);
  readonly readerComfort = inject(ReaderComfortService);
  readonly layout = inject(LayoutService);
  private readonly fb = inject(FormBuilder);

  readonly profileForm = this.fb.nonNullable.group({
    displayName: [this.custom.memberProfile().displayName, Validators.required],
    username: [this.custom.memberProfile().username, Validators.required],
    email: [this.custom.memberProfile().email, [Validators.required, Validators.email]],
    role: [this.custom.memberProfile().role],
  });

  readonly themes: {id: SiteThemePalette; label: string; desc: string; swatch: string}[] = [
    {
      id: 'sapphire',
      label: 'Asil Safir & Gece Mavisi',
      desc: 'YENİDEM varsayılan kraliyet safir ve turkuaz parlaklığı.',
      swatch: 'linear-gradient(135deg, #081c3f, #0ea5e9)',
    },
    {
      id: 'amber-parchment',
      label: 'Horasan Kehribarı & Parşömen',
      desc: 'Göz dinlendirici sıcak elyazması ve kehribar okuma atmosferi.',
      swatch: 'linear-gradient(135deg, #29211a, #f59e0b)',
    },
    {
      id: 'emerald-irfan',
      label: 'Zümrüt Kubbe & İrfan Yeşili',
      desc: 'Huzur veren derin zümrüt yeşili ve altın tefekkür tonları.',
      swatch: 'linear-gradient(135deg, #06281e, #10b981)',
    },
    {
      id: 'midnight-oled',
      label: 'Tam Karartma OLED Gece',
      desc: 'Gece okumaları için yüksek kontrastlı saf siyah odak modu.',
      swatch: 'linear-gradient(135deg, #020611, #38bdf8)',
    },
  ];

  readonly scales: {id: FontScaleLevel}[] = [
    {id: '90'},
    {id: '100'},
    {id: '110'},
    {id: '120'},
    {id: '135'},
  ];

  readonly fontModes: {id: FontFamilyMode; label: string; short: string}[] = [
    {id: 'rounded', label: 'Google Studio', short: 'Inter & Roboto Net'},
    {id: 'dyslexic', label: 'Lexend Rahat', short: 'Okuma Dostu'},
    {id: 'classic', label: 'Lora Klasik', short: 'Edebi Tırnaklı'},
  ];

  readonly roles: MemberContributionRole[] = [
    'Yazar & Araştırmacı',
    'Çizer & Görsel Tasarımcı',
    'Metin Şerhçisi',
    'Topluluk Denetçisi',
    'Okur & Koleksiyoner',
  ];

  onWarmthChange(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    this.readerComfort.setBlueLightShield(val);
  }

  saveProfile(event: Event): void {
    event.preventDefault();
    const raw = this.profileForm.getRawValue();
    this.custom.updateMemberProfile({
      displayName: raw.displayName.trim() || 'İrfan Dostu',
      username: raw.username.trim() || '@irfan_okuru',
      email: raw.email.trim() || 'uye@yenidem.org',
      role: raw.role,
    });
  }
}
