import {Injectable, PLATFORM_ID, computed, inject, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

export interface LiveChangeItem {
  id: string;
  category:
    | 'YAPIM & TASLAK İKAZI'
    | 'CLOUDFLARE D1 & GÜVENLİK'
    | 'HUKUK & ÇEREZ POLİTİKASI'
    | 'ORXUN & ÖZELLEŞTİRME'
    | '%96 KONSENSÜS & WORM'
    | 'ANLIK DEĞİŞİM';
  headline: string;
  timestampLabel: string;
  hashBadge: string;
  isLiveEvent?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LiveChangeLogService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly items = signal<LiveChangeItem[]>([
    {
      id: 'chg-draft-1',
      category: 'YAPIM & TASLAK İKAZI',
      headline:
        'UYARI: YENİDEM şu anda aktif yapım ve mimari inşa aşamasındadır — Bu sürüm topluluk ve blok zinciri entegrasyonu öncesi canlı ön izleme taslağıdır.',
      timestampLabel: 'Sabit İkaz',
      hashBadge: 'DRAFT-PREVIEW-v2.5',
    },
    {
      id: 'chg-cf-2',
      category: 'CLOUDFLARE D1 & GÜVENLİK',
      headline:
        'Cloudflare D1 (Edge SQLite) 6 tablolu veritabanı şeması, R2 WORM medya kasası ve Sıfır-Açık Şifre (scrypt + PBKDF2-SHA512 + 2FA) mimarisi bağlandı.',
      timestampLabel: 'Son Güncelleme',
      hashBadge: 'CODE-DESIGN-CERT-PQC',
    },
    {
      id: 'chg-cookie-3',
      category: 'HUKUK & ÇEREZ POLİTİKASI',
      headline:
        'Uluslararası Çerez Politikası (KVKK 6698, AB GDPR, ePrivacy, CCPA) tüm hukuki dosyalarıyla ve zaman ayarlı zorunlu onay kapısıyla devreye alındı.',
      timestampLabel: 'Son Güncelleme',
      hashBadge: 'INTL-GDPR-KVKK-v3.0',
    },
    {
      id: 'chg-github-4',
      category: 'CLOUDFLARE D1 & GÜVENLİK',
      headline:
        'GitHub CODEOWNERS dal kilidi ve deterministik CI/CD derleme hattı aktif edildi; site tasarımı (styles.css) ve 16 kurucu eser SHA3-512 ile mühürlendi.',
      timestampLabel: 'Sistem Kaydı',
      hashBadge: 'SHA3-512-AST-LOCK',
    },
    {
      id: 'chg-orxun-5',
      category: 'ORXUN & ÖZELLEŞTİRME',
      headline:
        'Kullanıcı Paneli, Tam Site Özelleştirme Stüdyosu ve ilk üyeliğe +1.00 ORXUN hediye veren yazar/çizer ödül ekonomisi simülasyonu başlatıldı.',
      timestampLabel: 'Sistem Kaydı',
      hashBadge: 'ORXUN-GENESIS-1.0',
    },
    {
      id: 'chg-worm-6',
      category: '%96 KONSENSÜS & WORM',
      headline:
        'Aday makaleler için oylama öncesi Katman-1 WORM Emanet Sertifikası (PRE-CERT-PQC), 1.000.000 üye tabanı ve %96 süper çoğunluk çekirdeği aktif.',
      timestampLabel: 'Sistem Kaydı',
      hashBadge: 'PQC-WORM-96BFT',
    },
  ]);

  readonly activeIndex = signal<number>(0);
  readonly isPaused = signal<boolean>(false);
  readonly isLogDrawerOpen = signal<boolean>(false);
  readonly flashIndicator = signal<boolean>(false);

  readonly currentItem = computed<LiveChangeItem>(() => {
    const list = this.items();
    const idx = this.activeIndex();
    return list[idx] || list[0];
  });

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.startTicker();
    }
  }

  private startTicker(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (!this.isPaused() && !this.isLogDrawerOpen()) {
        this.next();
      }
    }, 6500);
  }

  next(): void {
    const len = this.items().length;
    if (len === 0) return;
    this.activeIndex.update((i) => (i + 1) % len);
  }

  prev(): void {
    const len = this.items().length;
    if (len === 0) return;
    this.activeIndex.update((i) => (i - 1 + len) % len);
  }

  togglePause(): void {
    this.isPaused.update((p) => !p);
  }

  toggleLogDrawer(): void {
    this.isLogDrawerOpen.update((open) => !open);
  }

  /**
   * Pushes a real-time change event to the top of the green breaking-news ticker
   * and immediately displays it to the user.
   */
  pushLiveChange(
    category: LiveChangeItem['category'],
    headline: string,
    hashBadge = 'LIVE-SHA3-SYNC'
  ): void {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newItem: LiveChangeItem = {
      id: `live-${Date.now()}`,
      category,
      headline,
      timestampLabel: `Az Önce (${timeStr})`,
      hashBadge,
      isLiveEvent: true,
    };

    this.items.update((list) => [newItem, ...list.slice(0, 14)]);
    this.activeIndex.set(0);
    this.flashIndicator.set(true);

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.flashIndicator.set(false);
      }, 4500);
    }
  }
}
