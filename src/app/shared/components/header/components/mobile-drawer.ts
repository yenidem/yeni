import {ChangeDetectionStrategy, Component, inject, output} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {SecurityService} from '../../../../core/services/security.service';
import {LayoutService} from '../../../../core/services/layout.service';
import {UserCustomizationService} from '../../../../core/services/user-customization.service';

@Component({
  selector: 'app-mobile-drawer',
  imports: [RouterLink, DecimalPipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block lg:hidden',
  },
  template: `
    <div class="py-4 border-t border-sky-500/25 space-y-3 bg-[#071530]/95 backdrop-blur-2xl px-4 rounded-b-3xl shadow-2xl">
      
      <!-- ORXUN Wallet & Site Customization Banner for Mobile/Tablet -->
      <button
        type="button"
        (click)="customService.openSettings('wallet'); dismiss.emit()"
        class="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#092047] via-[#0f2f66] to-[#092047] border border-amber-300/55 flex items-center justify-between gap-3 cursor-pointer shadow-lg"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <img
            src="/logo.svg"
            alt="ORXUN Token"
            class="w-7 h-7 object-contain rounded-full border border-amber-300/60 shrink-0"
          />
          <div class="text-left min-w-0">
            <div class="text-xs font-bold text-white truncate">Kullanıcı Paneli &amp; Siteyi Özelleştir</div>
            <div class="text-[11px] font-mono text-amber-300">
              Cüzdan: {{ customService.orxunBalance() | number:'1.2-2' }} ORXUN (İlk Üyelik Hediyesi Aktif)
            </div>
          </div>
        </div>
        <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber shrink-0">tune</mat-icon>
      </button>

      <button
        type="button"
        (click)="searchTrigger.emit()"
        class="w-full text-left p-3 rounded-2xl bg-white/5 hover:bg-sky-500/15 border border-sky-400/25 text-xs font-medium text-cyan-300 flex items-center justify-between transition-all cursor-pointer"
      >
        <span class="flex items-center gap-3">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous">search</mat-icon>
          <span>Hızlı Arama Yap</span>
        </span>
        <kbd class="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono">Ctrl+K</kbd>
      </button>

      <!-- Quick Sidebar Drawer Triggers for Mobile & Tablet -->
      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          (click)="layoutService.toggleLeftSidebar(); dismiss.emit()"
          class="p-3 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center gap-2 text-xs font-bold text-sky-200 cursor-pointer"
        >
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous">left_panel_open</mat-icon>
          <span>Güncel İçerikler</span>
        </button>
        <button
          type="button"
          (click)="layoutService.toggleRightSidebar(); dismiss.emit()"
          class="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center gap-2 text-xs font-bold text-amber-200 cursor-pointer"
        >
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">right_panel_open</mat-icon>
          <span>Kürsü & Kategoriler</span>
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
        <a routerLink="/" (click)="dismiss.emit()" class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous">auto_stories</mat-icon>
          <span class="text-xs font-bold">Külliyat</span>
        </a>
        <a routerLink="/sayilar" (click)="dismiss.emit()" class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">collections_bookmark</mat-icon>
          <span class="text-xs font-bold">Sayılar</span>
        </a>
        <a routerLink="/yazilarim" (click)="dismiss.emit()" class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous">history_edu</mat-icon>
          <span class="text-xs font-bold">Yazılarım</span>
        </a>
        <a routerLink="/lugat" (click)="dismiss.emit()" class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">translate</mat-icon>
          <span class="text-xs font-bold">Lügat</span>
        </a>
        <a routerLink="/siir-laboratuvari" (click)="dismiss.emit()" class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">music_note</mat-icon>
          <span class="text-xs font-bold">Vezin Lab</span>
        </a>
        <a routerLink="/erenler-ve-makamlar" (click)="dismiss.emit()" class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">explore</mat-icon>
          <span class="text-xs font-bold">Erenler Atlası</span>
        </a>
        <a routerLink="/kaynaklar" (click)="dismiss.emit()" class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous">library_music</mat-icon>
          <span class="text-xs font-bold">Kaynaklar &amp; Deyiş</span>
        </a>
        <a routerLink="/topluluk-onayi" (click)="dismiss.emit()" class="p-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 flex items-center gap-2.5 sm:col-span-2">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">shield_lock</mat-icon>
          <span class="text-xs font-bold text-amber-200">%96 Konsensüs &amp; Kuantum Mühür</span>
        </a>
        <a routerLink="/hakkinda" (click)="dismiss.emit()" class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous">person</mat-icon>
          <span class="text-xs font-bold">Hakkında</span>
        </a>
      </div>

      <button
        type="button"
        (click)="securityService.open2FAModal(); dismiss.emit()"
        class="w-full p-3.5 rounded-2xl bg-cyan-950/50 border border-cyan-500/35 text-xs font-bold text-cyan-200 flex items-center justify-center gap-2 cursor-pointer"
      >
        <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">security</mat-icon>
        <span>2FA Yazar Güvenlik Kapısı</span>
      </button>
    </div>
  `
})
export class MobileDrawer {
  readonly securityService = inject(SecurityService);
  readonly layoutService = inject(LayoutService);
  readonly customService = inject(UserCustomizationService);
  searchTrigger = output<void>();
  dismiss = output<void>();
}
