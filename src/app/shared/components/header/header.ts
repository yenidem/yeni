import {ChangeDetectionStrategy, Component, inject, output, signal} from '@angular/core';
import {Router} from '@angular/router';
import {ArticleService} from '../../../core/services/article.service';
import {DisciplineType} from '../../../core/models/article.model';
import {HeaderRibbon} from './components/header-ribbon';
import {HeaderBrand} from './components/header-brand';
import {HeaderNav} from './components/header-nav';
import {HeaderActions} from './components/header-actions';
import {MobileDrawer} from './components/mobile-drawer';

@Component({
  selector: 'app-header',
  imports: [
    HeaderRibbon,
    HeaderBrand,
    HeaderNav,
    HeaderActions,
    MobileDrawer
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
  template: `
    <!-- Top Thin Scholarly Ribbon -->
    <app-header-ribbon (searchTrigger)="searchTrigger.emit()" />

    <!-- Main Navigation Masthead (Vibrant Electric & Royal Blue) -->
    <header class=" bg-gradient-to-r from-[#07152e]/95 via-[#0b2147]/95 to-[#07152e]/95 backdrop-blur-2xl border-b border-sky-400/30 text-stone-100 shadow-[0_10px_30px_rgba(2,8,23,0.65)]">
      <div class="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-4 h-18 sm:h-20">
          
          <app-header-brand (brandClick)="filterBy('all')" />

          <app-header-nav 
            [selectedDiscipline]="articleService.selectedDiscipline()"
            [isHome]="isHome()"
            (filterBy)="filterBy($event)"
          />

          <app-header-actions 
            [mobileMenuOpen]="mobileMenuOpen()"
            (searchTrigger)="searchTrigger.emit()"
            (bookmarksTrigger)="bookmarksTrigger.emit()"
            (toggleMobileMenu)="mobileMenuOpen.set(!mobileMenuOpen())"
          />

        </div>

        @if (mobileMenuOpen()) {
          <app-mobile-drawer 
            (searchTrigger)="searchTrigger.emit(); mobileMenuOpen.set(false)"
            (dismiss)="mobileMenuOpen.set(false)"
          />
        }
      </div>
    </header>
  `,
})
export class Header {
  readonly articleService = inject(ArticleService);
  readonly router = inject(Router);

  readonly searchTrigger = output<void>();
  readonly bookmarksTrigger = output<void>();
  readonly mobileMenuOpen = signal<boolean>(false);

  isHome(): boolean {
    return this.router.url === '/' || this.router.url.startsWith('/?');
  }

  filterBy(discipline: DisciplineType | 'all'): void {
    this.mobileMenuOpen.set(false);
    if (discipline === 'all') {
      this.articleService.resetToMainDashboard();
      this.router.navigate(['/']);
    } else {
      this.articleService.openCategoryInCenter({
        discipline,
        query: '',
        title:
          discipline === 'tde'
            ? 'Türk Dili ve Edebiyatı Kürsüsü'
            : discipline === 'felsefe'
              ? 'Felsefe ve Analitik Tefekkür Kürsüsü'
              : 'Disiplinlerarası Kesişim & Anadolu İrfanı',
        description:
          'Seçili kürsü kapsamında neşredilen SHA-512 mühürlü akademik makaleler, beyit şerhleri ve felsefi tahliller.',
      });
      this.router.navigate(['/'], {queryParams: {discipline}});
    }
  }
}
