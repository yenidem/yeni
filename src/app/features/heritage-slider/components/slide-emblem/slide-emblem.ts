import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {HeritageSlide} from '../../models/heritage-slide.model';

@Component({
  selector: 'app-slide-emblem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full aspect-square max-w-[260px] mx-auto flex items-center justify-center select-none">
      <!-- Outer Rotating Sacred Geometry Ring -->
      <div class="absolute inset-0 rounded-full border border-sky-300/35 bg-gradient-to-br from-sky-500/15 via-[#071633] to-cyan-500/15 shadow-2xl shadow-black/80"></div>
      <div class="absolute inset-3 rounded-full border border-dashed border-amber-300/25"></div>

      @switch (slide().emblemType) {
        @case ('ataturk') {
          <div class="w-full h-full p-2.5 rounded-full overflow-hidden relative">
            <img
              [src]="ataturkError() ? '/logo.svg' : '/src/assets/images/ataturk_library_nutuk_1790712520394.jpg'"
              alt="Gazi Mustafa Kemal Atatürk"
              (error)="ataturkError.set(true)"
              class="w-full h-full object-cover rounded-full border-2 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.4)]"
              referrerpolicy="no-referrer"
            />
          </div>
        }

        @case ('haci-bektas') {
          <div class="w-full h-full p-2.5 rounded-full overflow-hidden relative">
            <img
              [src]="bektasError() ? '/logo.svg' : '/src/assets/images/haci_bektas_veli_portrait_1790712530952.jpg'"
              alt="Hünkâr Hacı Bektâş-ı Velî"
              (error)="bektasError.set(true)"
              class="w-full h-full object-cover rounded-full border-2 border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
              referrerpolicy="no-referrer"
            />
          </div>
        }

        @default {
          <!-- Official YENİDEM 3D Sapphire Sphere Logo Medallion for Ozanlar & Default Emblem -->
          <div class="w-full h-full p-3 rounded-full overflow-hidden relative flex items-center justify-center">
            <img
              src="/logo.svg"
              [alt]="slide().name + ' — YENİDEM İrfan Mührü'"
              class="w-full h-full object-contain rounded-full drop-shadow-[0_0_22px_rgba(56,189,248,0.5)]"
            />
          </div>
        }
      }
    </div>
  `,
})
export class SlideEmblemComponent {
  readonly slide = input.required<HeritageSlide>();
  readonly ataturkError = signal<boolean>(false);
  readonly bektasError = signal<boolean>(false);
}
