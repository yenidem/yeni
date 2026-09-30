import {Injectable, PLATFORM_ID, computed, inject, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {catchError, of, tap} from 'rxjs';
import {AcademicArticle} from '../models/article.model';

export type EyeComfortTheme = 'parchment' | 'eink' | 'sapphire' | 'oled';
export type ReaderColumnWidth = 'narrow' | 'standard' | 'wide';
export type ReaderLineHeight = 'normal' | 'relaxed' | 'spacious';
export type ReaderFontChoice = 'studio-sans' | 'classic-serif' | 'dyslexic';

export interface MediaStandardValidationResult {
  valid: boolean;
  standardizedUrl: string;
  aspectRatio: '16:9';
  dimensions: string;
  byteSizeKb: number;
  maxAllowedKb: number;
  quotaStatus: string;
  securityChecks: {
    mimeVerified: boolean;
    magicBytesValid: boolean;
    exifStripped: boolean;
    steganographyClean: boolean;
    svgScriptSanitized: boolean;
  };
  aiModeration: {
    passed: boolean;
    academicRelevanceScore: number;
    copyrightClearanceScore: number;
    verdict: string;
  };
  pqcMediaSeal: {
    sha3_512: string;
    blake2b512: string;
    mediaCertId: string;
    sealedAtUtc: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ReaderComfortService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'yenidem_reader_comfort_v1';

  /** Currently open article in the Full-Screen Eye-Comfort Zen Reader */
  readonly activeReaderArticle = signal<AcademicArticle | null>(null);
  readonly isReaderOpen = computed(() => this.activeReaderArticle() !== null);

  /** Eye-Comfort Settings */
  readonly theme = signal<EyeComfortTheme>('parchment');
  readonly fontSizePx = signal<number>(19);
  readonly lineHeightMode = signal<ReaderLineHeight>('relaxed');
  readonly columnWidth = signal<ReaderColumnWidth>('standard');
  readonly fontChoice = signal<ReaderFontChoice>('studio-sans');
  readonly blueLightShieldPercent = signal<number>(15);
  readonly showAnnotations = signal<boolean>(true);
  readonly readingProgress = signal<number>(0);

  /** Blockchain Media Standardization & AI Audit State */
  readonly mediaValidationReport = signal<MediaStandardValidationResult | null>(null);
  readonly mediaAuditLoading = signal<boolean>(false);

  readonly lineHeightNumeric = computed(() => {
    const mode = this.lineHeightMode();
    if (mode === 'normal') return 1.75;
    if (mode === 'spacious') return 2.2;
    return 1.95;
  });

  readonly maxWidthClass = computed(() => {
    const w = this.columnWidth();
    if (w === 'narrow') return 'max-w-2xl';
    if (w === 'wide') return 'max-w-5xl';
    return 'max-w-4xl';
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.theme) this.theme.set(parsed.theme);
          if (parsed.fontSizePx) this.fontSizePx.set(parsed.fontSizePx);
          if (parsed.lineHeightMode) this.lineHeightMode.set(parsed.lineHeightMode);
          if (parsed.columnWidth) this.columnWidth.set(parsed.columnWidth);
          if (parsed.fontChoice) this.fontChoice.set(parsed.fontChoice);
          if (typeof parsed.blueLightShieldPercent === 'number') {
            this.blueLightShieldPercent.set(parsed.blueLightShieldPercent);
          }
        }
      } catch {
        // ignore storage errors
      }
    }
  }

  openArticleInComfortReader(article: AcademicArticle): void {
    this.activeReaderArticle.set(article);
    this.readingProgress.set(0);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeComfortReader(): void {
    this.activeReaderArticle.set(null);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  setTheme(t: EyeComfortTheme): void {
    this.theme.set(t);
    this.persist();
  }

  adjustFontSize(delta: number): void {
    const next = Math.min(28, Math.max(15, this.fontSizePx() + delta));
    this.fontSizePx.set(next);
    this.persist();
  }

  setLineHeight(mode: ReaderLineHeight): void {
    this.lineHeightMode.set(mode);
    this.persist();
  }

  setColumnWidth(width: ReaderColumnWidth): void {
    this.columnWidth.set(width);
    this.persist();
  }

  setFontChoice(font: ReaderFontChoice): void {
    this.fontChoice.set(font);
    this.persist();
  }

  setBlueLightShield(pct: number): void {
    this.blueLightShieldPercent.set(Math.min(45, Math.max(0, pct)));
    this.persist();
  }

  validateAndSealMediaStandard(payload: {
    imageUrl: string;
    caption: string;
    articleTitle: string;
    byteSizeKb?: number;
  }) {
    this.mediaAuditLoading.set(true);
    return this.http
      .post<{success: boolean; data: MediaStandardValidationResult}>('/api/media/validate-and-seal', payload)
      .pipe(
        tap((res) => {
          this.mediaAuditLoading.set(false);
          if (res?.success && res.data) {
            this.mediaValidationReport.set(res.data);
          }
        }),
        catchError(() => {
          this.mediaAuditLoading.set(false);
          return of(null);
        })
      );
  }

  private persist(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({
          theme: this.theme(),
          fontSizePx: this.fontSizePx(),
          lineHeightMode: this.lineHeightMode(),
          columnWidth: this.columnWidth(),
          fontChoice: this.fontChoice(),
          blueLightShieldPercent: this.blueLightShieldPercent(),
        })
      );
    } catch {
      // ignore
    }
  }
}
