import {ChangeDetectionStrategy, Component, output} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header-brand',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block shrink-0',
  },
  template: `
    <a
      routerLink="/"
      (click)="brandClick.emit()"
      class="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-hidden py-1 rounded-xl cursor-pointer"
      title="YENİDEM • Edebiyat, Felsefe ve Tefekkür Mecmuası"
    >
      <div class="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full p-0.5 bg-gradient-to-br from-cyan-300/60 via-sky-500/40 to-blue-800/60 shadow-[0_0_22px_rgba(56,189,248,0.45)] group-hover:shadow-[0_0_32px_rgba(56,189,248,0.75)] group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden">
        <img
          src="/logo.svg"
          alt="YENİDEM Resmi Logosu"
          class="w-full h-full object-contain rounded-full"
        />
      </div>

      <div class="flex flex-col text-left">
        <span class="text-lg sm:text-xl font-serif font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors leading-none">
          YENİDEM
        </span>
        <span class="hidden sm:inline lg:hidden xl:inline text-[11px] text-sky-300/90 font-sans tracking-tight font-medium mt-1">
          Edebiyat, Felsefe &amp; Tefekkür
        </span>
      </div>
    </a>
  `,
})
export class HeaderBrand {
  readonly brandClick = output<void>();
}
