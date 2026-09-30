import {Injectable, signal, computed} from '@angular/core';

export type FontScaleLevel = '90' | '100' | '110' | '120' | '135';
export type FontFamilyMode = 'rounded' | 'dyslexic' | 'classic';
export type ContrastMode = 'default' | 'high' | 'sepia';
export type LineSpacingMode = 'normal' | 'relaxed';

const SCALE_ORDER: FontScaleLevel[] = ['90', '100', '110', '120', '135'];
const STORAGE_KEY = 'yenidem_a11y_prefs_v1';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityService {
  readonly isPanelOpen = signal<boolean>(false);
  readonly fontScale = signal<FontScaleLevel>('100');
  readonly fontMode = signal<FontFamilyMode>('rounded');
  readonly contrastMode = signal<ContrastMode>('default');
  readonly lineSpacing = signal<LineSpacingMode>('normal');
  readonly readingGuide = signal<boolean>(false);
  readonly guideY = signal<number>(280);

  readonly fontScaleLabel = computed(() => {
    const map: Record<FontScaleLevel, string> = {
      '90': '%90 Kompakt',
      '100': '%100 Standart',
      '110': '%110 Rahat',
      '120': '%120 Büyük',
      '135': '%135 Maksimum',
    };
    return map[this.fontScale()];
  });

  constructor() {
    this.loadPreferences();
  }

  togglePanel(): void {
    this.isPanelOpen.update((v) => !v);
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
  }

  setFontScale(scale: FontScaleLevel): void {
    this.fontScale.set(scale);
    this.applyDomAttributes();
    this.savePreferences();
  }

  increaseFont(): void {
    const idx = SCALE_ORDER.indexOf(this.fontScale());
    if (idx < SCALE_ORDER.length - 1) {
      this.setFontScale(SCALE_ORDER[idx + 1]);
    }
  }

  decreaseFont(): void {
    const idx = SCALE_ORDER.indexOf(this.fontScale());
    if (idx > 0) {
      this.setFontScale(SCALE_ORDER[idx - 1]);
    }
  }

  setFontMode(mode: FontFamilyMode): void {
    this.fontMode.set(mode);
    this.applyDomAttributes();
    this.savePreferences();
  }

  setContrastMode(mode: ContrastMode): void {
    this.contrastMode.set(mode);
    this.applyDomAttributes();
    this.savePreferences();
  }

  toggleLineSpacing(): void {
    this.lineSpacing.update((v) => (v === 'normal' ? 'relaxed' : 'normal'));
    this.applyDomAttributes();
    this.savePreferences();
  }

  toggleReadingGuide(): void {
    this.readingGuide.update((v) => !v);
    this.savePreferences();
  }

  updateGuidePosition(clientY: number): void {
    if (this.readingGuide()) {
      this.guideY.set(clientY);
    }
  }

  resetAll(): void {
    this.fontScale.set('100');
    this.fontMode.set('rounded');
    this.contrastMode.set('default');
    this.lineSpacing.set('normal');
    this.readingGuide.set(false);
    this.applyDomAttributes();
    this.savePreferences();
  }

  private applyDomAttributes(): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-font-scale', this.fontScale());
    root.setAttribute('data-font-mode', this.fontMode());
    root.setAttribute('data-contrast', this.contrastMode());
    root.setAttribute('data-line-spacing', this.lineSpacing());
  }

  private loadPreferences(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (SCALE_ORDER.includes(parsed.fontScale)) this.fontScale.set(parsed.fontScale);
        if (['rounded', 'dyslexic', 'classic'].includes(parsed.fontMode)) {
          this.fontMode.set(parsed.fontMode);
        }
        if (['default', 'high', 'sepia'].includes(parsed.contrastMode)) {
          this.contrastMode.set(parsed.contrastMode);
        }
        if (['normal', 'relaxed'].includes(parsed.lineSpacing)) {
          this.lineSpacing.set(parsed.lineSpacing);
        }
      }
    } catch {
      // ignore storage errors
    }
    this.applyDomAttributes();
  }

  private savePreferences(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          fontScale: this.fontScale(),
          fontMode: this.fontMode(),
          contrastMode: this.contrastMode(),
          lineSpacing: this.lineSpacing(),
        })
      );
    } catch {
      // ignore storage errors
    }
  }
}
