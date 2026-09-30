import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {ArticleService} from '../../../../../core/services/article.service';
import {LayoutService} from '../../../../../core/services/layout.service';
import {DisciplineType} from '../../../../../core/models/article.model';

export interface SidebarCategoryItem {
  name: string;
  query: string;
  description: string;
  icon?: string;
}

@Component({
  selector: 'app-category-card',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <button
      type="button"
      (click)="selectCategory()"
      class="w-full text-left flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all group cursor-pointer border"
      [class.bg-glass-card]="!isActive()"
      [class.bg-[#12387a]]="isActive()"
      [class.border-amber-300]="isActive()"
      [class.shadow-[0_0_18px_rgba(251,191,36,0.28)]]="isActive()"
      [class.border-sky-300/25]="!isActive()"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <mat-icon
          class="!w-4 !h-4 !text-base shrink-0"
          [class.icon-luminous]="discipline() === 'tde'"
          [class.icon-luminous-amber]="discipline() === 'felsefe'"
          [class.icon-luminous-emerald]="discipline() === 'kesisim'"
        >
          {{ category().icon || 'auto_stories' }}
        </mat-icon>
        <div class="min-w-0">
          <span
            class="block text-xs font-bold truncate transition-colors"
            [class.text-amber-200]="isActive()"
            [class.text-stone-100]="!isActive()"
            [class.group-hover:text-cyan-200]="!isActive()"
          >
            {{ category().name }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        @if (isActive()) {
          <span class="px-1.5 py-0.5 rounded-md bg-amber-400 text-stone-950 text-[9px] font-mono font-extrabold">
            AÇIK
          </span>
        }
        <mat-icon
          class="!w-4 !h-4 !text-base text-sky-300/75 transition-transform group-hover:translate-x-0.5 shrink-0 group-hover:text-cyan-200"
        >
          chevron_right
        </mat-icon>
      </div>
    </button>
  `,
})
export class CategoryCard {
  private readonly router = inject(Router);
  private readonly articleService = inject(ArticleService);
  private readonly layoutService = inject(LayoutService);

  category = input.required<SidebarCategoryItem>();
  discipline = input.required<DisciplineType>();

  isActive(): boolean {
    return (
      this.articleService.centerStageView() === 'category' &&
      this.articleService.selectedDiscipline() === this.discipline() &&
      this.articleService.searchQuery().toLowerCase() === this.category().query.toLowerCase()
    );
  }

  selectCategory(): void {
    this.articleService.openCategoryInCenter({
      discipline: this.discipline(),
      query: this.category().query,
      title: this.category().name,
      description: this.category().description,
    });
    this.layoutService.closeAllDrawers();
    this.router.navigate(['/'], {
      queryParams: {discipline: this.discipline(), q: this.category().query},
    });
  }
}
