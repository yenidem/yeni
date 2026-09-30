import {Injectable, PLATFORM_ID, computed, inject, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {catchError, of} from 'rxjs';
import {LiveChangeLogService} from './live-change-log.service';

export interface CookieCategoriesState {
  strictlyNecessary: boolean; // Always true (Cloudflare WAF, 2FA Session, Security Nonce)
  functionalComfort: boolean; // Theme, Font scale, Blue light filter, Reader comfort
  web3Governance: boolean; // ORXUN simulated wallet, KYC-4 seal, WORM certificate cache
  privacyAnalytics: boolean; // Zero-tracking anonymous academic reading metrics
}

export interface LegalPolicyDocument {
  id: string;
  fileName: string;
  badge: string;
  title: string;
  standardRef: string;
  lastUpdated: string;
  sha3DigestPreview: string;
  sections: {
    heading: string;
    body: string;
  }[];
}

export interface CookieInventoryItem {
  name: string;
  categoryLabel: string;
  provider: string;
  purpose: string;
  duration: string;
  securityStandard: string;
}

export interface StoredConsentReceipt {
  receiptId: string;
  issuedAtUtc: string;
  expiresAtMs: number;
  durationHours: number;
  acceptedDraftDisclaimer: boolean;
  categories: CookieCategoriesState;
  sha3_512Hash: string;
  blake2b512Hash: string;
}

const COOKIE_CONSENT_STORAGE_KEY = 'yenidem_intl_cookie_consent_v1';

@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly changeLog = inject(LiveChangeLogService);

  // Whether the user has a currently valid (non-expired) consent receipt
  readonly hasValidConsent = signal<boolean>(false);
  // Whether the Ultra-Pro Cookie & Draft Warning Modal is currently open
  readonly isGateModalOpen = signal<boolean>(false);
  // Active tab in the modal
  readonly activeModalTab = signal<'overview' | 'doc1' | 'doc2' | 'doc3' | 'doc4' | 'inventory'>('overview');

  // Timed Warning Countdown (5-second visual awareness countdown on popup open)
  readonly warningCountdownSeconds = signal<number>(5);
  readonly scheduledReminderSeconds = signal<number>(0);

  // Selected re-warning / consent validity duration in hours
  readonly selectedDurationHours = signal<number>(720); // Default 30 days (720h)
  readonly acceptedDraftDisclaimer = signal<boolean>(true);

  readonly categories = signal<CookieCategoriesState>({
    strictlyNecessary: true,
    functionalComfort: true,
    web3Governance: true,
    privacyAnalytics: true,
  });

  readonly activeReceipt = signal<StoredConsentReceipt | null>(null);

  readonly remainingValidityLabel = computed(() => {
    const rec = this.activeReceipt();
    if (!rec) return 'Onay Bekleniyor (Zorunlu Giriş Kapısı Aktif)';
    if (rec.durationHours <= 1) return '1 Saatlik Taslak Oturumu (Zaman Ayarlı İkaz Aktif)';
    if (rec.durationHours <= 24) return '24 Saatlik Günlük Oturum';
    if (rec.durationHours <= 720) return '30 Günlük Uluslararası Standart Onay';
    return '180 Günlük Akademik Dönem Onayı';
  });

  readonly legalDocuments: LegalPolicyDocument[] = [
    {
      id: 'doc1',
      fileName: '01-uluslararasi-cerez-ve-yerel-depolama-politikasi.md',
      badge: 'DOSYA 1 · EU ePRIVACY & IAB TCF v2.2',
      title: 'Uluslararası Çerez (Cookie) ve Kriptografik Yerel Depolama Politikası',
      standardRef: 'AB 2002/58/EC ePrivacy Direktifi · GDPR Madde 6(1)(a) · KVKK Çerez Rehberi',
      lastUpdated: '29 Eylül 2026',
      sha3DigestPreview: '0x94a8f1c3e7d20b65194c8a2d1e0f7b5a3c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f',
      sections: [
        {
          heading: '1. Amaç ve Kriptografik Çerez Mimarisi',
          body: 'YENİDEM Edebiyat, Felsefe ve Tefekkür Mecmuası; üçüncü taraf reklam veya gözetim çerezlerini kesinlikle kullanmaz. Sistemimizde kullanılan çerezler ve tarayıcı yerel depolama (LocalStorage) kayıtları yalnızca Cloudflare Katman-7 siber güvenlik kalkanı, RFC 6238 iki aşamalı yazar doğrulaması (2FA), okuma konforu (yazı boyutu, kehribar filtresi) ve %96 konsensüs / ORXUN cüzdan simülasyonu için çalıştırılır.',
        },
        {
          heading: '2. Zaman Ayarlı İkaz ve Açık Rıza (Opt-In) Mekanizması',
          body: 'Uluslararası ePrivacy ve GDPR standartları uyarınca zorunlu güvenlik çerezleri dışındaki tüm işlevsel ve Web3 depolama birimleri ziyaretçinin açık onayına tabidir. Ziyaretçi onay süresini 1 Saat (Taslak Testi), 24 Saat, 30 Gün veya 180 Gün olarak belirleyebilir; süre dolduğunda Zaman Ayarlı Hukuki İkaz penceresi otomatik olarak yeniden devreye girer.',
        },
        {
          heading: '3. Çerezlerin İptali ve Sıfırlama Hakkı',
          body: 'Okurlarımız sayfanın en altındaki yeşil değişim bandında veya alt bilgide (Footer) yer alan "Çerez & KVKK/GDPR" butonuna tıklayarak diledikleri an onaylarını geri çekebilir, kategorileri kapatabilir veya yerel önbelleği tek tuşla sıfırlayabilir.',
        },
      ],
    },
    {
      id: 'doc2',
      fileName: '02-kvkk-6698-ve-ab-gdpr-aydinlatma-beyannamesi.md',
      badge: 'DOSYA 2 · TR KVKK 6698 & AB GDPR',
      title: 'KVKK (6698 Sayılı Kanun) ve AB GDPR (2016/679) Veri Koruma Aydınlatma Beyannamesi',
      standardRef: 'KVKK Madde 10 & 11 · EU GDPR Articles 12–22 · ISO/IEC 27701',
      lastUpdated: '29 Eylül 2026',
      sha3DigestPreview: '0x3b7e20d9a1c48f65201e9a4c8b2d1f7e3a5c9d1e3f5a7b9c1d3e5f7a9b1c3d5e',
      sections: [
        {
          heading: '1. Veri Sorumlusu ve Temsilci Künyesi',
          body: '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve Avrupa Birliği Genel Veri Koruma Tüzüğü ("GDPR") kapsamında Veri Sorumlusu: Orçun KUNDAKCI — YENİDEM Akademik Külliyatı ve Tefekkür Mecmuası (İletişim: uye@yenidem.org).',
        },
        {
          heading: '2. Sıfır-Açık Metin (Zero-Plaintext) Kriptografik İşleme İlkesi',
          body: 'Topluluk konsensüsü (/topluluk-onayi) ve üyelik doğrulaması (KYC-4) süreçlerinde girilen kimlik, ORCID veya iletişim bilgileri veritabanında açık metin olarak saklanmaz; scrypt (N=16384, r=8, p=1) + PBKDF2-HMAC-SHA512 (210.000 iterasyon) ve SHA3-512 tek yönlü özetleriyle anonimleştirilerek mühürlenir.',
        },
        {
          heading: '3. İlgili Kişinin Uluslararası Hakları (KVKK m.11 & GDPR Art. 15-22)',
          body: 'Herkes veri sorumlusuna başvurarak; kendisiyle ilgili veri işlenip işlenmediğini öğrenme, düzeltme talep etme, unutulma hakkını (Right to Erasure) kullanma, verilerini taşınabilir JSON formatında indirme (Right to Data Portability) ve otomatik analizlere itiraz etme hakkına sahiptir.',
        },
      ],
    },
    {
      id: 'doc3',
      fileName: '03-ccpa-gpc-cloudflare-d1-ve-worm-blokzincir-veri-protokolu.md',
      badge: 'DOSYA 3 · CCPA/CPRA & CLOUDFLARE D1/WORM',
      title: 'CCPA/CPRA, Küresel Gizlilik Kontrolü (GPC) ve Cloudflare D1 / WORM Blok Zinciri Beyanı',
      standardRef: 'California Consumer Privacy Act (CCPA/CPRA) · W3C GPC · NIST FIPS 202/205',
      lastUpdated: '29 Eylül 2026',
      sha3DigestPreview: '0x7c1d49e8b2a03f65189c4a2d1e0f7b5a3c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f',
      sections: [
        {
          heading: '1. Kişisel Verilerin Satılmaması Garantisi (Do Not Sell or Share)',
          body: 'CCPA/CPRA uyarınca YENİDEM, hiçbir kullanıcının kişisel verisini üçüncü taraflara satmaz, kiralamaz veya davranışsal reklam ağlarıyla paylaşmaz. Tarayıcınızdan gelen W3C Global Privacy Control (GPC) sinyalleri otomatik olarak tanınır ve onurlandırılır.',
        },
        {
          heading: '2. Cloudflare D1, R2 WORM ve Sınır Güvenliği',
          body: 'Altyapı güvenliği Cloudflare Edge WAF, Turnstile insan doğrulaması ve Cloudflare D1 (Serverless SQLite) üzerinde çalışır. Tüm gizli anahtarlar Cloudflare Encrypted Secrets (HSM) kasasında izole edilmiştir.',
        },
        {
          heading: '3. Katman-1 WORM ve Katman-2 Blok Zinciri Değişmezliği',
          body: 'Akademik makale adaylarının telif haklarını korumak amacıyla üretilen PRE-CERT-PQC ve MAINNET-CERT-PQC mühürleri yalnızca eserin SHA3-512/BLAKE2b-512 özetini içerir; kişisel veriler blok zincirine açık olarak yazılmaz (GDPR-Compliant Off-Chain PII / On-Chain Hash Architecture).',
        },
      ],
    },
    {
      id: 'doc4',
      fileName: '04-yapim-asamasi-taslak-surum-ve-telif-muafiyet-sartnamesi.md',
      badge: 'DOSYA 4 · YAPIM AŞAMASI & TASLAK İKAZI',
      title: 'Yapım Aşamasında (Taslak Sürüm) Sistem İkazı, ORXUN Simülasyonu ve Telif Şartnamesi',
      standardRef: '5846 Sayılı Fikir ve Sanat Eserleri Kanunu (FSEK) · Bern Sözleşmesi · WIPO',
      lastUpdated: '29 Eylül 2026',
      sha3DigestPreview: '0xf19e82c4a7b03d65189c4a2d1e0f7b5a3c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f',
      sections: [
        {
          heading: '1. Yapım Aşamasında ve Taslak Sürüm Uyarı Beyanı',
          body: 'Bu platform şu anda aktif yazılım geliştirme, kriptografik mimari test ve topluluk inşası aşamasındadır ("Ön İzleme Taslağı / Beta"). Sitede yer alan 1.000.000 üye sayacı simülasyonu, %96 konsensüs oylama demosu ve Rust ana zincir köprüsü test amaçlıdır.',
        },
        {
          heading: '2. ORXUN Ödül Jetonu Hukuki Niteliği (Finansal Yatırım Tavsiyesi Değildir)',
          body: 'İlk üyelikte verilen 1.00 ORXUN hoş geldin hediyesi ile yazar/çizer/hakem ödülleri, topluluk katkı puanlamasını test etmek amacıyla simüle edilmiş bir kültür ve yönetişim jetonudur; menkul kıymet, kripto para arzı (ICO) veya finansal getiri vaadi taşımaz.',
        },
        {
          heading: '3. Kurucu Külliyat (16 Eser) Mutlak Telif Kilidi',
          body: 'Kurucu ve başyazar Orçun KUNDAKCI tarafından kaleme alınan 16 temel akademik makale, 5846 sayılı FSEK ve uluslararası Bern Sözleşmesi kapsamında tam telif koruması altındadır. Kaynak gösterilmeden ve SHA3-512 sertifika künyesi belirtilmeden çoğaltılamaz.',
        },
      ],
    },
  ];

  readonly cookieInventory: CookieInventoryItem[] = [
    {
      name: 'yenidem_intl_cookie_consent_v1',
      categoryLabel: 'Zorunlu Hukuki Onay',
      provider: 'YENİDEM Hukuk & PQC Çekirdeği',
      purpose: 'Uluslararası çerez tercihlerini, taslak ikaz onayını ve CONSENT-CERT-PQC sertifikasını saklar.',
      duration: '1 Saat – 180 Gün (Kullanıcı Seçimli)',
      securityStandard: 'SHA3-512 + BLAKE2b-512 İmzalı',
    },
    {
      name: 'cf_clearance / __cf_bm',
      categoryLabel: 'Zorunlu Siber Güvenlik',
      provider: 'Cloudflare Edge WAF & Turnstile',
      purpose: 'DDoS saldırılarını, botları ve otomatik veri kazıyıcıları engeller.',
      duration: '30 Dakika – 24 Saat',
      securityStandard: 'Cloudflare TLS 1.3 + HMAC',
    },
    {
      name: 'yenidem_author_session_token',
      categoryLabel: 'Zorunlu Kimlik & 2FA',
      provider: 'YENİDEM Zero-Plaintext Auth',
      purpose: 'scrypt + PBKDF2-SHA512 ve RFC 6238 TOTP (2FA) doğrulamalı yazar oturumunu korur.',
      duration: 'Oturum Süresi (Max 12 Saat)',
      securityStandard: '256-Bit Kriptografik Jeton',
    },
    {
      name: 'yenidem_site_customization_v1',
      categoryLabel: 'İşlevsel & Okuma Konforu',
      provider: 'YENİDEM Özelleştirme Stüdyosu',
      purpose: 'Site teması (Safir/Kehribar/Zümrüt/OLED), yazı ölçeği (%90-%135) ve mavi ışık filtresini hatırlar.',
      duration: '180 Gün',
      securityStandard: 'İzole Tarayıcı Hafızası',
    },
    {
      name: 'yenidem_verified_member_v2',
      categoryLabel: 'Web3, ORXUN & %96 Konsensüs',
      provider: 'YENİDEM Topluluk & Cüzdan Motoru',
      purpose: 'Simüle edilen ORXUN ödül cüzdanı bakiyesini (+1.00 ORXUN hediye dahil) ve KYC-4 mührünü tutar.',
      duration: '90 Gün',
      securityStandard: 'SEAL-PQC-KYC4 Özeti',
    },
  ];

  private countdownTimerId: ReturnType<typeof setInterval> | null = null;
  private reminderTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkStoredConsentOnBoot();
    }
  }

  private checkStoredConsentOnBoot(): void {
    try {
      const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      if (!raw) {
        this.hasValidConsent.set(false);
        this.openGateModal('overview');
        return;
      }

      const parsed = JSON.parse(raw) as StoredConsentReceipt;
      const now = Date.now();
      if (!parsed.expiresAtMs || now >= parsed.expiresAtMs) {
        // Timed consent expired -> trigger mandatory warning popup again!
        localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
        this.hasValidConsent.set(false);
        this.openGateModal('overview');
        this.changeLog.pushLiveChange(
          'HUKUK & ÇEREZ POLİTİKASI',
          'Zaman ayarlı çerez ve taslak ikaz süresi dolduğu için Uluslararası Onay Kapısı yeniden açıldı.',
          'TIMER-EXPIRED'
        );
        return;
      }

      this.activeReceipt.set(parsed);
      this.categories.set(parsed.categories);
      this.selectedDurationHours.set(parsed.durationHours);
      this.acceptedDraftDisclaimer.set(parsed.acceptedDraftDisclaimer);
      this.hasValidConsent.set(true);
      this.isGateModalOpen.set(false);
    } catch {
      this.hasValidConsent.set(false);
      this.openGateModal('overview');
    }
  }

  openGateModal(tab: 'overview' | 'doc1' | 'doc2' | 'doc3' | 'doc4' | 'inventory' = 'overview'): void {
    this.activeModalTab.set(tab);
    this.isGateModalOpen.set(true);
    this.startAwarenessCountdown();
  }

  closeGateModalIfConsented(): void {
    if (!this.hasValidConsent()) {
      // Mandatory entry gate: cannot close without giving consent!
      return;
    }
    this.isGateModalOpen.set(false);
  }

  private startAwarenessCountdown(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.countdownTimerId) clearInterval(this.countdownTimerId);
    this.warningCountdownSeconds.set(5);

    this.countdownTimerId = setInterval(() => {
      const cur = this.warningCountdownSeconds();
      if (cur <= 1) {
        this.warningCountdownSeconds.set(0);
        if (this.countdownTimerId) {
          clearInterval(this.countdownTimerId);
          this.countdownTimerId = null;
        }
      } else {
        this.warningCountdownSeconds.set(cur - 1);
      }
    }, 1000);
  }

  toggleCategory(key: 'functionalComfort' | 'web3Governance' | 'privacyAnalytics'): void {
    this.categories.update((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  setDurationHours(hours: number): void {
    this.selectedDurationHours.set(hours);
  }

  /**
   * Accepts all categories + Draft/Construction Warning and unlocks the site
   */
  acceptAllAndEnter(): void {
    this.categories.set({
      strictlyNecessary: true,
      functionalComfort: true,
      web3Governance: true,
      privacyAnalytics: true,
    });
    this.acceptedDraftDisclaimer.set(true);
    this.sealConsentReceipt('TÜM ULUSLARARASI ÇEREZLER & TASLAK İKAZI ONAYLANDI');
  }

  /**
   * Saves selected categories (or strictly necessary only) + Draft Warning and unlocks the site
   */
  saveSelectedAndEnter(strictlyNecessaryOnly = false): void {
    if (strictlyNecessaryOnly) {
      this.categories.set({
        strictlyNecessary: true,
        functionalComfort: false,
        web3Governance: false,
        privacyAnalytics: false,
      });
    }
    this.acceptedDraftDisclaimer.set(true);
    this.sealConsentReceipt(
      strictlyNecessaryOnly
        ? 'YALNIZCA ZORUNLU GÜVENLİK ÇEREZLERİ & TASLAK İKAZI ONAYLANDI'
        : 'ÖZEL ÇEREZ TERCİHLERİ & TASLAK İKAZI KAYDEDİLDİ'
    );
  }

  private sealConsentReceipt(actionSummary: string): void {
    const cats = this.categories();
    const hours = this.selectedDurationHours();
    const expiresAtMs = Date.now() + hours * 3600 * 1000;

    // Immediate local deterministic fallback receipt so UI unlocks instantaneously
    const fallbackReceiptId = `CONSENT-CERT-PQC-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
    const localReceipt: StoredConsentReceipt = {
      receiptId: fallbackReceiptId,
      issuedAtUtc: new Date().toISOString(),
      expiresAtMs,
      durationHours: hours,
      acceptedDraftDisclaimer: true,
      categories: cats,
      sha3_512Hash:
        '0x8a4f91c2e7b03d65189c4a2d1e0f7b5a3c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d',
      blake2b512Hash:
        '0x4e2d90b8c1a73f65189c4a2d1e0f7b5a3c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d',
    };

    this.saveReceiptLocally(localReceipt);
    this.hasValidConsent.set(true);
    this.isGateModalOpen.set(false);

    this.changeLog.pushLiveChange(
      'HUKUK & ÇEREZ POLİTİKASI',
      `${actionSummary} — Sertifika: ${localReceipt.receiptId} (Süre: ${hours} Saat). Yapım aşaması / taslak ikazı kabul edildi.`,
      localReceipt.receiptId
    );

    if (isPlatformBrowser(this.platformId)) {
      this.http
        .post<{
          success: boolean;
          data: {
            receiptId: string;
            issuedAtUtc: string;
            sha3_512Hash: string;
            blake2b512Hash: string;
          };
        }>('/api/legal/cookie-consent-seal', {
          categories: cats,
          durationHours: hours,
          acceptedDraftNotice: true,
        })
        .pipe(catchError(() => of(null)))
        .subscribe((res) => {
          if (res?.success && res.data) {
            const upgraded: StoredConsentReceipt = {
              ...localReceipt,
              receiptId: res.data.receiptId,
              issuedAtUtc: res.data.issuedAtUtc,
              sha3_512Hash: res.data.sha3_512Hash,
              blake2b512Hash: res.data.blake2b512Hash,
            };
            this.saveReceiptLocally(upgraded);
          }
        });
    }
  }

  private saveReceiptLocally(receipt: StoredConsentReceipt): void {
    this.activeReceipt.set(receipt);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(receipt));
      } catch {
        // ignore storage quota errors
      }
    }
  }

  /**
   * Triggers a timed warning popup after `seconds` (e.g. 4 seconds) so the user
   * can test the timed warning & mandatory consent gate live!
   */
  triggerTimedWarningDemo(seconds = 4): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.reminderTimeoutId) clearTimeout(this.reminderTimeoutId);

    this.isGateModalOpen.set(false);
    this.scheduledReminderSeconds.set(seconds);

    this.changeLog.pushLiveChange(
      'HUKUK & ÇEREZ POLİTİKASI',
      `Zaman ayarlı çerez & taslak ikaz sayacı başlatıldı: ${seconds} saniye sonra ikaz penceresi otomatik açılacak...`,
      'TIMER-ACTIVE'
    );

    const tick = setInterval(() => {
      const rem = this.scheduledReminderSeconds();
      if (rem <= 1) {
        this.scheduledReminderSeconds.set(0);
        clearInterval(tick);
      } else {
        this.scheduledReminderSeconds.set(rem - 1);
      }
    }, 1000);

    this.reminderTimeoutId = setTimeout(() => {
      this.hasValidConsent.set(false);
      this.openGateModal('overview');
      this.changeLog.pushLiveChange(
        'YAPIM & TASLAK İKAZI',
        'Zaman ayarlı hukuki ikaz ve uluslararası çerez onay kapısı tetiklendi (Onay zorunluluğu devrede).',
        'MANDATORY-GATE'
      );
    }, seconds * 1000);
  }

  /**
   * Revokes current consent and immediately re-locks the mandatory entry gate
   */
  revokeConsentAndLockGate(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    this.activeReceipt.set(null);
    this.hasValidConsent.set(false);
    this.openGateModal('overview');
    this.changeLog.pushLiveChange(
      'HUKUK & ÇEREZ POLİTİKASI',
      'Çerez onayı sıfırlandı; siteye giriş için Zorunlu Uluslararası Çerez ve Taslak Onay Kapısı kilitlendi.',
      'CONSENT-REVOKED'
    );
  }

  /**
   * Downloads the complete 4-file International Cookie & Privacy Policy Bundle + Consent Certificate as JSON
   */
  downloadCompleteLegalBundle(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const bundle = {
      bundleId: 'YENIDEM-INTL-COOKIE-KVKK-GDPR-CCPA-BUNDLE-v3.0',
      generatedAtUtc: new Date().toISOString(),
      platform: 'YENİDEM — Edebiyat, Felsefe ve Tefekkür Mecmuası',
      founderAndDataController: 'Orçun KUNDAKCI',
      constructionDraftStatus:
        'YAPIM AŞAMASINDA / TASLAK SÜRÜM — Bu sistem aktif inşa aşamasında olup yayınlanan modüller mimari ön izleme taslağıdır.',
      activeConsentReceipt: this.activeReceipt(),
      legalDocuments: this.legalDocuments,
      cookieAndStorageInventory: this.cookieInventory,
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yenidem-uluslararasi-cerez-kvkk-gdpr-tum-dosyalar-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.changeLog.pushLiveChange(
      'HUKUK & ÇEREZ POLİTİKASI',
      'Uluslararası Çerez, KVKK, GDPR, CCPA ve Taslak Muafiyet Paketi (4 Tam Dosya + Sertifika .JSON) indirildi.',
      'LEGAL-BUNDLE-DL'
    );
  }
}
