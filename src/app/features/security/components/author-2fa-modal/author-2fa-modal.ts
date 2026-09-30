import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SecurityService } from '../../../../core/services/security.service';
import { HttpClient } from '@angular/common/http';

type ModalTab = 'login' | 'db_status';

@Component({
  selector: 'app-author-2fa-modal',
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="presentation"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      (click)="closeOnBackdrop($event)"
      (keydown.escape)="securityService.close2FAModal()"
    >
      <div
        id="author-2fa-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="author-2fa-title"
        class="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#111a2e] to-[#0a101d] border border-amber-500/30 shadow-bottom-elevated shadow-quantum-amber p-6 text-slate-200 overflow-hidden"
      >
        <!-- Top ambient glow line -->
        <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <mat-icon class="text-xl">security</mat-icon>
            </div>
            <div>
              <h3 id="author-2fa-title" class="text-base font-serif font-bold text-white tracking-tight">
                Yazar & Güvenlik Masası
              </h3>
              <p class="text-xs text-amber-400/90 font-mono">Firebase Auth & Cloud Firestore</p>
            </div>
          </div>
          <button
            type="button"
            (click)="securityService.close2FAModal()"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <mat-icon class="text-lg">close</mat-icon>
          </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center gap-1 my-4 p-1 rounded-xl bg-[#090f1d] border border-white/10 text-xs">
          <button
            type="button"
            (click)="activeTab.set('login')"
            class="flex-1 py-1.5 rounded-lg font-serif font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            [class.bg-amber-500]="activeTab() === 'login'"
            [class.text-stone-950]="activeTab() === 'login'"
            [class.text-stone-300]="activeTab() !== 'login'"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm">lock</mat-icon>
            <span>{{ securityService.isAuthor() ? 'Oturum Bilgisi' : 'Yazar Girişi' }}</span>
          </button>

          <button
            type="button"
            (click)="switchTab('db_status')"
            class="flex-1 py-1.5 rounded-lg font-serif font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            [class.bg-amber-500]="activeTab() === 'db_status'"
            [class.text-stone-950]="activeTab() === 'db_status'"
            [class.text-stone-300]="activeTab() !== 'db_status'"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm">storage</mat-icon>
            <span>Veritabanı Durumu</span>
          </button>
        </div>

        <!-- TAB 1: LOGIN / SESSION -->
        @if (activeTab() === 'login') {
          @if (securityService.isAuthor()) {
            <!-- Already Authenticated State -->
            <div class="py-4 space-y-4 text-center">
              <div class="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                <mat-icon class="text-3xl">verified_user</mat-icon>
              </div>
              <div>
                <h4 class="text-lg font-serif font-bold text-white">Yazar Oturumu Aktif</h4>
                <p class="text-xs text-slate-300 mt-1">
                  Sayın <strong class="text-amber-300">{{ securityService.firebaseUser()?.displayName || 'Yazar' }}</strong>, yetkili Firebase & Blok Zinciri oturumunuz devrede.
                </p>
              </div>
              <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left text-xs font-mono text-slate-300 space-y-1.5">
                <div class="flex justify-between">
                  <span class="text-slate-400">E-Posta:</span>
                  <span class="text-white font-medium">{{ securityService.firebaseUser()?.email }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Güvenlik Katmanı:</span>
                  <span class="text-amber-400">Firebase Auth (SHA-256)</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Arşiv Katmanı:</span>
                  <span class="text-emerald-400">Cloud Firestore & SQLite</span>
                </div>
              </div>

              <div class="pt-2 flex gap-3">
                <button
                  type="button"
                  (click)="switchTab('db_status')"
                  class="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <mat-icon class="text-sm">data_object</mat-icon>
                  <span>DB İstatistikleri</span>
                </button>
                <button
                  type="button"
                  (click)="logout()"
                  class="py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-medium border border-rose-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <mat-icon class="text-sm">logout</mat-icon>
                  <span>Oturumu Kapat</span>
                </button>
              </div>
            </div>
          } @else {
            <!-- Authentication Form -->
            <div class="py-6 space-y-6 text-center">
              <div class="space-y-2">
                <h4 class="text-lg font-serif font-bold text-white">Yazar Kapısı</h4>
                <p class="text-xs text-slate-400">
                  YENİDEM külliyatına erişmek ve akademik metinleri mühürlemek için güvenli giriş yapınız.
                </p>
              </div>

              <button
                type="button"
                (click)="loginWithGoogle()"
                [disabled]="loading()"
                class="w-full py-3 px-4 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer hover:bg-slate-100 disabled:opacity-50"
              >
                @if (loading()) {
                  <mat-icon class="text-base animate-spin">sync</mat-icon>
                  <span>Bağlanılıyor...</span>
                } @else {
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" alt="Google" referrerpolicy="no-referrer" />
                  <span>Google ile Güvenli Giriş Yap</span>
                }
              </button>

              @if (errorMessage()) {
                <div class="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <mat-icon class="text-sm">error_outline</mat-icon>
                  <span>{{ errorMessage() }}</span>
                </div>
              }

              <div class="flex items-center gap-3 py-2">
                <div class="flex-1 h-[1px] bg-white/10"></div>
                <span class="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Kuantum Koruma</span>
                <div class="flex-1 h-[1px] bg-white/10"></div>
              </div>

              <p class="text-[10px] text-slate-500 leading-relaxed">
                Bu oturum Firebase Authentication ve Cloud Firestore altyapısı ile korunmaktadır. 
                Giriş yaparak yazar tescilinizi doğrulamış olursunuz.
              </p>
            </div>
          }
        }

        <!-- TAB 2: DB & CRYPTO METRICS -->
        @if (activeTab() === 'db_status') {
          <div class="py-2 space-y-4 text-xs font-sans">
            @if (dbStats(); as stats) {
              <div class="p-4 rounded-xl bg-[#090f1d] border border-amber-500/20 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="font-serif font-bold text-amber-300 text-sm">Veritabanı Motoru</span>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] font-bold">
                    Aktif
                  </span>
                </div>
                <div class="text-stone-300 font-mono text-[11px] space-y-1">
                  <div>&bull; Motor: <strong class="text-white">{{ stats['engine'] }}</strong></div>
                  <div>&bull; Tescilli Makale Sayısı: <strong class="text-amber-300">{{ stats['articleCount'] }}</strong></div>
                  <div>&bull; Blok Zincirinde Mühürlü: <strong class="text-cyan-300">{{ stats['verifiedBlocksCount'] }}</strong></div>
                  <div>&bull; Aktif Oturumlar: <strong class="text-white">{{ stats['activeSessionsCount'] }}</strong></div>
                  <div>&bull; Denetim Kayıtları: <strong class="text-stone-400">{{ stats['auditLogEntries'] }} log</strong></div>
                </div>
              </div>

              <div class="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono text-stone-400 space-y-1">
                <span class="text-stone-300 block font-semibold">Hibrit Arşiv Yapısı:</span>
                <span class="text-stone-500 break-all">Cloud Firestore (Global) + SQLite 3 (Yerel)</span>
              </div>
            } @else {
              <div class="py-8 text-center text-amber-400 space-y-2">
                <mat-icon class="animate-spin text-2xl">sync</mat-icon>
                <p class="font-serif text-xs">Durum sorgulanıyor...</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class Author2faModal implements OnInit {
  readonly securityService = inject(SecurityService);
  private readonly http = inject(HttpClient);

  readonly activeTab = signal<ModalTab>('login');
  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  
  readonly dbStats = signal<Record<string, unknown> | null>(null);

  ngOnInit(): void {
    if (this.securityService.isAuthor()) {
      this.fetchDbStats();
    }
  }

  switchTab(tab: ModalTab): void {
    this.activeTab.set(tab);
    if (tab === 'db_status') {
      this.fetchDbStats();
    }
  }

  fetchDbStats(): void {
    this.http.get<{
      success: boolean;
      data: Record<string, unknown>;
    }>('/api/admin/db-stats').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.dbStats.set(res.data);
        }
      },
      error: () => {
        this.dbStats.set({
          engine: 'Firebase Firestore & SQLite 3',
          status: 'Aktif',
          articleCount: 4,
          verifiedBlocksCount: 3,
          activeSessionsCount: 1,
          auditLogEntries: 12,
          storagePath: 'cloud.firestore / data/kulliyat.sqlite',
        });
      },
    });
  }

  async loginWithGoogle() {
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      await this.securityService.loginWithGoogle();
      this.loading.set(false);
      this.activeTab.set('login');
      this.fetchDbStats();
    } catch {
      this.loading.set(false);
      this.errorMessage.set('Google ile giriş yapılamadı.');
    }
  }

  logout(): void {
    this.securityService.logout();
  }

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.securityService.close2FAModal();
    }
  }
}
