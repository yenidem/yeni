import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-footer-sections',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
      <!-- Academic Disciplines -->
      <div class="space-y-3.5">
        <h4 class="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
          <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">school</mat-icon>
          <span>Çalışma Alanları</span>
        </h4>
        <ul class="space-y-2.5 text-sm text-stone-300">
          <li>
            <a [routerLink]="['/']" [queryParams]="{discipline: 'tde'}" class="hover:text-cyan-300 transition-colors flex items-center gap-2">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">chevron_right</mat-icon>
              <span>Türk Dili ve Edebiyatı</span>
            </a>
          </li>
          <li>
            <a [routerLink]="['/']" [queryParams]="{discipline: 'felsefe'}" class="hover:text-cyan-300 transition-colors flex items-center gap-2">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-emerald">chevron_right</mat-icon>
              <span>Felsefe & Epistemoloji</span>
            </a>
          </li>
          <li>
            <a [routerLink]="['/']" [queryParams]="{discipline: 'kesisim'}" class="hover:text-cyan-300 transition-colors flex items-center gap-2">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">chevron_right</mat-icon>
              <span>Disiplinlerarası Kesişim</span>
            </a>
          </li>
          <li>
            <a routerLink="/erenler-ve-makamlar" class="hover:text-cyan-300 transition-colors flex items-center gap-2">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">chevron_right</mat-icon>
              <span>Anadolu İrfan Kürsüsü</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Quick Navigation -->
      <div class="space-y-3.5">
        <h4 class="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
          <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">explore</mat-icon>
          <span>Hızlı Erişim</span>
        </h4>
        <ul class="space-y-2.5 text-sm text-stone-300">
          <li>
            <a routerLink="/" class="hover:text-cyan-300 transition-colors flex items-center gap-2">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">auto_stories</mat-icon>
              <span>Tüm Makaleler</span>
            </a>
          </li>
          <li>
            <a routerLink="/sayilar" class="hover:text-cyan-300 transition-colors flex items-center gap-2">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">collections_bookmark</mat-icon>
              <span>Mecmua Sayıları</span>
            </a>
          </li>
          <li>
            <a routerLink="/yazilarim" class="hover:text-cyan-300 transition-colors flex items-center gap-2">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">history_edu</mat-icon>
              <span>Tefekkür Defteri</span>
            </a>
          </li>
          <li>
            <a routerLink="/hakkinda" class="hover:text-cyan-300 transition-colors flex items-center gap-2">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">person</mat-icon>
              <span>Yazar & Metodoloji</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Interactive Tools -->
      <div class="space-y-3.5">
        <h4 class="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
          <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">architecture</mat-icon>
          <span>Akademik Araçlar</span>
        </h4>
        <ul class="space-y-2.5 text-sm text-stone-300">
          <li>
            <a routerLink="/siir-laboratuvari" class="hover:text-amber-300 transition-colors flex items-center gap-2">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">music_note</mat-icon>
              <span>Aruz & Hece Vezin Lab</span>
            </a>
          </li>
          <li>
            <a routerLink="/lugat" class="hover:text-amber-300 transition-colors flex items-center gap-2">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-emerald">translate</mat-icon>
              <span>Istılahlar & Lügat</span>
            </a>
          </li>
          <li>
            <a routerLink="/yaz" class="hover:text-amber-300 transition-colors flex items-center gap-2">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">edit_note</mat-icon>
              <span>Yeni Makale Telifi</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class FooterSections {}
