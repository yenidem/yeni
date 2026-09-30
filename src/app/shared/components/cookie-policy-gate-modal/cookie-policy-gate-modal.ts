import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CookieConsentService} from '../../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-policy-gate-modal',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cookieService.isGateModalOpen()) {
      <div
        class="fixed inset-0 z-[95] bg-[#020817]/92 backdrop-blur-xl flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-gate-title"
      >
        <div
          class="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#051229] border-2 border-emerald-400/55 shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-hidden text-white reveal-up"
        >
          <!-- TOP HEADER: ULTRA-PRO INTERNATIONAL COMPLIANCE & TIMED WARNING BANNER -->
          <div class="p-4 sm:p-5 bg-gradient-to-r from-[#04281e] via-[#071f3d] to-[#04281e] border-b border-emerald-400/35 space-y-3 shrink-0">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono">
                  @if (!cookieService.hasValidConsent()) {
                    <span class="px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-bold flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
                      <span>ZORUNLU GİRİŞ ONAY KAPISI (ONAY OLMADAN KÜRSÜYE GİRİLMEZ)</span>
                    </span>
                  } @else {
                    <span class="px-2.5 py-0.5 rounded-md bg-emerald-600/35 border border-emerald-300/60 text-emerald-200 font-bold flex items-center gap-1.5">
                      <mat-icon class="!w-3.5 !h-3.5 !text-xs">verified</mat-icon>
                      <span>AKTİF SERTİFİKA: {{ cookieService.activeReceipt()?.receiptId }}</span>
                    </span>
                  }

                  <span class="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-300/60 text-amber-200 font-bold">
                    ⚠ YAPIM AŞAMASINDA · TASLAK SÜRÜM
                  </span>
                  <span class="text-cyan-200 hidden sm:inline">KVKK 6698 · EU GDPR · ePrivacy · CCPA/GPC</span>
                </div>

                <h2 id="cookie-gate-title" class="text-base sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <mat-icon class="icon-luminous-emerald">policy</mat-icon>
                  <span>Uluslararası Çerez, KVKK/GDPR Veri Koruma ve Taslak İkaz Sözleşmesi</span>
                </h2>
              </div>

              <!-- Timed Warning Indicator + Optional Close Button (Only if already consented) -->
              <div class="flex items-center gap-2 shrink-0">
                <div class="px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-400/45 text-right font-mono">
                  <div class="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                    <mat-icon class="!w-3.5 !h-3.5 !text-xs">timer</mat-icon>
                    <span>
                      @if (cookieService.warningCountdownSeconds() > 0) {
                        Zaman Ayarlı İkaz: {{ cookieService.warningCountdownSeconds() }} sn
                      } @else {
                        İkaz Süresi Tamamlandı ✓
                      }
                    </span>
                  </div>
                  <div class="w-28 h-1 rounded-full bg-white/15 overflow-hidden mt-1">
                    <div
                      class="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                      [style.width.%]="((5 - cookieService.warningCountdownSeconds()) / 5) * 100"
                    ></div>
                  </div>
                </div>

                @if (cookieService.hasValidConsent()) {
                  <button
                    type="button"
                    (click)="cookieService.closeGateModalIfConsented()"
                    class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 flex items-center justify-center text-white cursor-pointer"
                    title="Pencereyi Kapat"
                  >
                    <mat-icon class="!w-5 !h-5">close</mat-icon>
                  </button>
                }
              </div>
            </div>

            <!-- PROMINENT CONSTRUCTION / DRAFT WARNING CALLOUT -->
            <div class="p-3 rounded-2xl bg-amber-500/15 border border-amber-300/55 flex items-start gap-2.5 text-xs">
              <mat-icon class="!w-5 !h-5 !text-lg text-amber-300 shrink-0 mt-0.5">construction</mat-icon>
              <div class="space-y-0.5 leading-relaxed">
                <span class="font-bold text-amber-200">ÖNEMLİ UYARI (YAPIM AŞAMASINDA &amp; ÖN İZLEME TASLAĞI):</span>
                <span class="text-white/95 font-light">
                  Bu sistem şu anda aktif yapım ve kriptografik mimari inşa aşamasındadır (<strong class="font-semibold text-amber-200">bu sadece bir taslaktır</strong>). Siteye giriş yapabilmek için aşağıdaki uluslararası çerez politikasını ve taslak sürüm ikazını onaylamanız zorunludur.
                </span>
              </div>
            </div>

            <!-- NAVIGATION TABS FOR ALL 4 LEGAL FILES & INVENTORY -->
            <div class="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                type="button"
                (click)="cookieService.activeModalTab.set('overview')"
                class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border"
                [class.bg-emerald-500/30]="cookieService.activeModalTab() === 'overview'"
                [class.border-emerald-300]="cookieService.activeModalTab() === 'overview'"
                [class.text-white]="cookieService.activeModalTab() === 'overview'"
                [class.bg-white/5]="cookieService.activeModalTab() !== 'overview'"
                [class.border-white/15]="cookieService.activeModalTab() !== 'overview'"
                [class.text-sky-200]="cookieService.activeModalTab() !== 'overview'"
              >
                <mat-icon class="!w-4 !h-4 !text-sm">tune</mat-icon>
                <span>Onay Kapısı &amp; Zamanlayıcı</span>
              </button>

              <button
                type="button"
                (click)="cookieService.activeModalTab.set('doc1')"
                class="px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
                [class.bg-emerald-500/30]="cookieService.activeModalTab() === 'doc1'"
                [class.border-emerald-300]="cookieService.activeModalTab() === 'doc1'"
                [class.bg-white/5]="cookieService.activeModalTab() !== 'doc1'"
                [class.border-white/15]="cookieService.activeModalTab() !== 'doc1'"
              >
                <span>Dosya 1: Çerez Politikası</span>
              </button>

              <button
                type="button"
                (click)="cookieService.activeModalTab.set('doc2')"
                class="px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
                [class.bg-emerald-500/30]="cookieService.activeModalTab() === 'doc2'"
                [class.border-emerald-300]="cookieService.activeModalTab() === 'doc2'"
                [class.bg-white/5]="cookieService.activeModalTab() !== 'doc2'"
                [class.border-white/15]="cookieService.activeModalTab() !== 'doc2'"
              >
                <span>Dosya 2: KVKK &amp; GDPR</span>
              </button>

              <button
                type="button"
                (click)="cookieService.activeModalTab.set('doc3')"
                class="px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
                [class.bg-emerald-500/30]="cookieService.activeModalTab() === 'doc3'"
                [class.border-emerald-300]="cookieService.activeModalTab() === 'doc3'"
                [class.bg-white/5]="cookieService.activeModalTab() !== 'doc3'"
                [class.border-white/15]="cookieService.activeModalTab() !== 'doc3'"
              >
                <span>Dosya 3: CCPA &amp; Cloudflare D1</span>
              </button>

              <button
                type="button"
                (click)="cookieService.activeModalTab.set('doc4')"
                class="px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
                [class.bg-emerald-500/30]="cookieService.activeModalTab() === 'doc4'"
                [class.border-emerald-300]="cookieService.activeModalTab() === 'doc4'"
                [class.bg-white/5]="cookieService.activeModalTab() !== 'doc4'"
                [class.border-white/15]="cookieService.activeModalTab() !== 'doc4'"
              >
                <span>Dosya 4: Taslak &amp; Telif Şartnamesi</span>
              </button>

              <button
                type="button"
                (click)="cookieService.activeModalTab.set('inventory')"
                class="px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
                [class.bg-emerald-500/30]="cookieService.activeModalTab() === 'inventory'"
                [class.border-emerald-300]="cookieService.activeModalTab() === 'inventory'"
                [class.bg-white/5]="cookieService.activeModalTab() !== 'inventory'"
                [class.border-white/15]="cookieService.activeModalTab() !== 'inventory'"
              >
                <span>Çerez Envanteri (5 Kayıt)</span>
              </button>
            </div>
          </div>

          <!-- SCROLLABLE BODY -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
            <!-- TAB: OVERVIEW, GRANULAR CATEGORIES & TIMED WARNING SETTINGS -->
            @if (cookieService.activeModalTab() === 'overview') {
              <div class="space-y-5">
                <!-- Timed Warning Duration Selector -->
                <div class="p-4 rounded-2xl bg-[#071938] border border-cyan-400/35 space-y-3">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-200">
                      <mat-icon class="!w-4 !h-4 !text-base icon-luminous">schedule</mat-icon>
                      <span>Zaman Ayarlı İkaz &amp; Onay Geçerlilik Süresi (Süre Dolunca Otomatik Uyarı)</span>
                    </div>

                    <button
                      type="button"
                      (click)="cookieService.triggerTimedWarningDemo(4)"
                      class="px-3 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/60 text-[11px] font-mono font-bold text-amber-200 cursor-pointer flex items-center gap-1"
                      title="Pencereyi kapatır ve 4 saniye sonra zaman ayarlı ikazı otomatik yeniden tetikler"
                    >
                      <mat-icon class="!w-3.5 !h-3.5 !text-xs">alarm_on</mat-icon>
                      <span>Zamanlı İkazı Şimdi Test Et (4 Sn)</span>
                    </button>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      (click)="cookieService.setDurationHours(1)"
                      class="p-2.5 rounded-xl border text-left transition-all cursor-pointer"
                      [class.bg-emerald-500/25]="cookieService.selectedDurationHours() === 1"
                      [class.border-emerald-300]="cookieService.selectedDurationHours() === 1"
                      [class.bg-black/30]="cookieService.selectedDurationHours() !== 1"
                      [class.border-white/15]="cookieService.selectedDurationHours() !== 1"
                    >
                      <div class="text-xs font-bold text-white">1 Saat</div>
                      <div class="text-[10px] text-sky-200/80">Geçici Taslak Oturumu</div>
                    </button>

                    <button
                      type="button"
                      (click)="cookieService.setDurationHours(24)"
                      class="p-2.5 rounded-xl border text-left transition-all cursor-pointer"
                      [class.bg-emerald-500/25]="cookieService.selectedDurationHours() === 24"
                      [class.border-emerald-300]="cookieService.selectedDurationHours() === 24"
                      [class.bg-black/30]="cookieService.selectedDurationHours() !== 24"
                      [class.border-white/15]="cookieService.selectedDurationHours() !== 24"
                    >
                      <div class="text-xs font-bold text-white">24 Saat</div>
                      <div class="text-[10px] text-sky-200/80">Günlük Akademik Giriş</div>
                    </button>

                    <button
                      type="button"
                      (click)="cookieService.setDurationHours(720)"
                      class="p-2.5 rounded-xl border text-left transition-all cursor-pointer"
                      [class.bg-emerald-500/25]="cookieService.selectedDurationHours() === 720"
                      [class.border-emerald-300]="cookieService.selectedDurationHours() === 720"
                      [class.bg-black/30]="cookieService.selectedDurationHours() !== 720"
                      [class.border-white/15]="cookieService.selectedDurationHours() !== 720"
                    >
                      <div class="text-xs font-bold text-white">30 Gün (Önerilen)</div>
                      <div class="text-[10px] text-sky-200/80">Standart GDPR / KVKK</div>
                    </button>

                    <button
                      type="button"
                      (click)="cookieService.setDurationHours(4320)"
                      class="p-2.5 rounded-xl border text-left transition-all cursor-pointer"
                      [class.bg-emerald-500/25]="cookieService.selectedDurationHours() === 4320"
                      [class.border-emerald-300]="cookieService.selectedDurationHours() === 4320"
                      [class.bg-black/30]="cookieService.selectedDurationHours() !== 4320"
                      [class.border-white/15]="cookieService.selectedDurationHours() !== 4320"
                    >
                      <div class="text-xs font-bold text-white">180 Gün</div>
                      <div class="text-[10px] text-sky-200/80">Dönemlik Külliyat Onayı</div>
                    </button>
                  </div>
                </div>

                <!-- 4 International Cookie Category Cards -->
                @let cats = cookieService.categories();
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <!-- Category 1: Strictly Necessary (Locked Active) -->
                  <div class="p-4 rounded-2xl bg-[#071836] border border-emerald-400/45 space-y-2">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <mat-icon class="!w-4 !h-4 !text-base text-emerald-300">verified_user</mat-icon>
                        <span class="text-xs sm:text-sm font-bold text-white">1. Zorunlu Güvenlik &amp; Cloudflare WAF</span>
                      </div>
                      <span class="px-2 py-0.5 rounded bg-emerald-500/25 border border-emerald-300/50 text-[10px] font-mono font-bold text-emerald-200">
                        ZORUNLU AKTİF
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-200 leading-relaxed">
                      Cloudflare DDoS/Bot kalkanı (<code>cf_clearance</code>), RFC 6238 iki aşamalı yazar doğrulaması (2FA) ve SHA3-512 kod bütünlük sertifikası için mecburidir.
                    </p>
                  </div>

                  <!-- Category 2: Functional & Reader Comfort -->
                  <div class="p-4 rounded-2xl bg-[#071836] border border-sky-300/30 space-y-2">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <mat-icon class="!w-4 !h-4 !text-base text-cyan-300">visibility</mat-icon>
                        <span class="text-xs sm:text-sm font-bold text-white">2. Okuma Konforu &amp; Site Özelleştirme</span>
                      </div>
                      <button
                        type="button"
                        (click)="cookieService.toggleCategory('functionalComfort')"
                        class="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold cursor-pointer border transition-all"
                        [class.bg-emerald-500/30]="cats.functionalComfort"
                        [class.border-emerald-300]="cats.functionalComfort"
                        [class.text-emerald-200]="cats.functionalComfort"
                        [class.bg-white/10]="!cats.functionalComfort"
                        [class.border-white/20]="!cats.functionalComfort"
                        [class.text-slate-300]="!cats.functionalComfort"
                      >
                        {{ cats.functionalComfort ? '✓ AÇIK' : 'KAPALI' }}
                      </button>
                    </div>
                    <p class="text-[11px] text-slate-200 leading-relaxed">
                      Seçtiğiniz site temasını (Safir, Kehribar, Zümrüt, OLED), yazı boyutunu (%90–%135) ve mavi ışık filtresini tarayıcınızda saklar.
                    </p>
                  </div>

                  <!-- Category 3: Web3, ORXUN Wallet & %96 Consensus -->
                  <div class="p-4 rounded-2xl bg-[#071836] border border-amber-300/35 space-y-2">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <mat-icon class="!w-4 !h-4 !text-base text-amber-300">token</mat-icon>
                        <span class="text-xs sm:text-sm font-bold text-white">3. ORXUN Cüzdan &amp; %96 Konsensüs Önbelleği</span>
                      </div>
                      <button
                        type="button"
                        (click)="cookieService.toggleCategory('web3Governance')"
                        class="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold cursor-pointer border transition-all"
                        [class.bg-emerald-500/30]="cats.web3Governance"
                        [class.border-emerald-300]="cats.web3Governance"
                        [class.text-emerald-200]="cats.web3Governance"
                        [class.bg-white/10]="!cats.web3Governance"
                        [class.border-white/20]="!cats.web3Governance"
                        [class.text-slate-300]="!cats.web3Governance"
                      >
                        {{ cats.web3Governance ? '✓ AÇIK' : 'KAPALI' }}
                      </button>
                    </div>
                    <p class="text-[11px] text-slate-200 leading-relaxed">
                      İlk üyelikte verilen <strong>+1.00 ORXUN</strong> simüle ödül bakiyesini, yazar/çizer görevlerini ve Kuantum KYC-4 doğrulama mührünü (<code>SEAL-PQC</code>) korur.
                    </p>
                  </div>

                  <!-- Category 4: Privacy-First Academic Analytics -->
                  <div class="p-4 rounded-2xl bg-[#071836] border border-sky-300/30 space-y-2">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <mat-icon class="!w-4 !h-4 !text-base text-sky-300">analytics</mat-icon>
                        <span class="text-xs sm:text-sm font-bold text-white">4. Anonim Akademik Okuma İstatistiği</span>
                      </div>
                      <button
                        type="button"
                        (click)="cookieService.toggleCategory('privacyAnalytics')"
                        class="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold cursor-pointer border transition-all"
                        [class.bg-emerald-500/30]="cats.privacyAnalytics"
                        [class.border-emerald-300]="cats.privacyAnalytics"
                        [class.text-emerald-200]="cats.privacyAnalytics"
                        [class.bg-white/10]="!cats.privacyAnalytics"
                        [class.border-white/20]="!cats.privacyAnalytics"
                        [class.text-slate-300]="!cats.privacyAnalytics"
                      >
                        {{ cats.privacyAnalytics ? '✓ AÇIK' : 'KAPALI' }}
                      </button>
                    </div>
                    <p class="text-[11px] text-slate-200 leading-relaxed">
                      Üçüncü taraf reklam takipçisi içermez. Yalnızca makalelerin okunma sayılarını anonim olarak sayar; IP adresi kaydetmez.
                    </p>
                  </div>
                </div>

                <!-- Quick Links to All 4 Legal Files -->
                <div class="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xs font-mono font-bold text-emerald-300">
                      ULUSLARARASI HUKUKİ DOSYA PAKETİ (4 TAM RESMİ METİN + ENVANTER)
                    </span>
                    <a
                      href="/legal/international-cookie-privacy-policy.json"
                      target="_blank"
                      rel="noopener"
                      class="text-[11px] font-mono text-cyan-300 hover:underline flex items-center gap-1"
                    >
                      <mat-icon class="!w-3.5 !h-3.5 !text-xs">open_in_new</mat-icon>
                      <span>Ham JSON Dosyasını Gör (/legal/international-cookie-privacy-policy.json)</span>
                    </a>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    @for (doc of cookieService.legalDocuments; track doc.id) {
                      <button
                        type="button"
                        (click)="selectDocTab(doc.id)"
                        class="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-left transition-all cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div class="min-w-0">
                          <div class="text-[10px] font-mono text-amber-300 truncate">{{ doc.fileName }}</div>
                          <div class="text-xs font-semibold text-white truncate">{{ doc.title }}</div>
                        </div>
                        <mat-icon class="!w-4 !h-4 text-emerald-300 shrink-0">arrow_forward</mat-icon>
                      </button>
                    }
                  </div>
                </div>
              </div>
            }

            <!-- TABS FOR INDIVIDUAL LEGAL DOCUMENTS (DOC 1, DOC 2, DOC 3, DOC 4) -->
            @for (doc of cookieService.legalDocuments; track doc.id) {
              @if (cookieService.activeModalTab() === doc.id) {
                <div class="p-5 rounded-2xl bg-[#071836] border border-sky-300/35 space-y-4">
                  <div class="border-b border-white/15 pb-3 space-y-1">
                    <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                      <span class="px-2 py-0.5 rounded bg-emerald-500/25 text-emerald-200 font-bold">{{ doc.badge }}</span>
                      <a
                        [href]="'/legal/' + doc.fileName"
                        [attr.download]="doc.fileName"
                        target="_blank"
                        rel="noopener"
                        class="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/50 text-amber-200 font-bold flex items-center gap-1 transition-all"
                      >
                        <mat-icon class="!w-3.5 !h-3.5 !text-xs">download</mat-icon>
                        <span>Resmi Dosyayı İndir: /legal/{{ doc.fileName }}</span>
                      </a>
                    </div>
                    <h3 class="text-base sm:text-lg font-bold text-white">{{ doc.title }}</h3>
                    <div class="text-xs text-cyan-200 font-mono">Dayanak: {{ doc.standardRef }} · Tarih: {{ doc.lastUpdated }}</div>
                    <div class="text-[10px] text-slate-300 font-mono truncate">SHA3-512 Mühür: {{ doc.sha3DigestPreview }}</div>
                  </div>

                  <div class="space-y-3.5">
                    @for (sec of doc.sections; track sec.heading) {
                      <div class="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-1">
                        <h4 class="text-xs sm:text-sm font-bold text-amber-200">{{ sec.heading }}</h4>
                        <p class="text-xs sm:text-sm text-slate-100 font-light leading-relaxed">{{ sec.body }}</p>
                      </div>
                    }
                  </div>
                </div>
              }
            }

            <!-- TAB: TECHNICAL COOKIE & STORAGE INVENTORY -->
            @if (cookieService.activeModalTab() === 'inventory') {
              <div class="space-y-3">
                <div class="text-xs sm:text-sm font-bold text-emerald-200">
                  Teknik Çerez ve Kriptografik Yerel Depolama (LocalStorage) Envanteri
                </div>
                <div class="space-y-2.5">
                  @for (item of cookieService.cookieInventory; track item.name) {
                    <div class="p-3.5 rounded-2xl bg-[#071836] border border-sky-300/30 space-y-1.5">
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="font-mono text-xs font-bold text-amber-300">{{ item.name }}</span>
                        <span class="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-300/40 text-[10px] font-mono text-cyan-200">
                          {{ item.categoryLabel }} · {{ item.duration }}
                        </span>
                      </div>
                      <p class="text-xs text-slate-200 leading-relaxed">{{ item.purpose }}</p>
                      <div class="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-emerald-300">
                        <span>Sağlayıcı: {{ item.provider }}</span>
                        <span>Güvenlik: {{ item.securityStandard }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- FOOTER ACTIONS: MANDATORY CONSENT GATE BUTTONS & FULL DOWNLOAD -->
          <div class="p-4 sm:p-5 bg-[#040e21] border-t border-emerald-400/35 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shrink-0">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                (click)="cookieService.downloadCompleteLegalBundle()"
                class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-semibold text-white cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <mat-icon class="!w-4 !h-4 !text-sm text-amber-300">download</mat-icon>
                <span>Tüm Hukuki Dosyaları İndir (.JSON)</span>
              </button>

              @if (cookieService.hasValidConsent()) {
                <button
                  type="button"
                  (click)="cookieService.revokeConsentAndLockGate()"
                  class="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-400/50 text-xs font-semibold text-rose-200 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <mat-icon class="!w-4 !h-4 !text-sm">lock_reset</mat-icon>
                  <span>Onayı Sıfırla &amp; Giriş Kapısını Kilitle</span>
                </button>
              }
            </div>

            <div class="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                (click)="cookieService.saveSelectedAndEnter(true)"
                class="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-semibold text-slate-200 cursor-pointer transition-all"
              >
                Yalnızca Zorunlu Çerezler
              </button>

              <button
                type="button"
                (click)="cookieService.saveSelectedAndEnter(false)"
                class="px-3.5 py-2.5 rounded-xl bg-cyan-500/25 hover:bg-cyan-500/35 border border-cyan-300/60 text-xs font-bold text-cyan-100 cursor-pointer transition-all"
              >
                Seçili Tercihlerle Gir
              </button>

              <button
                type="button"
                (click)="cookieService.acceptAllAndEnter()"
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-extrabold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all"
              >
                <mat-icon class="!w-4 !h-4 !text-base">verified_user</mat-icon>
                <span>Tümünü Kabul Et, Taslak İkazını Onayla &amp; Siteye Gir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class CookiePolicyGateModalComponent {
  readonly cookieService = inject(CookieConsentService);

  selectDocTab(docId: string): void {
    if (docId === 'doc1' || docId === 'doc2' || docId === 'doc3' || docId === 'doc4') {
      this.cookieService.activeModalTab.set(docId);
    }
  }
}
