import {Injectable, signal} from '@angular/core';

export interface UniversalSharePayload {
  type: 'site-kartvizit' | 'content';
  badge: string;
  title: string;
  subtitle: string;
  quoteOrSummary: string;
  authorOrSource: string;
  urlPath: string;
  hashtags: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CardVizitService {
  readonly isOpen = signal<boolean>(false);

  readonly defaultSiteKartvizit: UniversalSharePayload = {
    type: 'site-kartvizit',
    badge: 'DİJİTAL AKADEMİK KÜNYE & SİTE KARTVİZİTİ',
    title: 'YENİDEM — Edebiyat, Felsefe ve Tefekkür Mecmuası',
    subtitle: 'Orçun KUNDAKCI Akademik Külliyatı · Cumhuriyet Aydınlanması & Anadolu İrfan Kürsüsü',
    quoteOrSummary:
      '“Hayatta en hakiki mürşit ilimdir, fendir.” — Gazi Mustafa Kemal Atatürk  |  “İlimden gidilmeyen yolun sonu karanlıktır; incinsen de incitme.” — Hünkâr Hacı Bektâş-ı Velî',
    authorOrSource: 'Orçun KUNDAKCI · TDE & Felsefe Araştırmaları (SHA-512 Mühürlü Külliyat)',
    urlPath: '/',
    hashtags: ['YENİDEM', 'Edebiyat', 'Felsefe', 'Atatürk', 'HacıBektaşVeli', 'OrçunKundakcı'],
  };

  readonly activePayload = signal<UniversalSharePayload>(this.defaultSiteKartvizit);

  openSiteKartvizit(): void {
    this.activePayload.set(this.defaultSiteKartvizit);
    this.isOpen.set(true);
  }

  openContentShare(payload: Partial<UniversalSharePayload> & {title: string}): void {
    this.activePayload.set({
      type: payload.type || 'content',
      badge: payload.badge || 'YENİDEM AKADEMİK KÜRSÜ PAYLAŞIMI',
      title: payload.title,
      subtitle: payload.subtitle || 'YENİDEM — Edebiyat, Felsefe ve Tefekkür Mecmuası',
      quoteOrSummary: payload.quoteOrSummary || '',
      authorOrSource: payload.authorOrSource || 'Orçun KUNDAKCI Akademik Külliyatı',
      urlPath: payload.urlPath || '/',
      hashtags: payload.hashtags || ['YENİDEM', 'Edebiyat', 'Felsefe', 'Anadoluİrfanı'],
    });
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  getFullShareUrl(path = '/'): string {
    if (typeof window === 'undefined') {
      return `https://yenidem.org${path}`;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${window.location.origin}${cleanPath}`;
  }
}
