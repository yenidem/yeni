import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DisciplineType } from '../../../../../core/models/article.model';

@Component({
  selector: 'app-editor-meta-panel',
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form()" class="space-y-6">
      
      <!-- Discipline Selector -->
      <div>
        <div class="block text-xs font-serif font-bold text-amber-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <mat-icon class="!w-4 !h-4 !text-base text-amber-400">category</mat-icon>
          <span>Akademik Alan / Disiplin</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          @for (d of disciplines; track d.id) {
            <label
              class="relative flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all select-none"
              [class.bg-[#142038]]="form().get('discipline')?.value === d.id"
              [class.border-amber-400]="form().get('discipline')?.value === d.id"
              [class.shadow-md]="form().get('discipline')?.value === d.id"
              [class.bg-[#0a101d]]="form().get('discipline')?.value !== d.id"
              [class.border-white/10]="form().get('discipline')?.value !== d.id"
              [class.hover:border-white/20]="form().get('discipline')?.value !== d.id"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-serif font-bold text-white flex items-center gap-1.5">
                  <mat-icon class="!w-4 !h-4 !text-sm text-amber-400">{{ d.icon }}</mat-icon>
                  {{ d.label }}
                </span>
                <input
                  type="radio"
                  formControlName="discipline"
                  [value]="d.id"
                  class="sr-only"
                />
                @if (form().get('discipline')?.value === d.id) {
                  <mat-icon class="!w-4 !h-4 !text-base text-amber-400">check_circle</mat-icon>
                }
              </div>
              <p class="text-[11px] text-stone-300 font-sans leading-tight">
                {{ d.description }}
              </p>
            </label>
          }
        </div>
      </div>

      <!-- Title & Subtitle Grid -->
      <div class="space-y-4">
        <div>
          <label for="articleTitle" class="block text-xs font-serif font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <mat-icon class="!w-4 !h-4 !text-base text-amber-400">title</mat-icon>
              <span>Makale / Araştırma Başlığı</span>
            </span>
            <span class="text-[11px] font-normal text-stone-400 font-sans">Zorunlu</span>
          </label>
          <input
            id="articleTitle"
            type="text"
            formControlName="title"
            placeholder="Örn: Yunus Emre'nin Risâletü'n-Nushiyye'sinde Akıl ve Nefs Diyalektiği..."
            class="w-full px-4 py-3 rounded-xl academic-input text-white text-base font-serif placeholder-stone-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="articleSubtitle" class="block text-xs font-serif font-bold text-stone-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <mat-icon class="!w-4 !h-4 !text-base text-stone-400">subtitles</mat-icon>
            <span>Alt Başlık & Kuramsal Vurgu (İsteğe Bağlı)</span>
          </label>
          <input
            id="articleSubtitle"
            type="text"
            formControlName="subtitle"
            placeholder="Örn: Klasik Türk edebiyatında ahlâkî ontolojinin semantik katmanları..."
            class="w-full px-4 py-2.5 rounded-xl academic-input text-stone-200 text-sm font-serif placeholder-stone-500 focus:outline-none"
          />
        </div>
      </div>

      <!-- Abstract / Özet -->
      <div>
        <label for="articleAbstract" class="block text-xs font-serif font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">subject</mat-icon>
            <span>Akademik Özet (Abstract)</span>
          </span>
          <span class="text-[11px] font-normal text-stone-400 font-sans">Kürsü Kaydı İçin</span>
        </label>
        <textarea
          id="articleAbstract"
          formControlName="abstract"
          rows="3"
          placeholder="Makalenin metodolojisini, incelediği metinleri ve ulaştığı temel felsefi/edebî sonucu özetleyiniz..."
          class="w-full px-4 py-2.5 rounded-xl academic-input text-stone-200 text-xs sm:text-sm font-sans placeholder-stone-500 focus:outline-none leading-relaxed"
        ></textarea>
      </div>

      <!-- Two Columns: Keywords & Featured Quote -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="articleKeywords" class="block text-xs font-serif font-bold text-stone-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">sell</mat-icon>
            <span>Anahtar Kavramlar (Virgülle Ayırın)</span>
          </label>
          <input
            id="articleKeywords"
            type="text"
            formControlName="keywords"
            placeholder="Tasavvuf, Ontoloji, Şerh, Yunus Emre, Varlık"
            class="w-full px-3.5 py-2.5 rounded-xl academic-input text-stone-200 text-xs font-mono placeholder-stone-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="featuredQuote" class="block text-xs font-serif font-bold text-stone-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">format_quote</mat-icon>
            <span>Öne Çıkan Beyit / Özlü Söz</span>
          </label>
          <input
            id="featuredQuote"
            type="text"
            formControlName="featuredQuote"
            placeholder="Örn: İlim ilim bilmektir, ilim kendin bilmektir..."
            class="w-full px-3.5 py-2.5 rounded-xl academic-input text-amber-200 text-xs font-serif placeholder-stone-500 focus:outline-none"
          />
        </div>
      </div>

      <!-- References & Media Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="articleReferences" class="block text-xs font-serif font-bold text-stone-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">menu_book</mat-icon>
            <span>Kaynakça & Referanslar (Her satıra bir kaynak)</span>
          </label>
          <textarea
            id="articleReferences"
            formControlName="references"
            rows="3"
            placeholder="Gölpınarlı, Abdülbâki. (1965). Yunus Emre ve Tasavvuf. İstanbul: İnkılâp Kitabevi.&#10;Köprülü, Fuad. (1918). Türk Edebiyatında İlk Mutasavvıflar."
            class="w-full px-3.5 py-2.5 rounded-xl academic-input text-stone-200 text-xs font-mono placeholder-stone-500 focus:outline-none leading-relaxed"
          ></textarea>
        </div>

        <div>
          <label for="coverImage" class="block text-xs font-serif font-bold text-stone-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">image</mat-icon>
            <span>Görsel / Minyatür URL (İsteğe Bağlı)</span>
          </label>
          <input
            id="coverImage"
            type="url"
            formControlName="coverImage"
            placeholder="https://images.unsplash.com/... veya /assets/..."
            class="w-full px-3.5 py-2.5 rounded-xl academic-input text-stone-200 text-xs font-mono placeholder-stone-500 focus:outline-none mb-2"
          />
          <input
            type="text"
            formControlName="coverImageCaption"
            placeholder="Görsel açıklaması / Minyatür şerhi..."
            class="w-full px-3.5 py-2 rounded-lg academic-input text-stone-300 text-[11px] font-sans placeholder-stone-500 focus:outline-none"
          />
        </div>
      </div>

    </div>
  `,
})
export class EditorMetaPanelComponent {
  form = input.required<FormGroup>();

  disciplines: { id: DisciplineType; label: string; icon: string; description: string }[] = [
    {
      id: 'tde',
      label: 'Türk Dili ve Edebiyatı',
      icon: 'menu_book',
      description: 'Klasik metin şerhi, Türk şiir poetikası, dilbilgisi ve semantik tahliller',
    },
    {
      id: 'felsefe',
      label: 'Felsefe',
      icon: 'psychology',
      description: 'Epistemoloji, dil felsefesi, mantık, varlık ve etik soruşturmaları',
    },
    {
      id: 'kesisim',
      label: 'Disiplinlerarası Kesişim',
      icon: 'hub',
      description: 'Edebiyat-felsefe ortak uzamı, hermenötik, estetik ve dil ontolojisi',
    },
  ];
}
