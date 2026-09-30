import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {BookmarkService} from '../../../../core/services/bookmark.service';
import {UserCustomizationService} from '../../../../core/services/user-customization.service';

@Component({
  selector: 'app-header-actions',
  imports: [RouterLink, DecimalPipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex items-center shrink-0',
  },
  template: `
    <div class="flex items-center gap-1.5 sm:gap-2">
      <!-- Quick Search -->
      <button
        type="button"
        (click)="searchTrigger.emit()"
        class="luxury-icon-btn !w-9 !h-9 sm:!w-10 sm:!h-10"
        title="Hızlı Arama (Ctrl+K)"
      >
        <mat-icon class="!w-5 !h-5 !text-lg icon-luminous">search</mat-icon>
      </button>

      <!-- Bookmarks -->
      <button
        type="button"
        (click)="bookmarksTrigger.emit()"
        class="luxury-icon-btn !w-9 !h-9 sm:!w-10 sm:!h-10 relative"
        title="Okuma Listem"
      >
        <mat-icon class="!w-5 !h-5 !text-lg icon-luminous-amber">bookmarks</mat-icon>
        @if (bookmarkService.bookmarks().length > 0) {
          <span class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 text-stone-950 font-bold text-[10px] flex items-center justify-center shadow-lg border border-white/20 tabular-nums">
            {{ bookmarkService.bookmarks().length }}
          </span>
        }
      </button>

      <!-- ORXUN Token Wallet & User Site Customization Button -->
      <button
        type="button"
        (click)="customService.openSettings('wallet')"
        class="nav-pill-btn !h-9 sm:!h-10 !px-2.5 sm:!px-3 !border-amber-300/60 !bg-gradient-to-r !from-[#092047] !to-[#11336b]"
        title="Kullanıcı Paneli, Site Özelleştirme ve ORXUN Ödül Cüzdanı (İlk Üyelik 1.00 ORXUN Hediye)"
      >
        <img
          src="/logo.svg"
          alt="ORXUN Token"
          class="w-4 h-4 sm:w-5 sm:h-5 object-contain rounded-full border border-amber-300/60 shrink-0"
        />
        <span class="font-mono font-extrabold text-amber-300 text-xs">
          {{ customService.orxunBalance() | number:'1.0-2' }}
        </span>
        <span class="text-[11px] font-bold text-white hidden xl:inline">ORXUN</span>
        <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">tune</mat-icon>
      </button>

      <!-- Primary Write Action -->
      <a
        routerLink="/yaz"
        class="luxury-btn-primary !h-9 sm:!h-10 !px-2.5 xl:!px-3.5"
        title="Yeni Makale Yaz"
      >
        <mat-icon class="!w-4 !h-4 !text-lg font-bold text-stone-950">edit_note</mat-icon>
        <span class="hidden xl:inline">Makale Yaz</span>
      </a>

      <!-- Mobile Menu Toggle -->
      <button
        type="button"
        (click)="toggleMobileMenu.emit()"
        class="lg:hidden luxury-icon-btn !w-9 !h-9 sm:!w-10 sm:!h-10"
        title="Menüyü Aç / Kapat"
      >
        <mat-icon class="!w-6 !h-6 !text-xl icon-luminous">{{ mobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
      </button>
    </div>
  `
})
export class HeaderActions {
  readonly bookmarkService = inject(BookmarkService);
  readonly customService = inject(UserCustomizationService);

  mobileMenuOpen = input.required<boolean>();
  searchTrigger = output<void>();
  bookmarksTrigger = output<void>();
  toggleMobileMenu = output<void>();
}
