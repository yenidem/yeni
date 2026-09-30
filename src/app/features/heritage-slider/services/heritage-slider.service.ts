import {Injectable, PLATFORM_ID, computed, inject, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {catchError, of} from 'rxjs';
import {HERITAGE_SLIDES_DATA} from '../data/heritage-slides.data';
import {HeritageCategory, HeritageQuote, HeritageSlide} from '../models/heritage-slide.model';

interface HeritageSlidesResponse {
  success: boolean;
  count: number;
  slides: HeritageSlide[];
}

@Injectable({
  providedIn: 'root',
})
export class HeritageSliderService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);

  readonly slides = signal<HeritageSlide[]>(HERITAGE_SLIDES_DATA);
  readonly activeSlideIndex = signal<number>(0);
  readonly activeQuoteIndex = signal<number>(0);
  readonly isAutoPlay = signal<boolean>(true);
  readonly activeCategoryFilter = signal<'all' | HeritageCategory>('all');

  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;

  readonly filteredSlides = computed<HeritageSlide[]>(() => {
    const filter = this.activeCategoryFilter();
    const all = this.slides();
    if (filter === 'all') return all;
    return all.filter((s) => s.category === filter);
  });

  readonly currentSlide = computed<HeritageSlide>(() => {
    const list = this.filteredSlides();
    const idx = this.activeSlideIndex();
    return list[idx] || list[0] || HERITAGE_SLIDES_DATA[0];
  });

  readonly currentQuote = computed<HeritageQuote>(() => {
    const slide = this.currentSlide();
    const qIdx = this.activeQuoteIndex();
    return slide.quotes[qIdx] || slide.quotes[0];
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.syncFromApi();
      this.startAutoPlay();
    }
  }

  syncFromApi(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<HeritageSlidesResponse>('/api/heritage-slides')
      .pipe(catchError(() => of(null)))
      .subscribe((res) => {
        if (res?.success && Array.isArray(res.slides) && res.slides.length > 0) {
          this.slides.set(res.slides);
        }
      });
  }

  selectSlide(index: number): void {
    const list = this.filteredSlides();
    if (index >= 0 && index < list.length) {
      this.activeSlideIndex.set(index);
      this.activeQuoteIndex.set(0);
    }
  }

  selectSlideById(id: string): void {
    this.activeCategoryFilter.set('all');
    const idx = this.slides().findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.activeSlideIndex.set(idx);
      this.activeQuoteIndex.set(0);
    }
  }

  setCategoryFilter(category: 'all' | HeritageCategory): void {
    this.activeCategoryFilter.set(category);
    this.activeSlideIndex.set(0);
    this.activeQuoteIndex.set(0);
  }

  nextSlide(): void {
    const len = this.filteredSlides().length;
    if (len === 0) return;
    this.activeSlideIndex.update((i) => (i + 1) % len);
    this.activeQuoteIndex.set(0);
  }

  prevSlide(): void {
    const len = this.filteredSlides().length;
    if (len === 0) return;
    this.activeSlideIndex.update((i) => (i - 1 + len) % len);
    this.activeQuoteIndex.set(0);
  }

  nextQuoteInSlide(): void {
    const quotesLen = this.currentSlide().quotes.length;
    if (quotesLen <= 1) return;
    this.activeQuoteIndex.update((i) => (i + 1) % quotesLen);
  }

  selectQuoteInSlide(qIdx: number): void {
    const quotesLen = this.currentSlide().quotes.length;
    if (qIdx >= 0 && qIdx < quotesLen) {
      this.activeQuoteIndex.set(qIdx);
    }
  }

  toggleAutoPlay(): void {
    const next = !this.isAutoPlay();
    this.isAutoPlay.set(next);
    if (next) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }

  pauseOnHover(): void {
    this.stopAutoPlay();
  }

  resumeAfterHover(): void {
    if (this.isAutoPlay()) {
      this.startAutoPlay();
    }
  }

  private startAutoPlay(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      if (this.isAutoPlay()) {
        this.nextSlide();
      }
    }, 8500);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }
}
