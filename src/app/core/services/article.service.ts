import {Injectable, PLATFORM_ID, inject, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap, catchError, of} from 'rxjs';
import {AcademicArticle, DisciplineType, BlockchainCertificate} from '../models/article.model';
import {INITIAL_ARTICLES} from '../constants/initial-articles';
import {SecurityService} from './security.service';

export interface ArticlesResponse {
  success: boolean;
  count: number;
  data: AcademicArticle[];
}

export interface SingleArticleResponse {
  success: boolean;
  data: AcademicArticle;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly securityService = inject(SecurityService);

  // Master local store initialized with all authentic articles
  private readonly masterArticles = signal<AcademicArticle[]>(INITIAL_ARTICLES);

  // Reactive State for UI
  readonly articles = signal<AcademicArticle[]>(INITIAL_ARTICLES);
  readonly currentArticle = signal<AcademicArticle | null>(null);
  readonly selectedDiscipline = signal<DisciplineType | 'all'>('all');
  readonly searchQuery = signal<string>('');
  readonly activeCategoryName = signal<string | null>(null);
  readonly activeCategoryDescription = signal<string | null>(null);
  readonly centerStageView = signal<'dashboard' | 'category' | 'ataturk-bektas' | 'mirat-irfan'>('dashboard');
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor() {
    // Initial local filter & sync with server
    this.applyLocalFilter();
    if (isPlatformBrowser(this.platformId)) {
      this.syncFromServer();
    }
  }

  /**
   * Opens a specific Right-Sidebar category or discipline directly in the Center Stage
   */
  openCategoryInCenter(params: {
    discipline: DisciplineType | 'all';
    query?: string;
    title: string;
    description: string;
  }): void {
    this.selectedDiscipline.set(params.discipline);
    this.searchQuery.set(params.query || '');
    this.activeCategoryName.set(params.title);
    this.activeCategoryDescription.set(params.description);
    this.centerStageView.set('category');
    this.applyLocalFilter();

    if (typeof window !== 'undefined') {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }

  resetToMainDashboard(): void {
    this.selectedDiscipline.set('all');
    this.searchQuery.set('');
    this.activeCategoryName.set(null);
    this.activeCategoryDescription.set(null);
    this.centerStageView.set('dashboard');
    this.applyLocalFilter();
  }

  /**
   * Syncs latest articles from the Express backend API and updates the local store
   */
  syncFromServer(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.http.get<ArticlesResponse>('/api/articles').pipe(
      catchError((err) => {
        console.warn('Backend /api/articles sync error, using local master articles:', err);
        return of(null);
      }),
    ).subscribe((res) => {
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        this.masterArticles.set(res.data);
        this.applyLocalFilter();
      }
    });
  }

  /**
   * Loads/filters articles by discipline and search query in 0ms without HTTP flicker
   */
  loadArticles(discipline?: DisciplineType | 'all', search?: string): Observable<ArticlesResponse | null> {
    if (discipline !== undefined) {
      this.selectedDiscipline.set(discipline);
    }
    if (search !== undefined) {
      this.searchQuery.set(search);
    }
    if ((discipline && discipline !== 'all') || (search && search.trim())) {
      if (this.centerStageView() === 'dashboard' && !this.activeCategoryName()) {
        this.centerStageView.set('category');
      }
    } else {
      this.activeCategoryName.set(null);
      this.activeCategoryDescription.set(null);
    }

    this.applyLocalFilter();
    return of({
      success: true,
      count: this.articles().length,
      data: this.articles(),
    });
  }

  /**
   * Local instant search and discipline filter (supports '|' multi-keyword OR queries)
   */
  private applyLocalFilter(): void {
    const discipline = this.selectedDiscipline();
    const rawQuery = this.searchQuery().toLowerCase().trim();

    let list = [...this.masterArticles()];

    if (discipline && discipline !== 'all') {
      list = list.filter((a) => a.discipline === discipline);
    }

    if (rawQuery) {
      const terms = rawQuery
        .split('|')
        .map((t) => t.trim())
        .filter(Boolean);

      list = list.filter((a) => {
        const haystack = [
          a.title,
          a.subtitle || '',
          a.abstract,
          ...(a.keywords || []),
          a.content || '',
        ]
          .join(' ')
          .toLowerCase();

        return terms.some((term) => haystack.includes(term));
      });
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    this.articles.set(list);
    this.loading.set(false);
  }

  /**
   * Fetches single article by ID or slug with instant fallback
   */
  getArticle(idOrSlug: string): Observable<SingleArticleResponse | null> {
    // 1. Immediately provide from local cache if found
    const cached = this.masterArticles().find((a) => a.id === idOrSlug || a.slug === idOrSlug);
    if (cached) {
      this.currentArticle.set(cached);
    }

    return this.http.get<SingleArticleResponse>(`/api/articles/${idOrSlug}`).pipe(
      tap((res) => {
        if (res && res.success && res.data) {
          this.currentArticle.set(res.data);
          // Update in master cache
          this.masterArticles.update((list) =>
            list.map((item) => (item.id === res.data.id ? res.data : item)),
          );
        }
        this.loading.set(false);
      }),
      catchError((err) => {
        console.warn('Error fetching article from server:', err);
        if (!cached) {
          this.error.set('Makale bulunamadı.');
        }
        this.loading.set(false);
        return of(cached ? {success: true, data: cached} : null);
      }),
    );
  }

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.securityService.authToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  createArticle(articleData: Partial<AcademicArticle>): Observable<SingleArticleResponse> {
    this.loading.set(true);
    return this.http.post<SingleArticleResponse>('/api/articles', articleData, {headers: this.getAuthHeaders()}).pipe(
      tap((res) => {
        if (res && res.success && res.data) {
          this.masterArticles.update((list) => [res.data, ...list]);
          this.applyLocalFilter();
        }
        this.loading.set(false);
      }),
    );
  }

  updateArticle(id: string, articleData: Partial<AcademicArticle>): Observable<SingleArticleResponse> {
    this.loading.set(true);
    return this.http.put<SingleArticleResponse>(`/api/articles/${id}`, articleData, {headers: this.getAuthHeaders()}).pipe(
      tap((res) => {
        if (res && res.success && res.data) {
          this.masterArticles.update((list) =>
            list.map((item) => (item.id === id ? res.data : item)),
          );
          if (this.currentArticle()?.id === id) {
            this.currentArticle.set(res.data);
          }
          this.applyLocalFilter();
        }
        this.loading.set(false);
      }),
    );
  }

  deleteArticle(id: string): Observable<{success: boolean; message: string}> {
    this.loading.set(true);
    return this.http.delete<{success: boolean; message: string}>(`/api/articles/${id}`, {headers: this.getAuthHeaders()}).pipe(
      tap((res) => {
        if (res && res.success) {
          this.masterArticles.update((list) => list.filter((item) => item.id !== id));
          if (this.currentArticle()?.id === id) {
            this.currentArticle.set(null);
          }
          this.applyLocalFilter();
        }
        this.loading.set(false);
      }),
    );
  }

  setDisciplineFilter(discipline: DisciplineType | 'all'): void {
    this.selectedDiscipline.set(discipline);
    this.loadArticles(discipline);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
    this.loadArticles(undefined, query);
  }

  /**
   * Upload an authentic image file or base64 stream to the server with sha256 indexing
   */
  uploadImage(
    imageData: string,
    fileName?: string,
    caption?: string,
    alt?: string,
  ): Observable<{
    success: boolean;
    data: {
      url: string;
      fileName: string;
      size: number;
      extension: string;
      caption: string;
      alt: string;
    };
  }> {
    return this.http.post<{
      success: boolean;
      data: {
        url: string;
        fileName: string;
        size: number;
        extension: string;
        caption: string;
        alt: string;
      };
    }>('/api/upload', {imageData, fileName, caption, alt}, {headers: this.getAuthHeaders()});
  }

  /**
   * Request Gemini to craft academic visual illustration prompt and philosophical symbolism
   */
  generateImagePrompt(
    paramsOrTitle: {title: string; discipline: string; abstract?: string; contentSample?: string} | string,
    discipline?: string,
    abstract?: string,
    content?: string,
  ): Observable<{
    success: boolean;
    data: {
      artisticPromptEn: string;
      symbolicExplanationTr: string;
      suggestedAspect: string;
      visualKeywords: string[];
    };
  }> {
    const payload = typeof paramsOrTitle === 'object'
      ? {
          title: paramsOrTitle.title,
          discipline: paramsOrTitle.discipline,
          abstract: paramsOrTitle.abstract || '',
          content: paramsOrTitle.contentSample || '',
        }
      : {
          title: paramsOrTitle,
          discipline: discipline || 'tde',
          abstract: abstract || '',
          content: content || '',
        };

    return this.http.post<{
      success: boolean;
      data: {
        artisticPromptEn: string;
        symbolicExplanationTr: string;
        suggestedAspect: string;
        visualKeywords: string[];
      };
    }>('/api/ai/image-prompt', payload);
  }

  /**
   * Multimodal image hermeneutics: analyzes iconography, composition and textual correlation
   */
  analyzeImage(params: {
    imageUrl?: string;
    imageData?: string;
    title: string;
    discipline: string;
  }): Observable<{
    success: boolean;
    data: {
      visualTitle: string;
      iconographicAnalysis: string;
      philosophicalHermeneutics: string;
      suggestedCaption: string;
    };
  }> {
    return this.http.post<{
      success: boolean;
      data: {
        visualTitle: string;
        iconographicAnalysis: string;
        philosophicalHermeneutics: string;
        suggestedCaption: string;
      };
    }>('/api/ai/analyze-image', params);
  }

  /**
   * Fetch curated open academic cover suggestions matching the subject
   */
  saveToBlockchain(articleId: string): Observable<{success: boolean; blockHash: string; blockNumber: number}> {
    return this.http.post<{success: boolean; blockHash: string; blockNumber: number}>(`/api/blockchain/register`, {articleId}, {headers: this.getAuthHeaders()});
  }

  verifyBlockchain(articleId: string): Observable<{success: boolean; verified: boolean; blockData: unknown}> {
    return this.http.get<{success: boolean; verified: boolean; blockData: unknown}>(`/api/blockchain/verify/${articleId}`);
  }

  submitToBlockchain(articleId: string): Observable<{success: boolean; submissionId: string; timestamp: string}> {
    return this.http.post<{success: boolean; submissionId: string; timestamp: string}>(`/api/blockchain/submit`, {articleId}, {headers: this.getAuthHeaders()});
  }

  getCertificate(articleId: string): Observable<{success: boolean; data: BlockchainCertificate}> {
    return this.http.get<{success: boolean; data: BlockchainCertificate}>(`/api/blockchain/certificate/${articleId}`);
  }

  getCoverSuggestions(discipline?: string): Observable<{
    success: boolean;
    data: {
      url: string;
      caption: string;
      alt: string;
      discipline: string;
      aspect: string;
    }[];
  }> {
    return this.http.post<{
      success: boolean;
      data: {
        url: string;
        caption: string;
        alt: string;
        discipline: string;
        aspect: string;
      }[];
    }>('/api/ai/suggest-cover', {discipline});
  }
}
