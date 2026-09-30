import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {DISCIPLINE_DEFINITIONS, DisciplineType} from '../../../core/models/article.model';

@Component({
  selector: 'app-discipline-badge',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shadow-xs transition-colors ' + meta().badgeClass"
    >
      <mat-icon class="!w-4 !h-4 !text-base leading-none">{{ meta().icon }}</mat-icon>
      <span>{{ meta().shortLabel }}</span>
    </span>
  `,
})
export class DisciplineBadge {
  readonly discipline = input.required<DisciplineType>();

  readonly meta = computed(() => {
    return DISCIPLINE_DEFINITIONS[this.discipline()] || DISCIPLINE_DEFINITIONS.kesisim;
  });
}
