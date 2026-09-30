import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AiAcademicOptimization } from '../../../../../core/models/article.model';

@Component({
  selector: 'app-editor-ai-dialog',
  imports: [MatIconModule],
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
        id="ai-academic-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-dialog-title"
        class="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#111a2e] to-[#0a101d] border border-amber-500/40 shadow-bottom-elevated shadow-quantum-amber p-6 text-slate-200 overflow-hidden"
      >
        <!-- Ambient top line -->
        <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <mat-icon class="text-xl">auto_awesome</mat-icon>
            </div>
            <div>
              <h3 id="ai-dialog-title" class="text-base font-serif font-bold text-white tracking-wide">
                Akademik Şerh & Metin İncelemesi
              </h3>
              <p class="text-xs text-amber-300 font-mono">TDE & Felsefe Akıl Yürütme Motoru</p>
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

        <!-- Body -->
        <div class="flex-1 overflow-y-auto py-5 space-y-6 text-xs font-sans text-stone-200">
          @if (data(); as result) {
            <!-- Academic Summary -->
            <div class="p-4 rounded-xl bg-[#090f1d] border border-amber-500/20 space-y-2">
              <span class="font-serif font-bold text-amber-300 text-sm block">Genel Akademik Değerlendirme</span>
              <p class="leading-relaxed text-stone-300">{{ result.academicSummary }}</p>
              @if (result.refinedTitle) {
                <div class="pt-2 border-t border-white/5 text-[11px] font-mono text-cyan-300">
                  Önerilen Rafine Başlık: <strong class="text-white">{{ result.refinedTitle }}</strong>
                </div>
              }
            </div>

            <!-- TDE Language Critique -->
            @if (result.tdeLanguageCritique && result.tdeLanguageCritique.length > 0) {
              <div>
                <h4 class="font-serif font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <mat-icon class="!w-4 !h-4 !text-sm text-cyan-400">edit_note</mat-icon>
                  <span>Türk Dili ve Üslûp Tahlili</span>
                </h4>
                <ul class="space-y-1.5 pl-4 list-disc text-stone-300">
                  @for (sug of result.tdeLanguageCritique; track sug) {
                    <li>{{ sug }}</li>
                  }
                </ul>
              </div>
            }

            <!-- Philosophical Critique -->
            @if (result.philosophicalArgumentCritique && result.philosophicalArgumentCritique.length > 0) {
              <div>
                <h4 class="font-serif font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <mat-icon class="!w-4 !h-4 !text-sm text-amber-400">psychology</mat-icon>
                  <span>Felsefi ve Mantıksal Açılımlar</span>
                </h4>
                <ul class="space-y-1.5 pl-4 list-disc text-stone-300">
                  @for (obs of result.philosophicalArgumentCritique; track obs) {
                    <li>{{ obs }}</li>
                  }
                </ul>
              </div>
            }

            <!-- Recommended Keywords -->
            @if (result.recommendedKeywords && result.recommendedKeywords.length > 0) {
              <div>
                <h4 class="font-serif font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <mat-icon class="!w-4 !h-4 !text-sm text-amber-300">sell</mat-icon>
                  <span>Önerilen Anahtar Kavramlar</span>
                </h4>
                <div class="flex flex-wrap gap-1.5">
                  @for (kw of result.recommendedKeywords; track kw) {
                    <span class="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-mono">
                      #{{ kw }}
                    </span>
                  }
                </div>
              </div>
            }

            <!-- Potential References -->
            @if (result.potentialReferences && result.potentialReferences.length > 0) {
              <div>
                <h4 class="font-serif font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <mat-icon class="!w-4 !h-4 !text-sm text-emerald-400">library_books</mat-icon>
                  <span>Önerilen Tamamlayıcı Kaynaklar</span>
                </h4>
                <div class="space-y-1 p-3 rounded-xl bg-[#090f1d] border border-white/5 font-mono text-[11px] text-stone-300">
                  @for (ref of result.potentialReferences; track ref) {
                    <div>&bull; {{ ref }}</div>
                  }
                </div>
              </div>
            }
          } @else {
            <div class="py-12 flex flex-col items-center justify-center text-amber-400 space-y-3">
              <mat-icon class="!w-8 !h-8 !text-3xl animate-spin">sync</mat-icon>
              <p class="font-serif text-sm">Metin şerh ve tahlil ediliyor...</p>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="pt-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            (click)="dismiss.emit()"
            class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Tamam, Düzenlemeye Dön
          </button>
        </div>
      </div>
    </div>
  `,
})
export class EditorAiDialogComponent {
  data = input<AiAcademicOptimization | null>(null);
  dismiss = output<void>();

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.dismiss.emit();
    }
  }
}
