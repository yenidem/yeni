import {ChangeDetectionStrategy, Component, inject, output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {SecurityService} from '../../../../core/services/security.service';
import {LayoutService} from '../../../../core/services/layout.service';
import {UserCustomizationService} from '../../../../core/services/user-customization.service';

@Component({
  selector: 'app-header-ribbon',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
  template: `
    @if (customService.showPioneerRibbon()) {
      <!-- Ultra-Thin Crimson Blockchain & Community Pioneer Warning Band -->
      <div
        role="region"
        aria-label="Blok Zinciri ve Topluluk Odaklı Fikir Platformu İnşa Bildirimi"
        class="pioneer-red-bar py-1 text-[11px] sm:text-xs text-white select-none relative z-50 w-full max-w-full overflow-hidden"
      >
        <div class="max-w-[1840px] mx-auto px-2.5 sm:px-5 lg:px-8 flex items-center justify-between gap-2">
          <!-- Left Red Ear-Tag + Pulsing White Pioneer Message -->
          <a
            routerLink="/topluluk-onayi"
            class="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 group cursor-pointer"
            title="Autivca & OKPAN 1.000.000 Üye ve %96 Topluluk Blok Zinciri Konsensüs Merkezini Aç"
          >
            <!-- Red Ear-Tag (Kırmızı Kulakçık) -->
            <span class="pioneer-ear-tag px-2 sm:px-2.5 py-0.5 inline-flex items-center gap-1.5 font-extrabold text-[10px] sm:text-[11px] tracking-wider uppercase text-white shrink-0">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
              </span>
              <span>ÖNCÜ PLATFORM</span>
            </span>

            <!-- Blinking / Gently Pulsing White Announcement Text -->
            <p class="font-sans font-semibold text-white tracking-wide truncate pioneer-pulse-text group-hover:text-amber-200 transition-colors">
              Bu sistem; <strong class="font-extrabold text-amber-200">Blok Zinciri (SHA3-512) tartışma ve fikir platformu</strong> topluluk odaklı projenin öncüsüdür (Hedef: 1.000.000 Üye &amp; %96 Konsensüs · İlk Üyelik <strong class="text-amber-200">1.00 ORXUN Hediye</strong>)
            </p>
          </a>

          <!-- Right Quick Status & Security Controls -->
          <div class="flex items-center gap-2 text-rose-100 shrink-0">
            <button
              type="button"
              (click)="customService.openSettings('customize')"
              class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/25 hover:bg-black/40 border border-white/20 text-[10px] sm:text-[11px] text-amber-200 transition-colors cursor-pointer font-semibold"
              title="Site Görünümünü Özelleştir ve ORXUN Ödül Cüzdanını Aç"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs text-amber-300">tune</mat-icon>
              <span>Siteyi Özelleştir</span>
            </button>

            <button
              type="button"
              (click)="securityService.open2FAModal()"
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/25 hover:bg-black/40 border border-white/20 text-[10px] sm:text-[11px] text-white transition-colors cursor-pointer"
              title="Blok Zinciri & 2FA Yazar Doğrulama"
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                [class.bg-emerald-400]="securityService.isAuthor()"
                [class.bg-amber-300]="!securityService.isAuthor()"
              ></span>
              <span class="font-mono font-bold">
                {{ securityService.isAuthor() ? 'Yazar: Orçun K.' : 'SHA-512 • 2FA' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class HeaderRibbon {
  readonly securityService = inject(SecurityService);
  readonly layoutService = inject(LayoutService);
  readonly customService = inject(UserCustomizationService);
  readonly searchTrigger = output<void>();
}
