import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {SpeechService} from '../../../../../core/services/speech.service';
import {AcademicArticle} from '../../../../../core/models/article.model';

@Component({
  selector: 'app-detail-audio-player',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (speechService.isSupported()) {
      <div class="p-3 sm:p-4 rounded-2xl bg-[#080d19] border border-amber-500/30 shadow-xl flex flex-wrap items-center justify-between gap-3 text-stone-200">
        <!-- Player Info -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="handlePlayToggle()"
            class="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            [title]="speechService.isSpeaking() && !speechService.isPaused() ? 'Duraklat' : 'Sesli Dinle'"
          >
            <mat-icon class="!w-5 !h-5 !text-xl text-stone-950">
              {{ speechService.isSpeaking() && !speechService.isPaused() ? 'pause' : 'play_arrow' }}
            </mat-icon>
          </button>

          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-serif font-bold text-white">
                {{ speechService.isSpeaking() ? 'Makale Seslendiriliyor' : 'Makaleyi Sesli Dinleyin' }}
              </span>
              @if (speechService.isSpeaking() && !speechService.isPaused()) {
                <span class="flex gap-0.5 items-end h-3">
                  <span class="w-1 bg-amber-400 animate-pulse h-2"></span>
                  <span class="w-1 bg-amber-400 animate-pulse h-3"></span>
                  <span class="w-1 bg-amber-400 animate-pulse h-1.5"></span>
                </span>
              }
            </div>
            <p class="text-[11px] text-stone-400 font-mono">
              Web Ses Motoru &bull; Türkçe Diksiyon
            </p>
          </div>
        </div>

        <!-- Controls: Speed and Stop -->
        <div class="flex items-center gap-2">
          <!-- Speed Buttons -->
          <div class="flex items-center bg-[#0e1627] rounded-xl p-1 border border-white/5 text-xs font-mono">
            <button
              type="button"
              (click)="speechService.setRate(0.8)"
              class="px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
              [class.bg-amber-500]="speechService.currentRate() === 0.8"
              [class.text-stone-950]="speechService.currentRate() === 0.8"
              [class.text-stone-400]="speechService.currentRate() !== 0.8"
            >
              0.8x
            </button>
            <button
              type="button"
              (click)="speechService.setRate(1.0)"
              class="px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
              [class.bg-amber-500]="speechService.currentRate() === 1.0"
              [class.text-stone-950]="speechService.currentRate() === 1.0"
              [class.text-stone-400]="speechService.currentRate() !== 1.0"
            >
              1.0x
            </button>
            <button
              type="button"
              (click)="speechService.setRate(1.25)"
              class="px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
              [class.bg-amber-500]="speechService.currentRate() === 1.25"
              [class.text-stone-950]="speechService.currentRate() === 1.25"
              [class.text-stone-400]="speechService.currentRate() !== 1.25"
            >
              1.25x
            </button>
          </div>

          @if (speechService.isSpeaking()) {
            <button
              type="button"
              (click)="speechService.stop()"
              class="p-2 rounded-xl text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Durdur"
            >
              <mat-icon class="!w-4 !h-4 !text-base">stop</mat-icon>
            </button>
          }
        </div>
      </div>
    }
  `,
})
export class DetailAudioPlayerComponent {
  readonly article = input.required<AcademicArticle>();
  readonly speechService = inject(SpeechService);

  handlePlayToggle(): void {
    if (this.speechService.isSpeaking()) {
      this.speechService.togglePlayPause();
    } else {
      const fullText = `${this.article().title}. ${this.article().abstract ? 'Özet: ' + this.article().abstract : ''}. ${this.article().content}`;
      this.speechService.speak(fullText, this.article().title);
    }
  }
}
