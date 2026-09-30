import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {CommunityGovernanceService} from '../../../../core/services/community-governance.service';
import {UserCustomizationService} from '../../../../core/services/user-customization.service';
import {CookieConsentService} from '../../../../core/services/cookie-consent.service';

@Component({
  selector: 'app-footer-legal',
  imports: [RouterLink, DecimalPipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pt-6 border-t border-sky-400/25 space-y-5">
      <!-- DISTRIBUTED RUST CORE, ORXUN TOKEN & GENESIS LOCK TELEMETRY BAR -->
      <div class="p-3.5 rounded-2xl bg-[#061531]/90 border border-sky-300/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex flex-wrap items-center gap-2.5">
          <span class="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>RUST BFT &amp; PQC ÇEKİRDEK HAZIR</span>
          </span>
          <span class="text-slate-200 font-mono text-[11px]">
            Katman-0 Kurucu Zırhı: <strong class="text-amber-300">16/16 Eser Kilitli</strong>
          </span>
          <span aria-hidden="true" class="text-sky-400/40">·</span>
          <span class="text-slate-200 font-mono text-[11px]">
            Hash: <strong class="text-cyan-200">SHA3-512 + BLAKE2b-512 + SLH-DSA</strong>
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            (click)="custom.openSettings('wallet')"
            class="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-300/50 text-amber-200 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-all"
            title="ORXUN Ödül Cüzdanını ve Site Özelleştirme Panelini Aç"
          >
            <img src="/logo.svg" alt="ORXUN" class="w-3.5 h-3.5 rounded-full object-contain" />
            <span>{{ custom.orxunBalance() | number:'1.2-2' }} ORXUN · Cüzdan &amp; Ayarlar</span>
          </button>

          <button
            type="button"
            (click)="gov.downloadCodeDesignCertificate()"
            class="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-300/45 text-sky-100 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-all"
            title="Cloudflare D1, GitHub Derleme ve Site Tasarım Değişmezlik Sertifikasını (.JSON) İndir"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm icon-luminous">verified</mat-icon>
            <span>Tasarım &amp; Cloudflare D1 Sertifikası</span>
          </button>

          <button
            type="button"
            (click)="gov.downloadRustGenesisSnapshot()"
            class="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-300/45 text-cyan-100 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-all"
            title="Rust Zinciri ve Dağıtık Düğümler İçin İmzalı Genesis Snapshot (.JSON) İndir"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm icon-luminous">download</mat-icon>
            <span>Rust Genesis Snapshot (.JSON)</span>
          </button>
          <button
            type="button"
            (click)="cookieService.openGateModal('overview')"
            class="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-300/45 text-teal-100 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-all"
            title="Uluslararası Çerez Politikası, KVKK/GDPR Dosyaları ve Zaman Ayarlı İkaz Ayarları"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm icon-luminous-emerald">cookie</mat-icon>
            <span>Uluslararası Çerez &amp; KVKK/GDPR</span>
          </button>

          <a
            routerLink="/topluluk-onayi"
            class="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-300/45 text-emerald-200 font-bold text-[11px] flex items-center gap-1.5 transition-all"
          >
            <mat-icon class="!w-3.5 !h-3.5 !text-sm icon-luminous-emerald">verified_user</mat-icon>
            <span>%96 Konsensüs &amp; YIP</span>
          </a>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300 font-medium">
        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-center sm:text-left">
          <span>&copy; 2026 Orçun KUNDAKCI · YENİDEM Mecmuası</span>
          <span aria-hidden="true">·</span>
          <span>Tüm Akademik ve Telif Hakları Saklıdır</span>
          <span aria-hidden="true">·</span>
          <span class="text-amber-200 font-mono text-[11px]">[YAPIM AŞAMASINDA · TASLAK SÜRÜM]</span>
        </div>
        <div class="flex items-center gap-2 text-cyan-200 font-semibold text-[13px]">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous">auto_stories</mat-icon>
          <span>&ldquo;Bilmek istersen seni, can içre ara canı...&rdquo;</span>
        </div>
      </div>

      <!-- Subtle, Dignified AI Support Signature -->
      <div class="pt-3 pb-10 border-t border-sky-400/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-sky-200/80">
        <div class="flex items-center gap-1.5 font-sans">
          <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">auto_awesome</mat-icon>
          <span>
            <strong class="text-amber-200 font-semibold">Yapay Zekâ Mimari &amp; Külliyat İmzası:</strong>
            Bu eser; kurucu müellifin fikrî riyasetinde, yapay zekâ mühendislik ve kriptografi desteğiyle gelecek nesiller ve açık irfan topluluğu için inşa edilmiştir.
          </span>
        </div>
        <span class="font-mono text-[10px] text-cyan-300/80 shrink-0">
          ORXUN · PQC-WORM · %96 BFT
        </span>
      </div>
    </div>
  `,
})
export class FooterLegal {
  readonly gov = inject(CommunityGovernanceService);
  readonly custom = inject(UserCustomizationService);
  readonly cookieService = inject(CookieConsentService);
}
