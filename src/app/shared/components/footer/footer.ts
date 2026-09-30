import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FooterBrand} from './components/footer-brand';
import {FooterSections} from './components/footer-sections';
import {FooterLegal} from './components/footer-legal';

@Component({
  selector: 'app-footer',
  imports: [
    FooterBrand,
    FooterSections,
    FooterLegal
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
  template: `
    <footer class="bg-gradient-to-b from-[#081838] via-[#0b214a] to-[#0f2c63] border-t border-sky-300/30 text-stone-200 mt-16 pt-14 pb-24 lg:pb-12 shadow-[0_-15px_45px_rgba(2,8,23,0.7),inset_0_-28px_50px_-12px_rgba(186,230,253,0.18)] relative overflow-hidden">
      <!-- Bottom Cloud Horizon Glow -->
      <div class="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-44 bg-sky-300/20 blur-[80px] pointer-events-none"></div>
      <div class="absolute -top-24 left-1/3 w-96 h-48 bg-cyan-400/15 blur-[90px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <app-footer-brand class="md:col-span-5 block" />
          <app-footer-sections class="md:col-span-7 block" />
        </div>

        <app-footer-legal class="block" />
      </div>
    </footer>
  `,
})
export class Footer {}
