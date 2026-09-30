import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-footer-brand',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <a routerLink="/" class="inline-flex items-center gap-3.5 group">
        <div class="w-13 h-13 rounded-full p-0.5 bg-gradient-to-br from-cyan-300/60 via-sky-500/40 to-blue-800/60 flex items-center justify-center shadow-[0_0_24px_rgba(56,189,248,0.45)] group-hover:scale-105 transition-transform overflow-hidden shrink-0">
          <img
            src="/logo.svg"
            alt="YENİDEM Resmi Logosu"
            class="w-12 h-12 object-contain rounded-full"
          />
        </div>
        <div>
          <h3 class="text-xl font-serif font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">YENİDEM</h3>
          <p class="text-xs text-cyan-300 font-sans font-semibold tracking-wider uppercase">Edebiyat, Felsefe ve Tefekkür Mecmuası</p>
        </div>
      </a>
      
      <p class="text-sm text-stone-300 leading-relaxed max-w-md font-sans">
        YENİDEM; klasik Türk edebiyatının mazmun ve ahenk zenginliğini, modern felsefe mirası ve 
        analitik düşünce disipliniyle buluşturan bağımsız akademik kültür platformudur.
      </p>

      <div class="flex flex-wrap items-center gap-4 pt-1 text-xs text-sky-200/90 font-medium">
        <span class="inline-flex items-center gap-1.5">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous">verified</mat-icon>
          <span>SHA-512 Doğrulanmış Külliyat</span>
        </span>
        <span aria-hidden="true" class="text-white/20">·</span>
        <span class="inline-flex items-center gap-1.5">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">psychology</mat-icon>
          <span>Açık Akademik Arşiv</span>
        </span>
      </div>
    </div>
  `,
})
export class FooterBrand {}
