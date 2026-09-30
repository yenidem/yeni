import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {AcademicArticle, DISCIPLINE_DEFINITIONS} from '../../../../../core/models/article.model';

@Component({
  selector: 'app-recent-article-card',
  imports: [RouterLink, DatePipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <a 
      [routerLink]="['/makale', article().id]" 
      class="block p-3.5 rounded-2xl bg-glass-card group"
    >
      <div class="flex items-start gap-3">
        <div class="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-sky-300/30 bg-gradient-to-br from-sky-900/70 to-blue-950/90 flex items-center justify-center relative">
          @if (article().coverImage && !imgError()) {
            <img
              [src]="article().coverImage"
              [alt]="article().title"
              (error)="imgError.set(true)"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerpolicy="no-referrer"
            />
          } @else {
            <mat-icon class="!w-5 !h-5 !text-lg icon-luminous">
              {{ getDisciplineIcon() }}
            </mat-icon>
          }
          @if (index(); as idx) {
            <span class="absolute top-0.5 left-0.5 px-1 rounded bg-[#050f24]/85 text-[9px] font-mono font-bold text-amber-300 tabular-nums">
              0{{ idx }}
            </span>
          }
        </div>
        <div class="flex-1 min-w-0 space-y-1">
          <h4 class="text-xs font-serif font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-200 transition-colors">
            {{ article().title }}
          </h4>
          <div class="flex items-center gap-1.5 text-[10px] text-sky-200/80">
            <span class="font-mono tabular-nums">{{ article().publishedAt | date:'dd.MM.yy' }}</span>
            <span aria-hidden="true">·</span>
            <span class="font-mono tabular-nums">{{ article().readingTimeMinutes }} dk</span>
            <span aria-hidden="true">·</span>
            <span class="text-amber-300 font-semibold truncate">{{ getDisciplineShortLabel() }}</span>
          </div>
        </div>
      </div>
    </a>
  `
})
export class RecentArticleCard {
  article = input.required<AcademicArticle>();
  index = input<number>(0);
  readonly imgError = signal<boolean>(false);

  getDisciplineIcon(): string {
    return DISCIPLINE_DEFINITIONS[this.article().discipline]?.icon || 'auto_stories';
  }

  getDisciplineShortLabel(): string {
    return DISCIPLINE_DEFINITIONS[this.article().discipline]?.shortLabel || 'Külliyat';
  }
}
