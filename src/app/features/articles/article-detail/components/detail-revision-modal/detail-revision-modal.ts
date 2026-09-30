import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AcademicArticle } from '../../../../../core/models/article.model';

@Component({
  selector: 'app-detail-revision-modal',
  imports: [DatePipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="presentation"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      (click)="closeOnBackdrop($event)"
      (keydown.escape)="dismiss.emit()"
    >
      <div
        id="revision-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="revision-dialog-title"
        class="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#111a2e] to-[#0a101d] border border-amber-500/30 shadow-bottom-elevated shadow-quantum-amber p-6 text-slate-200 overflow-hidden"
      >
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <mat-icon class="text-xl">history</mat-icon>
            </div>
            <div>
              <h3 id="revision-dialog-title" class="text-base font-serif font-bold text-white tracking-tight">
                Metin Tashihi ve Revizyon Günlüğü
              </h3>
              <p class="text-xs text-amber-400/90 font-mono">Değiştirilemez Kripto Denetim İzi</p>
            </div>
          </div>
          <button
            type="button"
            (click)="dismiss.emit()"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <mat-icon class="text-lg">close</mat-icon>
          </button>
        </div>

        <div class="py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          @if (article().revisionHistory && article().revisionHistory!.length > 0) {
            <div class="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-500/30">
              @for (rev of article().revisionHistory; track rev.date; let idx = $index) {
                <div class="relative">
                  <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-[#0a101d]"></div>
                  <div class="p-3 rounded-xl bg-[#090f1d] border border-white/5 text-xs space-y-1">
                    <div class="flex items-center justify-between text-[11px] font-mono text-stone-400">
                      <span>Revizyon #{{ article().revisionHistory!.length - idx }}</span>
                      <span>{{ rev.date | date: 'dd.MM.yyyy HH:mm' }}</span>
                    </div>
                    <p class="font-serif font-semibold text-white">{{ rev.note }}</p>
                    <div class="text-[10px] font-mono text-cyan-300 break-all">
                      Hash: {{ rev.hash }}
                    </div>
                    <div class="text-[10px] text-stone-500">
                      Tashih Eden: {{ rev.author }}
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <p class="text-center text-xs text-stone-500 py-6">Kayıtlı revizyon bulunmuyor.</p>
          }
        </div>

        <div class="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            (click)="dismiss.emit()"
            class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DetailRevisionModalComponent {
  article = input.required<AcademicArticle>();
  dismiss = output<void>();

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.dismiss.emit();
    }
  }
}
