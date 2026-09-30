import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-editor-crypto-panel',
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form()" class="p-5 rounded-2xl bg-gradient-to-r from-[#0c1424] via-[#0f1a30] to-[#0a101d] border border-cyan-500/25 shadow-lg space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-white/10">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <mat-icon class="!w-4 !h-4 !text-base">lock</mat-icon>
          </div>
          <div>
            <h4 class="text-xs font-serif font-bold text-white tracking-wide">Kriptografik Bütünlük & Blok Zinciri Parametreleri</h4>
            <p class="text-[11px] text-cyan-300/80 font-mono">SHA-512 & Rust Blok Zinciri Düğüm Entegrasyonu</p>
          </div>
        </div>

        <span class="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold">
          Değiştirilemez Külliyat Protokolü
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-stone-300">
        <!-- Blockchain Registration Option -->
        <label class="flex items-start gap-3 p-3 rounded-xl bg-[#080d1a] border border-white/10 hover:border-cyan-500/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            formControlName="submitToBlockchain"
            class="mt-1 rounded border-stone-600 text-amber-500 focus:ring-amber-400 bg-stone-900"
          />
          <div>
            <span class="font-semibold text-white block">Rust Blok Zinciri Topluluk Onayı Kuyruğuna Gönder</span>
            <p class="text-[11px] text-stone-400 mt-0.5 leading-snug">
              Yayımlandığı an Rust dilinde yazılmış yerel blok zinciri düğümüne aktarılarak topluluk onayına ve dijital sertifikalandırmaya sunulur.
            </p>
          </div>
        </label>

        <!-- Quantum HMAC Seal Option -->
        <label class="flex items-start gap-3 p-3 rounded-xl bg-[#080d1a] border border-white/10 hover:border-cyan-500/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            formControlName="generateQuantumSeal"
            class="mt-1 rounded border-stone-600 text-cyan-500 focus:ring-cyan-400 bg-stone-900"
          />
          <div>
            <span class="font-semibold text-white block">Kuantum Dirençli Dijital Mühür Oluştur (HMAC-SHA512)</span>
            <p class="text-[11px] text-stone-400 mt-0.5 leading-snug">
              Metin, kürsü anahtarı ve yazar tesciliyle 256-bit güvenlik marjında mühürlenir; tek bir harf dahi değiştiğinde sistem alarm verir.
            </p>
          </div>
        </label>
      </div>

      <!-- Revision Reason if editing -->
      @if (isEditing()) {
        <div class="pt-2 border-t border-white/5">
          <label for="revisionNote" class="block text-xs font-serif font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">history_edu</mat-icon>
            <span>Revizyon ve Metin Tashihi Gerekçesi</span>
          </label>
          <input
            id="revisionNote"
            type="text"
            formControlName="revisionNote"
            placeholder="Örn: 2. Bölümdeki tasavvufi kavramların şerhi genişletildi, kaynakça güncellendi."
            class="w-full px-3.5 py-2 rounded-xl academic-input text-stone-200 text-xs font-sans placeholder-stone-500 focus:outline-none"
          />
        </div>
      }
    </div>
  `,
})
export class EditorCryptoPanelComponent {
  form = input.required<FormGroup>();
  isEditing = input<boolean>(false);
}
