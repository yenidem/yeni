import {ChangeDetectionStrategy, Component, inject, input, output, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {DisciplineType} from '../../../../core/models/article.model';

@Component({
  selector: 'app-header-nav',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hidden lg:flex items-center',
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeDropdowns()',
  },
  template: `
    <nav class="flex items-center gap-2 font-sans relative" aria-label="Ana Akademik Navigasyon">
      <!-- 1. KÜLLİYAT (Direct Primary Button) -->
      <button
        type="button"
        (click)="onKulliyatClick()"
        class="nav-pill-btn group"
        [class.nav-pill-btn-active]="selectedDiscipline() === 'all' && isHome()"
        title="Tüm Akademik Külliyat (16 Eser)"
      >
        <mat-icon class="!w-4 !h-4 !text-base icon-luminous">auto_stories</mat-icon>
        <span>Külliyat</span>
      </button>

      <!-- 2. AKADEMİK ARŞİV & KÜRSÜLER (Sub-Menu 1) -->
      <div class="relative">
        <button
          type="button"
          (click)="toggleMenu('archive', $event)"
          [attr.aria-expanded]="openMenu() === 'archive'"
          class="nav-pill-btn"
          [class.nav-pill-btn-active]="openMenu() === 'archive' || isArchiveRouteActive()"
        >
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">collections_bookmark</mat-icon>
          <span>Kürsü &amp; Arşiv</span>
          <mat-icon
            class="!w-4 !h-4 !text-sm transition-transform duration-200"
            [class.rotate-180]="openMenu() === 'archive'"
          >
            expand_more
          </mat-icon>
        </button>

        @if (openMenu() === 'archive') {
          <div
            class="absolute left-0 top-full mt-2.5 w-80 rounded-2xl bg-[#071838] border border-sky-300/45 shadow-[0_22px_55px_rgba(2,8,23,0.92)] p-2.5 z-50 space-y-1 reveal-up"
            role="menu"
          >
            <div class="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 border-b border-sky-300/20 mb-1">
              Akademik Külliyat &amp; İrfan Bölümleri
            </div>

            <a
              routerLink="/sayilar"
              routerLinkActive="!bg-[#12387a] !border-amber-300/60"
              (click)="closeDropdowns()"
              class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-400/15 border border-transparent transition-colors group"
              role="menuitem"
            >
              <div class="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/35 flex items-center justify-center shrink-0 mt-0.5">
                <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">collections_bookmark</mat-icon>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white group-hover:text-amber-200">Mecmua Sayıları &amp; Ciltler</div>
                <div class="text-[11px] text-sky-200/85 leading-snug">Tematik fasikül ve dönem ciltleri arşivi</div>
              </div>
            </a>

            <a
              routerLink="/yazilarim"
              routerLinkActive="!bg-[#12387a] !border-amber-300/60"
              (click)="closeDropdowns()"
              class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-400/15 border border-transparent transition-colors group"
              role="menuitem"
            >
              <div class="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/35 flex items-center justify-center shrink-0 mt-0.5">
                <mat-icon class="!w-4 !h-4 !text-base icon-luminous">history_edu</mat-icon>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white group-hover:text-cyan-200">Tefekkür Defteri &amp; Yazılarım</div>
                <div class="text-[11px] text-sky-200/85 leading-snug">Orçun KUNDAKCI şahsi makale ve denemeleri</div>
              </div>
            </a>

            <a
              routerLink="/erenler-ve-makamlar"
              routerLinkActive="!bg-[#12387a] !border-amber-300/60"
              (click)="closeDropdowns()"
              class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-400/15 border border-transparent transition-colors group"
              role="menuitem"
            >
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/35 flex items-center justify-center shrink-0 mt-0.5">
                <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">explore</mat-icon>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white group-hover:text-emerald-200">Erenler &amp; 4 Kapı 40 Makam</div>
                <div class="text-[11px] text-sky-200/85 leading-snug">Anadolu irfan ve Yedi Ulu Ozan haritası</div>
              </div>
            </a>

            <a
              routerLink="/hakkinda"
              routerLinkActive="!bg-[#12387a] !border-amber-300/60"
              (click)="closeDropdowns()"
              class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-400/15 border border-transparent transition-colors group"
              role="menuitem"
            >
              <div class="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/35 flex items-center justify-center shrink-0 mt-0.5">
                <mat-icon class="!w-4 !h-4 !text-base icon-luminous">person</mat-icon>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white group-hover:text-cyan-200">Akademik Yaklaşım &amp; Hakkında</div>
                <div class="text-[11px] text-sky-200/85 leading-snug">Külliyat metodolojisi ve kurucu vizyonu</div>
              </div>
            </a>
          </div>
        }
      </div>

      <!-- 3. LABORATUVAR & KAYNAKLAR (Sub-Menu 2) -->
      <div class="relative">
        <button
          type="button"
          (click)="toggleMenu('lab', $event)"
          [attr.aria-expanded]="openMenu() === 'lab'"
          class="nav-pill-btn"
          [class.nav-pill-btn-active]="openMenu() === 'lab' || isLabRouteActive()"
        >
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">science</mat-icon>
          <span>Laboratuvar &amp; Lügat</span>
          <mat-icon
            class="!w-4 !h-4 !text-sm transition-transform duration-200"
            [class.rotate-180]="openMenu() === 'lab'"
          >
            expand_more
          </mat-icon>
        </button>

        @if (openMenu() === 'lab') {
          <div
            class="absolute left-0 top-full mt-2.5 w-80 rounded-2xl bg-[#071838] border border-sky-300/45 shadow-[0_22px_55px_rgba(2,8,23,0.92)] p-2.5 z-50 space-y-1 reveal-up"
            role="menu"
          >
            <div class="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 border-b border-sky-300/20 mb-1">
              İnteraktif Analiz, Lügat &amp; Sesli Deyiş
            </div>

            <a
              routerLink="/siir-laboratuvari"
              routerLinkActive="!bg-[#12387a] !border-amber-300/60"
              (click)="closeDropdowns()"
              class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-400/15 border border-transparent transition-colors group"
              role="menuitem"
            >
              <div class="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/35 flex items-center justify-center shrink-0 mt-0.5">
                <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">music_note</mat-icon>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white group-hover:text-amber-200">Aruz &amp; Hece Vezin Laboratuvarı</div>
                <div class="text-[11px] text-sky-200/85 leading-snug">Otomatik tef'ile, taktî ve vezin çözümleyici</div>
              </div>
            </a>

            <a
              routerLink="/lugat"
              routerLinkActive="!bg-[#12387a] !border-amber-300/60"
              (click)="closeDropdowns()"
              class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-400/15 border border-transparent transition-colors group"
              role="menuitem"
            >
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/35 flex items-center justify-center shrink-0 mt-0.5">
                <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">translate</mat-icon>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white group-hover:text-emerald-200">Felsefe &amp; Edebiyat Lügatı</div>
                <div class="text-[11px] text-sky-200/85 leading-snug">Klasik ıstılahlar ve felsefi kavramlar sözlüğü</div>
              </div>
            </a>

            <a
              routerLink="/kaynaklar"
              routerLinkActive="!bg-[#12387a] !border-amber-300/60"
              (click)="closeDropdowns()"
              class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-400/15 border border-transparent transition-colors group"
              role="menuitem"
            >
              <div class="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/35 flex items-center justify-center shrink-0 mt-0.5">
                <mat-icon class="!w-4 !h-4 !text-base icon-luminous">library_music</mat-icon>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white group-hover:text-cyan-200">Kaynaklar &amp; Telifsiz Deyiş</div>
                <div class="text-[11px] text-sky-200/85 leading-snug">Akademik arşivler ve canlı bağlama sentezleyici</div>
              </div>
            </a>
          </div>
        }
      </div>

      <!-- 4. %96 KONSENSÜS & KUANTUM BLOK ZİNCİRİ (Direct Primary Button) -->
      <a
        routerLink="/topluluk-onayi"
        routerLinkActive="nav-pill-btn-active"
        (click)="closeDropdowns()"
        class="nav-pill-btn !border-amber-400/50"
        title="Kuantum-Dirençli SHA3-512 + BLAKE2b-512 Ön-Konsensüs Emanet Zinciri, 1.000.000 Üye Barajı ve %96 Blok Zinciri Oylaması"
      >
        <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">shield_lock</mat-icon>
        <span>%96 Konsensüs &amp; Kuantum Mühür</span>
      </a>
    </nav>
  `,
})
export class HeaderNav {
  private readonly router = inject(Router);

  selectedDiscipline = input.required<DisciplineType | 'all'>();
  isHome = input.required<boolean>();
  filterBy = output<DisciplineType | 'all'>();

  readonly openMenu = signal<'archive' | 'lab' | null>(null);

  onKulliyatClick(): void {
    this.closeDropdowns();
    this.filterBy.emit('all');
  }

  toggleMenu(menu: 'archive' | 'lab', event: MouseEvent): void {
    event.stopPropagation();
    this.openMenu.update((curr) => (curr === menu ? null : menu));
  }

  closeDropdowns(): void {
    this.openMenu.set(null);
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target || !target.closest('app-header-nav')) {
      this.closeDropdowns();
    }
  }

  isArchiveRouteActive(): boolean {
    const url = this.router.url;
    return (
      url.startsWith('/sayilar') ||
      url.startsWith('/yazilarim') ||
      url.startsWith('/erenler-ve-makamlar') ||
      url.startsWith('/hakkinda')
    );
  }

  isLabRouteActive(): boolean {
    const url = this.router.url;
    return (
      url.startsWith('/siir-laboratuvari') ||
      url.startsWith('/lugat') ||
      url.startsWith('/kaynaklar')
    );
  }
}
