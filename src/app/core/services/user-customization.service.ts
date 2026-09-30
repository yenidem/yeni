import {Injectable, computed, inject, signal} from '@angular/core';
import {AccessibilityService} from './accessibility.service';
import {LayoutService} from './layout.service';
import {LiveChangeLogService} from './live-change-log.service';

export type SiteThemePalette = 'sapphire' | 'amber-parchment' | 'emerald-irfan' | 'midnight-oled';
export type SiteCardDensity = 'comfortable' | 'compact';
export type MemberContributionRole =
  | 'Yazar & Araştırmacı'
  | 'Çizer & Görsel Tasarımcı'
  | 'Metin Şerhçisi'
  | 'Topluluk Denetçisi'
  | 'Okur & Koleksiyoner';

export interface OrxunRewardMission {
  id: string;
  title: string;
  roleBadge: string;
  description: string;
  rewardAmount: number;
  icon: string;
  claimed: boolean;
}

export interface OrxunLedgerTx {
  txId: string;
  title: string;
  amount: number;
  timestamp: string;
  sha3Hash: string;
  type: 'WELCOME_GIFT' | 'AUTHOR_REWARD' | 'ILLUSTRATOR_REWARD' | 'VALIDATOR_REWARD' | 'COMMENTARY_REWARD';
}

export interface MemberProfile {
  isLoggedIn: boolean;
  displayName: string;
  username: string;
  email: string;
  role: MemberContributionRole;
  joinedAt: string;
  rustWalletAddress: string;
  kycLevel: string;
}

const CUSTOMIZATION_STORAGE_KEY = 'yenidem_site_customization_v1';

@Injectable({
  providedIn: 'root',
})
export class UserCustomizationService {
  private readonly a11y = inject(AccessibilityService);
  private readonly layout = inject(LayoutService);
  private readonly changeLog = inject(LiveChangeLogService);

  readonly isSettingsOpen = signal<boolean>(false);
  readonly activeTab = signal<'customize' | 'wallet' | 'profile'>('customize');

  // Full Site Customization Signals
  readonly siteTheme = signal<SiteThemePalette>('sapphire');
  readonly cardDensity = signal<SiteCardDensity>('comfortable');
  readonly reducedMotion = signal<boolean>(false);
  readonly showFloatingAiButton = signal<boolean>(true);
  readonly showFloatingAudioButton = signal<boolean>(true);
  readonly showPioneerRibbon = signal<boolean>(true);

  // Member Profile & Simulated ORXUN Token State
  readonly memberProfile = signal<MemberProfile>({
    isLoggedIn: true,
    displayName: 'Misafir İrfan Dostu',
    username: '@irfan_okuru',
    email: 'uye@yenidem.org',
    role: 'Yazar & Araştırmacı',
    joinedAt: '29 Eylül 2026',
    rustWalletAddress: 'orx1q9kundakci8pqc7rustbft4x90yenidem',
    kycLevel: 'Seviye-1 Başlangıç Üyesi (Simüle)',
  });

  readonly rewardMissions = signal<OrxunRewardMission[]>([
    {
      id: 'welcome-gift',
      title: 'İlk Üyelik Hoş Geldin Hediyesi',
      roleBadge: 'Yeni Üye',
      description: 'Sisteme ilk giriş ve üyelik aktivasyonunda tanımlanan 1.00 ORXUN başlangıç hatıra ve yönetişim jetonu.',
      rewardAmount: 1.0,
      icon: 'redeem',
      claimed: true,
    },
    {
      id: 'author-article',
      title: 'Yazar Ödülü: Akademik Makale & Tefekkür Sunumu',
      roleBadge: 'Yazar Katkısı',
      description: '%85 Ön Onay ve %96 Konsensüs havuzuna özgün makale veya metin şerhi gönderen yazarlara verilen telif teşviki.',
      rewardAmount: 5.0,
      icon: 'edit_note',
      claimed: false,
    },
    {
      id: 'illustrator-art',
      title: 'Çizer Ödülü: Standart Blok Zinciri Görseli / Hat Eseri',
      roleBadge: 'Çizer & Tasarım',
      description: 'Makaleler için <250KB WebP/SVG standardında özgün minyatür, hat veya kavramsal kapak görseli üreten çizer ödülü.',
      rewardAmount: 3.5,
      icon: 'brush',
      claimed: false,
    },
    {
      id: 'community-validator',
      title: 'Topluluk Denetçisi: Ön-Onay & %96 Konsensüs Hakemliği',
      roleBadge: 'Topluluk Hakemi',
      description: 'Aday eserleri inceleyip kriptografik imzayla adil oylamaya katılan doğrulanmış topluluk üyelerine verilen ödül.',
      rewardAmount: 0.5,
      icon: 'how_to_vote',
      claimed: false,
    },
    {
      id: 'couplet-commentary',
      title: 'Şerhçi Ödülü: Beyit Tahlili & Lügat Kavram Katkısı',
      roleBadge: 'Metin Şerhçisi',
      description: 'Külliyattaki makalelere veya felsefe/tasavvuf lügatına akademik kaynaklı derkenar notu düşen araştırmacı ödülü.',
      rewardAmount: 1.0,
      icon: 'menu_book',
      claimed: false,
    },
  ]);

  readonly ledgerHistory = signal<OrxunLedgerTx[]>([
    {
      txId: 'ORX-GENESIS-0001',
      title: 'İlk Üyelik Hoş Geldin Hediyesi (1.00 ORXUN)',
      amount: 1.0,
      timestamp: '29.09.2026 · 14:00',
      sha3Hash: '0x9f8e2a4b7c1d6e5f3a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      type: 'WELCOME_GIFT',
    },
  ]);

  readonly orxunBalance = computed(() =>
    this.ledgerHistory().reduce((sum, tx) => sum + tx.amount, 0)
  );

  readonly toastMessage = signal<string | null>(null);

  constructor() {
    this.loadFromStorage();
  }

  openSettings(tab: 'customize' | 'wallet' | 'profile' = 'customize'): void {
    this.activeTab.set(tab);
    this.isSettingsOpen.set(true);
  }

  closeSettings(): void {
    this.isSettingsOpen.set(false);
  }

  toggleSettings(): void {
    this.isSettingsOpen.update((v) => !v);
  }

  setSiteTheme(theme: SiteThemePalette): void {
    this.siteTheme.set(theme);
    this.applyDomCustomization();
    this.saveToStorage();
    const themeLabel =
      theme === 'sapphire'
        ? 'Asil Safir & Gece Mavisi'
        : theme === 'amber-parchment'
          ? 'Horasan Kehribarı & Parşömen'
          : theme === 'emerald-irfan'
            ? 'Zümrüt Kubbe & İrfan Yeşili'
            : 'Tam Karartma OLED Gece';
    this.changeLog.pushLiveChange(
      'ORXUN & ÖZELLEŞTİRME',
      `Site görünüm atmosferi "${themeLabel}" olarak güncellendi ve yerel hafızaya mühürlendi.`,
      `THEME-${theme.toUpperCase()}`
    );
  }

  setCardDensity(density: SiteCardDensity): void {
    this.cardDensity.set(density);
    this.applyDomCustomization();
    this.saveToStorage();
  }

  toggleReducedMotion(): void {
    this.reducedMotion.update((v) => !v);
    this.applyDomCustomization();
    this.saveToStorage();
  }

  toggleFloatingAiButton(): void {
    this.showFloatingAiButton.update((v) => !v);
    if (!this.showFloatingAiButton()) {
      this.layout.isAiGuideOpen.set(false);
    }
    this.saveToStorage();
  }

  toggleFloatingAudioButton(): void {
    this.showFloatingAudioButton.update((v) => !v);
    if (!this.showFloatingAudioButton()) {
      this.layout.isAudioDeckOpen.set(false);
    }
    this.saveToStorage();
  }

  togglePioneerRibbon(): void {
    this.showPioneerRibbon.update((v) => !v);
    this.saveToStorage();
  }

  updateMemberProfile(partial: Partial<MemberProfile>): void {
    this.memberProfile.update((curr) => ({
      ...curr,
      ...partial,
      isLoggedIn: true,
    }));
    // Ensure welcome gift is granted if not already
    const welcome = this.rewardMissions().find((m) => m.id === 'welcome-gift');
    if (welcome && !welcome.claimed) {
      this.claimMissionReward('welcome-gift');
    }
    this.saveToStorage();
    this.showNotification('Üye profili ve ORXUN cüzdan ayarları güncellendi.');
  }

  claimMissionReward(missionId: string): void {
    const mission = this.rewardMissions().find((m) => m.id === missionId);
    if (!mission || mission.claimed) return;

    this.rewardMissions.update((list) =>
      list.map((m) => (m.id === missionId ? {...m, claimed: true} : m))
    );

    const now = new Date();
    const timeStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} · ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const randomHex = Array.from({length: 40}, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newTx: OrxunLedgerTx = {
      txId: `ORX-TX-${Math.floor(1000 + Math.random() * 9000)}`,
      title: mission.title,
      amount: mission.rewardAmount,
      timestamp: timeStr,
      sha3Hash: `0x${randomHex}`,
      type:
        missionId === 'welcome-gift'
          ? 'WELCOME_GIFT'
          : missionId === 'author-article'
            ? 'AUTHOR_REWARD'
            : missionId === 'illustrator-art'
              ? 'ILLUSTRATOR_REWARD'
              : missionId === 'community-validator'
                ? 'VALIDATOR_REWARD'
                : 'COMMENTARY_REWARD',
    };

    this.ledgerHistory.update((txs) => [newTx, ...txs]);
    this.saveToStorage();
    this.showNotification(`+${mission.rewardAmount.toFixed(2)} ORXUN Token simüle cüzdanınıza tanımlandı!`);
    this.changeLog.pushLiveChange(
      'ORXUN & ÖZELLEŞTİRME',
      `ORXUN Ödül Dağıtımı: "${mission.title}" kapsamında +${mission.rewardAmount.toFixed(2)} ORXUN simüle cüzdana eklendi (${newTx.txId}).`,
      newTx.txId
    );
  }

  resetAllCustomizations(): void {
    this.siteTheme.set('sapphire');
    this.cardDensity.set('comfortable');
    this.reducedMotion.set(false);
    this.showFloatingAiButton.set(true);
    this.showFloatingAudioButton.set(true);
    this.showPioneerRibbon.set(true);
    this.a11y.resetAll();
    this.applyDomCustomization();
    this.saveToStorage();
    this.showNotification('Tüm site görünüm ve okuma ayarları varsayılana sıfırlandı.');
  }

  private showNotification(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set(null);
      }
    }, 3500);
  }

  applyDomCustomization(): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-site-theme', this.siteTheme());
    root.setAttribute('data-card-density', this.cardDensity());
    root.setAttribute('data-reduced-motion', this.reducedMotion() ? 'true' : 'false');
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(CUSTOMIZATION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (['sapphire', 'amber-parchment', 'emerald-irfan', 'midnight-oled'].includes(parsed.siteTheme)) {
          this.siteTheme.set(parsed.siteTheme);
        }
        if (['comfortable', 'compact'].includes(parsed.cardDensity)) {
          this.cardDensity.set(parsed.cardDensity);
        }
        if (typeof parsed.reducedMotion === 'boolean') {
          this.reducedMotion.set(parsed.reducedMotion);
        }
        if (typeof parsed.showFloatingAiButton === 'boolean') {
          this.showFloatingAiButton.set(parsed.showFloatingAiButton);
        }
        if (typeof parsed.showFloatingAudioButton === 'boolean') {
          this.showFloatingAudioButton.set(parsed.showFloatingAudioButton);
        }
        if (typeof parsed.showPioneerRibbon === 'boolean') {
          this.showPioneerRibbon.set(parsed.showPioneerRibbon);
        }
        if (parsed.memberProfile) {
          this.memberProfile.set(parsed.memberProfile);
        }
        if (Array.isArray(parsed.rewardMissions) && parsed.rewardMissions.length > 0) {
          this.rewardMissions.set(parsed.rewardMissions);
        }
        if (Array.isArray(parsed.ledgerHistory) && parsed.ledgerHistory.length > 0) {
          this.ledgerHistory.set(parsed.ledgerHistory);
        }
      }
    } catch {
      // Ignore storage parse errors
    }
    this.applyDomCustomization();
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(
        CUSTOMIZATION_STORAGE_KEY,
        JSON.stringify({
          siteTheme: this.siteTheme(),
          cardDensity: this.cardDensity(),
          reducedMotion: this.reducedMotion(),
          showFloatingAiButton: this.showFloatingAiButton(),
          showFloatingAudioButton: this.showFloatingAudioButton(),
          showPioneerRibbon: this.showPioneerRibbon(),
          memberProfile: this.memberProfile(),
          rewardMissions: this.rewardMissions(),
          ledgerHistory: this.ledgerHistory(),
        })
      );
    } catch {
      // Ignore storage write errors
    }
  }
}
