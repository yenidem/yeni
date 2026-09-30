import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {AmbientAudioService, CuratedDeyisTrack} from '../../../core/services/ambient-audio.service';
import {SpeechService} from '../../../core/services/speech.service';
import {LayoutService} from '../../../core/services/layout.service';
import {UserCustomizationService} from '../../../core/services/user-customization.service';

@Component({
  selector: 'app-ambient-audio-bar',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (customization.showFloatingAudioButton() || audioService.isPlaying() || speechService.isSpeaking()) {
      <!-- Floating Minimal Scholar Audio & Deyiş Dock -->
      <div
        class="fixed bottom-11 sm:bottom-12 right-3 sm:right-5 z-40 flex flex-col items-end"
      >
        @if (layoutService.isAudioDeckOpen()) {
          <!-- Expanded Scholar Control Deck -->
          <div class="mb-2.5 w-[calc(100vw-1.5rem)] sm:w-[410px] max-h-[82vh] overflow-y-auto custom-scrollbar rounded-3xl bg-glass-blue border border-sky-300/45 p-4 sm:p-5 shadow-[0_24px_60px_rgba(2,8,23,0.95)] space-y-3.5 reveal-up">
            
            <!-- Top Header -->
            <div class="flex items-center justify-between pb-3 border-b border-sky-300/20">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400/45 flex items-center justify-center shrink-0">
                  <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">music_note</mat-icon>
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-serif font-bold text-white tracking-wide">
                    Telifsiz Deyiş, Bağlama &amp; Sesli Okuma
                  </h4>
                  <p class="text-[10px] text-sky-200/85 font-mono">
                    %100 Telifsiz Web Audio Sentezi · Hüseynî &amp; Rast
                  </p>
                </div>
              </div>

              <button
                type="button"
                (click)="layoutService.isAudioDeckOpen.set(false)"
                class="p-1.5 rounded-xl text-sky-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Paneli Küçült"
              >
                <mat-icon class="!w-4 !h-4 !text-sm">close</mat-icon>
              </button>
            </div>

            <!-- Live Active Status / Teleprompter Banner -->
            @if (audioService.isPlaying() || speechService.isSpeaking()) {
              <div class="p-3 rounded-2xl bg-[#051024]/95 border border-amber-400/40 space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 font-bold truncate">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                    @if (speechService.isSpeaking()) {
                      <span class="truncate">{{ speechService.currentTitle() }}</span>
                    } @else {
                      <span>Canlı Perde: {{ audioService.activeNoteLabel() }}</span>
                    }
                  </div>
                  <button
                    type="button"
                    (click)="stopAllAudio()"
                    class="px-2 py-0.5 rounded-lg bg-rose-500/25 hover:bg-rose-500/40 border border-rose-400/50 text-rose-200 text-[10px] font-bold cursor-pointer shrink-0"
                  >
                    Tümünü Sustur
                  </button>
                </div>

                @if (speechService.isSpeaking() && speechService.activeSubtitle()) {
                  <p class="text-xs font-serif italic text-amber-100/95 bg-[#081b3d]/80 p-2.5 rounded-xl border border-sky-300/20 leading-relaxed">
                    &ldquo;{{ speechService.activeSubtitle() }}&rdquo;
                  </p>
                  <div class="flex items-center justify-between gap-2 pt-0.5">
                    <div class="flex items-center gap-1">
                      <button
                        type="button"
                        (click)="speechService.togglePlayPause()"
                        class="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-300/35 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <mat-icon class="!w-3.5 !h-3.5 !text-xs">
                          {{ speechService.isPaused() ? 'play_arrow' : 'pause' }}
                        </mat-icon>
                        <span>{{ speechService.isPaused() ? 'Devam Et' : 'Duraklat' }}</span>
                      </button>
                      <button
                        type="button"
                        (click)="speechService.stop()"
                        class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-sky-200 text-[11px] font-semibold cursor-pointer"
                      >
                        Okumayı Bitir
                      </button>
                    </div>

                    <div class="flex items-center gap-1 text-[10px] font-mono text-sky-200">
                      <span>Hız:</span>
                      @for (r of [0.9, 1.0, 1.15]; track r) {
                        <button
                          type="button"
                          (click)="speechService.setRate(r)"
                          class="px-1.5 py-0.5 rounded cursor-pointer"
                          [class.bg-amber-400]="speechService.currentRate() === r"
                          [class.text-stone-950]="speechService.currentRate() === r"
                          [class.font-bold]="speechService.currentRate() === r"
                          [class.bg-white/10]="speechService.currentRate() !== r"
                        >
                          {{ r }}x
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Deck View Switcher: Ambiyans Sentezi vs Sözlü Deyiş Dinletisi -->
            <div class="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#050f24]/80 border border-sky-300/20">
              <button
                type="button"
                (click)="activeTab.set('synth')"
                class="py-1.5 px-2.5 rounded-xl text-[11px] font-serif font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                [class.bg-sky-400/25]="activeTab() === 'synth'"
                [class.text-white]="activeTab() === 'synth'"
                [class.border]="activeTab() === 'synth'"
                [class.border-sky-300/45]="activeTab() === 'synth'"
                [class.text-sky-200/75]="activeTab() !== 'synth'"
              >
                <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">graphic_eq</mat-icon>
                <span>Bağlama &amp; Ambiyans</span>
              </button>

              <button
                type="button"
                (click)="activeTab.set('deyis')"
                class="py-1.5 px-2.5 rounded-xl text-[11px] font-serif font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                [class.bg-amber-400/25]="activeTab() === 'deyis'"
                [class.text-amber-200]="activeTab() === 'deyis'"
                [class.border]="activeTab() === 'deyis'"
                [class.border-amber-300/45]="activeTab() === 'deyis'"
                [class.text-sky-200/75]="activeTab() !== 'deyis'"
              >
                <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">record_voice_over</mat-icon>
                <span>Sözlü Deyiş Dinle</span>
              </button>
            </div>

            @if (activeTab() === 'synth') {
              <!-- Sound Mode Cards -->
              <div class="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                @for (mode of audioService.availableModes; track mode.id) {
                  <button
                    type="button"
                    (click)="audioService.setMode(mode.id)"
                    class="w-full text-left p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3"
                    [class.bg-amber-500/15]="audioService.currentMode() === mode.id"
                    [class.border-amber-400/50]="audioService.currentMode() === mode.id"
                    [class.bg-[#071633]/75]="audioService.currentMode() !== mode.id"
                    [class.border-sky-300/20]="audioService.currentMode() !== mode.id"
                    [class.hover:bg-sky-400/15]="audioService.currentMode() !== mode.id"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div
                        class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                        [class.bg-amber-400]="audioService.currentMode() === mode.id"
                        [class.text-stone-950]="audioService.currentMode() === mode.id"
                        [class.bg-white/10]="audioService.currentMode() !== mode.id"
                        [class.text-sky-200]="audioService.currentMode() !== mode.id"
                      >
                        <mat-icon class="!w-4 !h-4 !text-sm">{{ mode.icon }}</mat-icon>
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5">
                          <span class="block text-xs font-serif font-bold text-white truncate">{{ mode.name }}</span>
                        </div>
                        <span class="block text-[10px] text-sky-200/80 truncate">{{ mode.subtitle }}</span>
                      </div>
                    </div>

                    @if (audioService.currentMode() === mode.id && audioService.isPlaying()) {
                      <span class="flex items-center gap-0.5 text-amber-300 pr-1 shrink-0">
                        <span class="w-1 h-3 rounded-full bg-amber-300 animate-pulse"></span>
                        <span class="w-1 h-5 rounded-full bg-amber-300 animate-pulse"></span>
                        <span class="w-1 h-2.5 rounded-full bg-amber-300 animate-pulse"></span>
                      </span>
                    } @else {
                      <span class="text-[10px] font-mono text-emerald-300/90 shrink-0">
                        Seç &amp; Çal
                      </span>
                    }
                  </button>
                }
              </div>
            } @else {
              <!-- Curated Deyiş & Nefes Recitation List (Bağlama Eşliğinde) -->
              <div class="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                @for (track of audioService.curatedDeyisler; track track.id) {
                  <div
                    class="p-3 rounded-2xl border space-y-2 transition-colors"
                    [class.bg-amber-500/15]="audioService.activeDeyisId() === track.id && speechService.isSpeaking()"
                    [class.border-amber-300/50]="audioService.activeDeyisId() === track.id && speechService.isSpeaking()"
                    [class.bg-[#071633]/85]="!(audioService.activeDeyisId() === track.id && speechService.isSpeaking())"
                    [class.border-sky-300/25]="!(audioService.activeDeyisId() === track.id && speechService.isSpeaking())"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <div class="min-w-0">
                        <span class="text-[10px] font-mono text-amber-300 font-semibold block truncate">{{ track.ozan }} · {{ track.makam }}</span>
                        <h5 class="text-xs font-serif font-bold text-white truncate">{{ track.title }}</h5>
                      </div>
                      @if (audioService.activeDeyisId() === track.id && speechService.isSpeaking()) {
                        <button
                          type="button"
                          (click)="stopAllAudio()"
                          class="px-2.5 py-1.5 rounded-xl bg-rose-500/30 hover:bg-rose-500/45 border border-rose-300/50 text-rose-100 font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <mat-icon class="!w-3.5 !h-3.5 !text-xs">stop_circle</mat-icon>
                          <span>Durdur</span>
                        </button>
                      } @else {
                        <button
                          type="button"
                          (click)="playDeyisWithBaglama(track)"
                          class="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
                          title="Arka planda telifsiz bağlama ezgisiyle birlikte deyişi sesli dinle"
                        >
                          <mat-icon class="!w-3.5 !h-3.5 !text-xs">play_circle</mat-icon>
                          <span>Dinle</span>
                        </button>
                      }
                    </div>
                    <p class="text-[11px] font-serif italic text-sky-100/90 leading-relaxed">
                      &ldquo;{{ track.couplet }}&rdquo;
                    </p>
                  </div>
                }
              </div>
            }

            <!-- Controls: Volume & Timer -->
            <div class="pt-2 border-t border-sky-300/20 space-y-3">
              <!-- Volume Slider -->
              <div class="flex items-center justify-between gap-3 text-xs text-sky-200">
                <mat-icon class="!w-4 !h-4 !text-base icon-luminous">volume_down</mat-icon>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  [value]="audioService.volume()"
                  (input)="onVolumeChange($event)"
                  aria-label="Ses Seviyesi"
                  class="flex-1 accent-amber-400 h-1.5 rounded-lg bg-white/20 cursor-pointer"
                />
                <span class="font-mono text-[10px] text-amber-300 w-8 text-right">%{{ (audioService.volume() * 100).toFixed(0) }}</span>
              </div>

              <!-- Timer Dropdown & Master Play/Stop -->
              <div class="flex items-center justify-between gap-2 pt-1">
                <div class="flex items-center gap-1.5 text-xs text-sky-200">
                  <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">timer</mat-icon>
                  <select
                    [value]="audioService.selectedTimerMinutes()"
                    (change)="onTimerChange($event)"
                    aria-label="Zamanlayıcı"
                    class="bg-[#06132c] border border-sky-300/30 rounded-xl px-2 py-1 text-[11px] text-white focus:outline-hidden cursor-pointer"
                  >
                    <option [value]="0">Süresiz</option>
                    <option [value]="15">15 Dk Odak</option>
                    <option [value]="30">30 Dk Etüt</option>
                    <option [value]="45">45 Dk Tefekkür</option>
                    <option [value]="60">60 Dk Cilt Okuma</option>
                  </select>
                  @if (audioService.remainingSeconds() > 0) {
                    <span class="text-[10px] font-mono text-amber-300">
                      {{ audioService.formatTime(audioService.remainingSeconds()) }}
                    </span>
                  }
                </div>

                <!-- Master Play Button -->
                <button
                  type="button"
                  (click)="toggleMasterPlay()"
                  class="px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  [class.bg-amber-400]="!audioService.isPlaying() && !speechService.isSpeaking()"
                  [class.hover:bg-amber-300]="!audioService.isPlaying() && !speechService.isSpeaking()"
                  [class.text-stone-950]="!audioService.isPlaying() && !speechService.isSpeaking()"
                  [class.bg-rose-500/25]="audioService.isPlaying() || speechService.isSpeaking()"
                  [class.border]="audioService.isPlaying() || speechService.isSpeaking()"
                  [class.border-rose-400/50]="audioService.isPlaying() || speechService.isSpeaking()"
                  [class.text-rose-200]="audioService.isPlaying() || speechService.isSpeaking()"
                >
                  <mat-icon class="!w-4 !h-4 !text-base">
                    {{ audioService.isPlaying() || speechService.isSpeaking() ? 'stop' : 'play_arrow' }}
                  </mat-icon>
                  <span>{{ audioService.isPlaying() || speechService.isSpeaking() ? 'Sustur' : 'Bağlama Başlat' }}</span>
                </button>
              </div>
            </div>

          </div>
        }

        <!-- Minimized Floating Bubble Trigger -->
        <div class="flex items-center gap-1.5">
          @if (audioService.isPlaying() || speechService.isSpeaking()) {
            <button
              type="button"
              (click)="stopAllAudio()"
              class="h-10 sm:h-11 px-3 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white border border-rose-300/60 shadow-xl flex items-center gap-1 text-xs font-bold cursor-pointer transition-all"
              title="Müziği ve Sesli Okumayı Anında Durdur"
            >
              <mat-icon class="!w-4 !h-4 !text-base">stop</mat-icon>
              <span class="hidden sm:inline">Sustur</span>
            </button>
          }

          <button
            type="button"
            (click)="layoutService.toggleAudioDeck()"
            class="h-10 sm:h-11 px-3.5 sm:px-4 rounded-2xl flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-2xl relative border"
            [class.bg-gradient-to-r]="audioService.isPlaying() || speechService.isSpeaking()"
            [class.from-amber-500]="audioService.isPlaying() || speechService.isSpeaking()"
            [class.to-amber-400]="audioService.isPlaying() || speechService.isSpeaking()"
            [class.text-stone-950]="audioService.isPlaying() || speechService.isSpeaking()"
            [class.border-amber-200]="audioService.isPlaying() || speechService.isSpeaking()"
            [class.btn-toggle-luminous]="!audioService.isPlaying() && !speechService.isSpeaking()"
            [class.text-white]="!audioService.isPlaying() && !speechService.isSpeaking()"
            title="Telifsiz Anadolu Bağlama, Deyiş ve Sesli Okuma Kürsüsü"
          >
            <mat-icon class="!w-4 sm:!w-5 !h-4 sm:!h-5 !text-lg sm:!text-xl" [class.icon-luminous-amber]="!audioService.isPlaying() && !speechService.isSpeaking()">
              {{ audioService.isPlaying() || speechService.isSpeaking() ? 'graphic_eq' : 'music_note' }}
            </mat-icon>
            <span class="text-xs font-serif font-bold">
              {{ layoutService.isAudioDeckOpen() ? 'Kapat' : (audioService.isPlaying() || speechService.isSpeaking() ? 'Çalıyor · Deyiş' : 'Deyiş & Bağlama') }}
            </span>

            @if (audioService.isPlaying() || speechService.isSpeaking()) {
              <span class="w-2 h-2 rounded-full bg-emerald-500 border border-stone-950 animate-ping"></span>
            }
          </button>
        </div>
      </div>
    }
  `,
})
export class AmbientAudioBarComponent {
  readonly audioService = inject(AmbientAudioService);
  readonly speechService = inject(SpeechService);
  readonly layoutService = inject(LayoutService);
  readonly customization = inject(UserCustomizationService);

  readonly activeTab = signal<'synth' | 'deyis'>('synth');

  playDeyisWithBaglama(track: CuratedDeyisTrack): void {
    this.audioService.activeDeyisId.set(track.id);
    this.audioService.setVolume(0.28);
    this.audioService.setMode('baglama-deyis');
    this.speechService.speak(track.narration, `${track.ozan} — ${track.title}`);
  }

  toggleMasterPlay(): void {
    if (this.audioService.isPlaying() || this.speechService.isSpeaking()) {
      this.stopAllAudio();
    } else {
      this.audioService.play();
    }
  }

  stopAllAudio(): void {
    this.audioService.stop();
    this.speechService.stop();
  }

  onVolumeChange(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.audioService.setVolume(val);
  }

  onTimerChange(event: Event): void {
    const val = parseInt((event.target as HTMLSelectElement).value, 10);
    this.audioService.setTimer(val);
  }
}
