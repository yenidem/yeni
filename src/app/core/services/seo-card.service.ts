import {Injectable, inject, signal} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {AcademicArticle, DISCIPLINE_DEFINITIONS} from '../models/article.model';

export interface SharePayload {
  title: string;
  subtitle?: string;
  summary: string;
  url?: string;
  quote?: string;
  hashtags?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class SeoCardService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);

  readonly isBusinessCardOpen = signal<boolean>(false);
  readonly lastCopiedToast = signal<string | null>(null);

  toggleBusinessCard(): void {
    this.isBusinessCardOpen.update((v) => !v);
  }

  openBusinessCard(): void {
    this.isBusinessCardOpen.set(true);
  }

  closeBusinessCard(): void {
    this.isBusinessCardOpen.set(false);
  }

  getOriginUrl(): string {
    if (typeof window !== 'undefined' && window.location) {
      return window.location.origin;
    }
    return 'https://yenidem.org';
  }

  getCurrentUrl(path?: string): string {
    const origin = this.getOriginUrl();
    if (path) {
      return path.startsWith('http') ? path : `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
    }
    if (typeof window !== 'undefined' && window.location) {
      return window.location.href;
    }
    return origin;
  }

  /**
   * Updates the page's OpenGraph & Twitter Digital Business Card metadata
   */
  setSiteBusinessCardMeta(): void {
    const fullTitle = 'YENİDEM – Edebiyat, Felsefe ve Tefekkür Mecmuası | Orçun Kundakcı';
    const desc =
      'Orçun Kundakcı Akademik Külliyatı: Cumhuriyet Aydınlanması, Hünkâr Hacı Bektâş-ı Velî İrfanı, Türk Dili ve Edebiyatı ile Felsefe disiplinlerinde SHA-512 mühürlü akademik makaleler, beyit şerhleri ve tefekkür kürsüsü.';
    const origin = this.getOriginUrl();
    const ogImg = `${origin}/api/og-card.svg`;

    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({name: 'description', content: desc});
    this.meta.updateTag({property: 'og:title', content: fullTitle});
    this.meta.updateTag({property: 'og:description', content: desc});
    this.meta.updateTag({property: 'og:url', content: origin});
    this.meta.updateTag({property: 'og:image', content: ogImg});
    this.meta.updateTag({name: 'twitter:title', content: fullTitle});
    this.meta.updateTag({name: 'twitter:description', content: desc});
    this.meta.updateTag({name: 'twitter:image', content: ogImg});
  }

  setArticleBusinessCardMeta(article: AcademicArticle): void {
    const disc = DISCIPLINE_DEFINITIONS[article.discipline]?.label || 'Akademik İnceleme';
    const fullTitle = `${article.title} | Orçun Kundakcı – YENİDEM`;
    const desc = `${article.abstract} (${disc} • SHA-512 Mühürlü Akademik Makale)`;
    const url = this.getCurrentUrl(`/makale/${article.id}`);
    const ogImg = `${this.getOriginUrl()}/api/og-card.svg?title=${encodeURIComponent(
      article.title
    )}&discipline=${encodeURIComponent(disc)}`;

    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({name: 'description', content: desc});
    this.meta.updateTag({property: 'og:title', content: fullTitle});
    this.meta.updateTag({property: 'og:description', content: desc});
    this.meta.updateTag({property: 'og:url', content: url});
    this.meta.updateTag({property: 'og:image', content: ogImg});
    this.meta.updateTag({name: 'twitter:title', content: fullTitle});
    this.meta.updateTag({name: 'twitter:description', content: desc});
    this.meta.updateTag({name: 'twitter:image', content: ogImg});
  }

  buildFormattedShareText(payload: SharePayload): string {
    const targetUrl = this.getCurrentUrl(payload.url);
    const quoteLine = payload.quote ? `\n\n“${payload.quote}”` : '';
    const tags =
      payload.hashtags && payload.hashtags.length > 0
        ? `\n\n${payload.hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}`
        : '\n\n#YENİDEM #OrçunKundakcı #Edebiyat #Felsefe #Anadoluİrfanı';

    return `🏛️ ${payload.title}${payload.subtitle ? ' — ' + payload.subtitle : ''}${quoteLine}\n\n📖 ${payload.summary}\n\n🔗 Bağlantı: ${targetUrl}${tags}`;
  }

  getWhatsAppShareUrl(payload: SharePayload): string {
    const text = this.buildFormattedShareText(payload);
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }

  getXShareUrl(payload: SharePayload): string {
    const targetUrl = this.getCurrentUrl(payload.url);
    const quoteSnippet = payload.quote ? ` “${payload.quote.slice(0, 90)}”` : '';
    const text = `🏛️ ${payload.title}${quoteSnippet} — Orçun KUNDAKCI | YENİDEM Mecmuası`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
      targetUrl
    )}`;
  }

  getLinkedInShareUrl(payload: SharePayload): string {
    const targetUrl = this.getCurrentUrl(payload.url);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(targetUrl)}`;
  }

  getTelegramShareUrl(payload: SharePayload): string {
    const targetUrl = this.getCurrentUrl(payload.url);
    const text = `🏛️ ${payload.title}\n${payload.summary}`;
    return `https://t.me/share/url?url=${encodeURIComponent(targetUrl)}&text=${encodeURIComponent(text)}`;
  }

  async copyShareCardText(payload: SharePayload): Promise<boolean> {
    const text = this.buildFormattedShareText(payload);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      this.showToast('Kartvizit ve bağlantı panoya kopyalandı!');
      return true;
    }
    return false;
  }

  async copyDirectLink(url?: string): Promise<boolean> {
    const targetUrl = this.getCurrentUrl(url);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(targetUrl);
      this.showToast('Sayfa bağlantısı kopyalandı!');
      return true;
    }
    return false;
  }

  async shareNativeOrCopy(payload: SharePayload): Promise<void> {
    const targetUrl = this.getCurrentUrl(payload.url);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: payload.title,
          text: `${payload.title} — ${payload.summary}`,
          url: targetUrl,
        });
        return;
      } catch {
        // user cancelled or fallback
      }
    }
    await this.copyShareCardText(payload);
  }

  private showToast(msg: string): void {
    this.lastCopiedToast.set(msg);
    setTimeout(() => {
      if (this.lastCopiedToast() === msg) {
        this.lastCopiedToast.set(null);
      }
    }, 2800);
  }
}
