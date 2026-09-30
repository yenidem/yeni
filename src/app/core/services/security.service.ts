import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AcademicArticle, IntegrityVerificationResult } from '../models/article.model';
import { catchError, of, tap } from 'rxjs';
import { FirebaseService } from '../../services/firebase';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly firebaseService = inject(FirebaseService);
  private readonly STORAGE_KEY = 'orcun_academic_auth_session';

  readonly firebaseUser = this.firebaseService.user;
  readonly isAuthor = computed(() => !!this.firebaseUser());
  readonly authToken = signal<string | null>(null);
  
  readonly securityStatus = signal<{
    authorEmail: string;
    twoFactorEnabled: boolean;
    cryptographicEngine: string;
    serverTimeTr: string;
  } | null>(null);

  // UI state signals for security modals
  readonly is2FAModalOpen = signal<boolean>(false);
  readonly isVerifierModalOpen = signal<boolean>(false);
  readonly activeArticleForVerification = signal<AcademicArticle | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.refreshSecurityStatus();
      
      // Listen for firebase user changes to update token
      this.firebaseService.auth.onIdTokenChanged(async (user) => {
        if (user) {
          const token = await user.getIdToken();
          this.authToken.set(token);
        } else {
          this.authToken.set(null);
        }
      });
    }
  }

  async loginWithGoogle() {
    try {
      const user = await this.firebaseService.login();
      this.refreshSecurityStatus();
      return user;
    } catch (error) {
      console.error('Firebase login failed', error);
      throw error;
    }
  }

  refreshSecurityStatus(): void {
    const headers = this.getAuthHeaders();
    this.http
      .get<{
        success: boolean;
        data: {
          authorEmail: string;
          twoFactorEnabled: boolean;
          cryptographicEngine: string;
          serverTimeTr: string;
          isAuthenticated?: boolean;
        };
      }>('/api/security/status', { headers })
      .pipe(
        catchError(() => of(null)),
        tap((res) => {
          if (res?.success && res.data) {
            this.securityStatus.set(res.data);
          }
        }),
      )
      .subscribe();
  }

  async logout() {
    await this.firebaseService.logout();
    this.authToken.set(null);
    this.refreshSecurityStatus();
  }

  verifyArticleIntegrity(payload: {
    articleId?: string;
    title?: string;
    discipline?: string;
    content?: string;
    references?: string[];
    publishedAt?: string;
  }) {
    return this.http.post<{
      success: boolean;
      data: IntegrityVerificationResult;
      error?: string;
    }>('/api/security/verify-integrity', payload);
  }

  getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  open2FAModal(): void {
    this.is2FAModalOpen.set(true);
  }

  close2FAModal(): void {
    this.is2FAModalOpen.set(false);
  }

  openVerifierModal(article: AcademicArticle): void {
    this.activeArticleForVerification.set(article);
    this.isVerifierModalOpen.set(true);
  }

  closeVerifierModal(): void {
    this.isVerifierModalOpen.set(false);
    this.activeArticleForVerification.set(null);
  }
}
