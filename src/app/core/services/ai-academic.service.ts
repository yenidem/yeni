import {Injectable, inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap, catchError, throwError} from 'rxjs';
import {AiAcademicOptimization, AiSocialPost, DisciplineType} from '../models/article.model';

export interface OptimizeRequest {
  title: string;
  discipline: DisciplineType;
  content: string;
  abstract?: string;
}

export interface SocialPostRequest {
  title: string;
  discipline: DisciplineType;
  excerpt?: string;
  featuredQuote?: string;
  platform?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiAcademicService {
  private readonly http = inject(HttpClient);

  readonly optimizing = signal<boolean>(false);
  readonly generatingSocial = signal<boolean>(false);
  readonly lastOptimization = signal<AiAcademicOptimization | null>(null);
  readonly lastSocialPost = signal<AiSocialPost | null>(null);
  readonly errorMessage = signal<string | null>(null);

  optimizeArticle(payload: OptimizeRequest): Observable<{success: boolean; data: AiAcademicOptimization}> {
    this.optimizing.set(true);
    this.errorMessage.set(null);

    return this.http.post<{success: boolean; data: AiAcademicOptimization}>('/api/ai/optimize-academic', payload).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.lastOptimization.set(res.data);
        }
        this.optimizing.set(false);
      }),
      catchError((err) => {
        this.optimizing.set(false);
        const msg = err.error?.error || err.message || 'Akademik optimizasyon işlemi tamamlanamadı.';
        this.errorMessage.set(msg);
        return throwError(() => new Error(msg));
      }),
    );
  }

  generateSocialPost(payload: SocialPostRequest): Observable<{success: boolean; data: AiSocialPost}> {
    this.generatingSocial.set(true);
    this.errorMessage.set(null);

    return this.http.post<{success: boolean; data: AiSocialPost}>('/api/ai/generate-social-post', payload).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.lastSocialPost.set(res.data);
        }
        this.generatingSocial.set(false);
      }),
      catchError((err) => {
        this.generatingSocial.set(false);
        const msg = err.error?.error || err.message || 'Sosyal medya metni oluşturulamadı.';
        this.errorMessage.set(msg);
        return throwError(() => new Error(msg));
      }),
    );
  }
}
