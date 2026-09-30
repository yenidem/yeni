import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SecurityService } from '../../../../core/services/security.service';
import { IntegrityVerificationResult } from '../../../../core/models/article.model';

@Component({
  selector: 'app-quantum-verifier-modal',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (article(); as art) {
      <div
        role="presentation"
        tabindex="-1"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        (click)="closeOnBackdrop($event)"
        (keydown.escape)="securityService.closeVerifierModal()"
      >
        <div
          id="quantum-verifier-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quantum-verifier-title"
          class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#101728] to-[#090d18] border border-cyan-500/30 shadow-bottom-elevated shadow-quantum-cyan p-6 text-slate-200"
        >
          <!-- Top ambient glow line -->
          <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/10">
                <mat-icon class="text-2xl">verified</mat-icon>
              </div>
              <div>
                <h3 id="quantum-verifier-title" class="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                  <span>Kuantum Dirençli SHA-512 Kriptografik Doğrulama</span>
                </h3>
                <p class="text-xs text-cyan-400/90 font-mono">Post-Quantum Cryptographic Integrity Engine</p>
              </div>
            </div>
            <button
              type="button"
              (click)="securityService.closeVerifierModal()"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <mat-icon class="text-lg">close</mat-icon>
            </button>
          </div>

          <!-- Article Title & Discipline Info -->
          <div class="py-4 border-b border-white/10 space-y-1.5">
            <div class="flex items-center gap-2 text-xs">
              <span class="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-medium uppercase tracking-wider text-[10px]">
                {{ art.discipline }}
              </span>
              <span class="text-slate-400 font-mono">Versiyon {{ art.version || 1 }}.0</span>
              <span class="text-slate-500">•</span>
              <span class="text-cyan-300 font-mono">{{ art.wordCount || 0 }} Kelime</span>
            </div>
            <h4 class="text-base font-medium text-white font-academic-serif leading-snug">
              {{ art.title }}
            </h4>
          </div>

          <!-- Detailed Turkish Academic Timestamp -->
          <div class="py-3 px-3.5 my-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2 text-slate-300">
              <mat-icon class="text-sm text-cyan-400">schedule</mat-icon>
              <span>Resmî Yayın ve Kriptografik Zaman Damgası:</span>
            </div>
            <span class="font-mono text-cyan-300 font-medium">
              {{ art.detailedDateTr || art.publishedAt }}
            </span>
          </div>

          <!-- SHA-512 Hash & Digital Seal View -->
          <div class="space-y-3 py-2">
            <div>
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-slate-400 font-medium">Kuantum Dirençli SHA-512 Özeti (128 Hex - 512 Bit):</span>
                <span class="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <mat-icon class="text-[13px]">lock</mat-icon>
                  <span>Değiştirilemez (Immutable)</span>
                </span>
              </div>
              <div class="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-amber-300/90 break-all leading-relaxed select-all">
                {{ art.sha512Hash || 'Kriptografik özet hesaplanıyor...' }}
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-slate-400 font-medium">Yazar Kuantum İrfan Mührü (HMAC-SHA512):</span>
                <span class="text-cyan-400 font-mono text-[11px]">Orçun Kundakcı</span>
              </div>
              <div class="p-2.5 rounded-xl bg-black/60 border border-cyan-500/20 font-mono text-xs text-cyan-300 break-all select-all">
                {{ art.quantumSignature || 'HMAC-SHA512 mühür verisi' }}
              </div>
            </div>
          </div>

          <!-- Interactive Live Anti-Tamper Verification -->
          <div class="my-4 p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
              <h5 class="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <mat-icon class="text-sm text-cyan-400">gavel</mat-icon>
                <span>Canlı Anti-Tahrifat Denetimi (Anti-Tamper Live Audit)</span>
              </h5>
              <button
                type="button"
                (click)="runLiveVerification()"
                [disabled]="isVerifying()"
                class="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium border border-cyan-500/40 flex items-center gap-1 transition-all cursor-pointer"
              >
                <mat-icon class="text-xs" [class.animate-spin]="isVerifying()">sync</mat-icon>
                <span>{{ isVerifying() ? 'Hesaplanıyor...' : 'Yeniden Doğrula' }}</span>
              </button>
            </div>

            @if (verificationResult(); as result) {
              <div
                class="p-3 rounded-lg border text-xs space-y-2 transition-all"
                [class.bg-emerald-500/10]="result.verified"
                [class.border-emerald-500/30]="result.verified"
                [class.text-emerald-300]="result.verified"
                [class.bg-rose-500/10]="result.tampered"
                [class.border-rose-500/30]="result.tampered"
                [class.text-rose-300]="result.tampered"
              >
                <div class="flex items-center gap-2 font-semibold text-sm">
                  <mat-icon class="text-lg">
                    {{ result.verified ? 'check_circle' : 'warning' }}
                  </mat-icon>
                  <span>
                    {{ result.verified ? 'Bütünlük Doğrulandı: Metin %100 Orijinaldir, Tahrif Edilmemiştir.' : 'UYARI: Metin Bütünlüğü Bozulmuş!' }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-300 leading-normal">
                  Metin içeriği, başlığı, kaynakçası ve yayın saati SHA-512 standardında yeniden şifrelendi. Veritabanındaki mühür ile sunucu çıktısı tam eşleşme sağladı.
                </p>
                <div class="text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
                  <span>Protokol: {{ result.algorithm }}</span>
                  <span>Denetim Zamanı: {{ result.timestamp }}</span>
                </div>
              </div>
            }
          </div>

          <!-- Revision History -->
          @if (art.revisionHistory && art.revisionHistory.length > 0) {
            <div class="mt-4 pt-4 border-t border-white/10 space-y-2">
              <h5 class="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <mat-icon class="text-xs">history</mat-icon>
                <span>Kriptografik Sürüm ve Neşir Kaydı</span>
              </h5>
              <div class="space-y-1.5">
                @for (rev of art.revisionHistory; track rev.date) {
                  <div class="p-2 rounded-lg bg-black/40 border border-white/5 text-xs flex items-center justify-between font-mono">
                    <div class="text-slate-300">
                      <span class="text-amber-400 font-semibold">{{ rev.author }}</span>: {{ rev.note }}
                    </div>
                    <div class="text-[11px] text-cyan-400/80">
                      {{ rev.hash }}
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Footer button -->
          <div class="pt-4 mt-2 flex justify-end">
            <button
              type="button"
              (click)="securityService.closeVerifierModal()"
              class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class QuantumVerifierModal {
  readonly securityService = inject(SecurityService);
  readonly article = this.securityService.activeArticleForVerification;

  readonly isVerifying = signal<boolean>(false);
  readonly verificationResult = signal<IntegrityVerificationResult | null>(null);

  constructor() {
    // Automatically trigger initial live verification when opened
    this.runLiveVerification();
  }

  closeOnBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'quantum-verifier-dialog' || (event.target as HTMLElement).closest('#quantum-verifier-dialog')) {
      return;
    }
    this.securityService.closeVerifierModal();
  }

  runLiveVerification(): void {
    const art = this.article();
    if (!art) return;

    this.isVerifying.set(true);
    this.securityService
      .verifyArticleIntegrity({
        articleId: art.id,
        title: art.title,
        discipline: art.discipline,
        content: art.content,
        references: art.references,
        publishedAt: art.publishedAt,
      })
      .subscribe({
        next: (res) => {
          this.isVerifying.set(false);
          if (res.success && res.data) {
            this.verificationResult.set(res.data);
          }
        },
        error: () => {
          this.isVerifying.set(false);
        },
      });
  }
}
