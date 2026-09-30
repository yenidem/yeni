import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AcademicArticle } from '../../../../core/models/article.model';
import { SecurityService } from '../../../../core/services/security.service';

@Component({
  selector: 'app-security-badge',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="onOpenVerifier($event)"
      title="Kuantum Dirençli SHA-512 Kriptografik Doğrulama Raporunu Gör"
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all cursor-pointer border shadow-sm
        bg-cyan-950/40 border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 hover:shadow-cyan-500/20"
    >
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
      </span>
      <mat-icon class="text-[13px] leading-none">shield</mat-icon>
      <span class="tracking-wide">SHA-512 Kuantum Mühür</span>
    </button>
  `,
})
export class SecurityBadge {
  readonly article = input.required<AcademicArticle>();
  private readonly securityService = inject(SecurityService);

  onOpenVerifier(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.securityService.openVerifierModal(this.article());
  }
}
