import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AcademicArticle } from '../../../../../core/models/article.model';

@Component({
  selector: 'app-detail-seal-card',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-5 rounded-2xl bg-gradient-to-r from-[#0a1120] via-[#0d162b] to-[#070b16] border border-cyan-500/25 shadow-lg space-y-4">
      <!-- Card Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <mat-icon class="!w-4 !h-4 !text-base">verified_user</mat-icon>
          </div>
          <div>
            <h4 class="text-xs font-serif font-bold text-white tracking-wide">
              Kriptografik Bütünlük & Blok Zinciri Mührü
            </h4>
            <p class="text-[10px] text-cyan-300/80 font-mono">
              SHA-512 Kuantum Dirençli Tescil
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          @if (article().isBlockchainVerified) {
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
              <mat-icon class="!w-3 !h-3 !text-xs">check_circle</mat-icon>
              <span>Blok Zincirinde Tescilli (#{{ article().blockNumber }})</span>
            </span>
          } @else {
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-semibold">
              <mat-icon class="!w-3 !h-3 !text-xs">pending</mat-icon>
              <span>Topluluk Onayı Kuyruğunda</span>
            </span>
          }
        </div>
      </div>

      <!-- Hash Data Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
        <div class="p-2.5 rounded-xl bg-[#070d18] border border-white/5 space-y-1">
          <span class="text-stone-400 block text-[10px]">SHA-512 Kuantum Bütünlük Özeti:</span>
          <span class="text-cyan-300 break-all leading-tight block">
            {{ article().sha512Hash || 'Hesaplanıyor...' }}
          </span>
        </div>

        <div class="p-2.5 rounded-xl bg-[#070d18] border border-white/5 space-y-1">
          <span class="text-stone-400 block text-[10px]">Kürsü Dijital İrfan Mührü (HMAC):</span>
          <span class="text-amber-300 font-bold break-all leading-tight block">
            {{ article().quantumSignature || 'OK-SEAL-VERIFIED' }}
          </span>
        </div>
      </div>

      <!-- Action Buttons for Verification & Certificate -->
      <div class="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="verifyIntegrity.emit()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e172a] hover:bg-[#14213d] text-cyan-300 border border-cyan-500/30 font-serif font-semibold transition-colors cursor-pointer"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm">fingerprint</mat-icon>
            <span>Kriptografik Teyit Yap</span>
          </button>

          <button
            type="button"
            (click)="openCertificate.emit()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e172a] hover:bg-[#14213d] text-amber-300 border border-amber-500/30 font-serif font-semibold transition-colors cursor-pointer"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm">badge</mat-icon>
            <span>Orijinallik Sertifikası</span>
          </button>
        </div>

        @if (article().revisionHistory && article().revisionHistory!.length > 0) {
          <button
            type="button"
            (click)="viewHistory.emit()"
            class="text-[11px] text-stone-400 hover:text-white underline font-mono cursor-pointer"
          >
            Revizyon Tarihçesi (v{{ article().version || 1 }})
          </button>
        }
      </div>
    </div>
  `,
})
export class DetailSealCardComponent {
  article = input.required<AcademicArticle>();
  verifyIntegrity = output<void>();
  openCertificate = output<void>();
  viewHistory = output<void>();
}
