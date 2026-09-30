import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {AcademicArticle} from '../../../../../core/models/article.model';

export interface DerkenarNote {
  id: string;
  articleId: string;
  category: 'felsefe' | 'edebiyat' | 'isnad' | 'soru';
  content: string;
  createdAt: string;
}

@Component({
  selector: 'app-detail-marginalia',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#080d18] to-[#04060d] border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-xl">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <mat-icon class="!w-5 !h-5 !text-xl">edit_note</mat-icon>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                Derkenar & Şahsi Tetkik Notları
              </h3>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                {{ notes().length }} Not
              </span>
            </div>
            <p class="text-xs text-stone-300">
              Bu makaleye dair şahsi şerh, mülahaza ve tez hazırlık notlarınızı kaydedin (tarayıcınızda mahfuzdur).
            </p>
          </div>
        </div>

        <!-- Export Notes Button -->
        @if (notes().length > 0) {
          <button
            type="button"
            (click)="exportNotesMarkdown()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 text-xs font-mono transition-all cursor-pointer"
            title="Tüm Derkenar Notlarını Markdown Olarak İndir"
          >
            <mat-icon class="!w-4 !h-4 !text-sm text-amber-400">download</mat-icon>
            <span>Notları Dışa Aktar (.md)</span>
          </button>
        }
      </div>

      <!-- Add Note Input Box -->
      <div class="p-4 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-serif font-medium text-stone-300">Not Türü / Odak:</span>
          <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
            <button
              type="button"
              (click)="selectedCategory.set('felsefe')"
              class="px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium"
              [class.bg-amber-500]="selectedCategory() === 'felsefe'"
              [class.text-stone-950]="selectedCategory() === 'felsefe'"
              [class.bg-white/5]="selectedCategory() !== 'felsefe'"
              [class.text-stone-300]="selectedCategory() !== 'felsefe'"
            >
              Felsefi Mülahaza
            </button>
            <button
              type="button"
              (click)="selectedCategory.set('edebiyat')"
              class="px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium"
              [class.bg-cyan-500]="selectedCategory() === 'edebiyat'"
              [class.text-stone-950]="selectedCategory() === 'edebiyat'"
              [class.bg-white/5]="selectedCategory() !== 'edebiyat'"
              [class.text-stone-300]="selectedCategory() !== 'edebiyat'"
            >
              Edebi / Poetik Tahlil
            </button>
            <button
              type="button"
              (click)="selectedCategory.set('isnad')"
              class="px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium"
              [class.bg-emerald-500]="selectedCategory() === 'isnad'"
              [class.text-stone-950]="selectedCategory() === 'isnad'"
              [class.bg-white/5]="selectedCategory() !== 'isnad'"
              [class.text-stone-300]="selectedCategory() !== 'isnad'"
            >
              Kaynakça & İsnad
            </button>
            <button
              type="button"
              (click)="selectedCategory.set('soru')"
              class="px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium"
              [class.bg-purple-500]="selectedCategory() === 'soru'"
              [class.text-stone-950]="selectedCategory() === 'soru'"
              [class.bg-white/5]="selectedCategory() !== 'soru'"
              [class.text-stone-300]="selectedCategory() !== 'soru'"
            >
              Soru / Aporia
            </button>
          </div>
        </div>

        <textarea
          #noteInput
          rows="3"
          placeholder="Bu metindeki kavrama veya teze dair derkenar mülahazanızı buraya yazın..."
          class="w-full p-3 rounded-xl bg-[#0d1424] border border-white/10 text-stone-100 placeholder-stone-400 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 transition-all resize-y"
        ></textarea>

        <div class="flex items-center justify-between pt-1">
          <span class="text-[11px] text-stone-400 font-mono">
            Orçun Kundakcı Külliyatı Metin Şerhi Sistemi
          </span>
          <button
            type="button"
            (click)="addNote(noteInput)"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            <mat-icon class="!w-4 !h-4 !text-sm">add</mat-icon>
            <span>Derkenar Kaydet</span>
          </button>
        </div>
      </div>

      <!-- Notes List -->
      <div class="space-y-3">
        @if (notes().length === 0) {
          <div class="py-8 text-center text-stone-400 border border-dashed border-white/10 rounded-2xl p-4">
            <mat-icon class="!w-8 !h-8 !text-3xl text-stone-600 mb-1">history_edu</mat-icon>
            <p class="text-xs font-serif">Bu makale için henüz bir derkenar notu eklenmedi.</p>
            <p class="text-[11px] text-stone-400 mt-1">Okurken aklınıza gelen tezleri veya karşılaştırmaları yukarıdan ekleyebilirsiniz.</p>
          </div>
        } @else {
          @for (note of notes(); track note.id) {
            <div class="p-4 rounded-2xl bg-[#080d1a] border border-white/10 space-y-2 hover:border-amber-500/30 transition-all">
              <div class="flex items-center justify-between text-[11px]">
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-0.5 rounded font-mono font-medium uppercase text-[10px]"
                    [class.bg-amber-500/20]="note.category === 'felsefe'"
                    [class.text-amber-300]="note.category === 'felsefe'"
                    [class.bg-cyan-500/20]="note.category === 'edebiyat'"
                    [class.text-cyan-300]="note.category === 'edebiyat'"
                    [class.bg-emerald-500/20]="note.category === 'isnad'"
                    [class.text-emerald-300]="note.category === 'isnad'"
                    [class.bg-purple-500/20]="note.category === 'soru'"
                    [class.text-purple-300]="note.category === 'soru'"
                  >
                    {{ getCategoryLabel(note.category) }}
                  </span>
                  <span class="text-stone-300 font-mono">{{ note.createdAt }}</span>
                </div>

                <button
                  type="button"
                  (click)="deleteNote(note.id)"
                  class="text-stone-400 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                  title="Notu Sil"
                >
                  <mat-icon class="!w-4 !h-4 !text-sm">delete</mat-icon>
                </button>
              </div>

              <p class="text-stone-200 text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line">
                {{ note.content }}
              </p>
            </div>
          }
        }
      </div>
    </section>
  `,
})
export class DetailMarginaliaComponent {
  readonly article = input.required<AcademicArticle>();
  readonly selectedCategory = signal<'felsefe' | 'edebiyat' | 'isnad' | 'soru'>('felsefe');

  private storageKey(): string {
    return `orcun_derkenar_${this.article().id}`;
  }

  readonly notes = signal<DerkenarNote[]>([]);

  constructor() {
    this.loadNotes();
  }

  private loadNotes(): void {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(this.storageKey());
      if (saved) {
        this.notes.set(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Derkenar notları yüklenirken hata:', e);
    }
  }

  private saveNotes(newNotes: DerkenarNote[]): void {
    this.notes.set(newNotes);
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify(newNotes));
    } catch (e) {
      console.warn('Derkenar notları kaydedilemedi:', e);
    }
  }

  addNote(textarea: HTMLTextAreaElement): void {
    const text = textarea.value.trim();
    if (!text) return;

    const newNote: DerkenarNote = {
      id: 'note_' + Date.now(),
      articleId: this.article().id,
      category: this.selectedCategory(),
      content: text,
      createdAt: new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    this.saveNotes([newNote, ...this.notes()]);
    textarea.value = '';
  }

  deleteNote(id: string): void {
    this.saveNotes(this.notes().filter((n) => n.id !== id));
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'felsefe':
        return 'Felsefi Mülahaza';
      case 'edebiyat':
        return 'Edebi Tahlil';
      case 'isnad':
        return 'Kaynakça / İsnad';
      case 'soru':
        return 'Soru / Aporia';
      default:
        return 'Derkenar';
    }
  }

  exportNotesMarkdown(): void {
    const art = this.article();
    const notes = this.notes();
    if (notes.length === 0) return;

    let md = `# DERKENAR VE TETKİK NOTLARI\n\n`;
    md += `**Makale:** ${art.title}\n`;
    md += `**Disiplin:** ${art.discipline.toUpperCase()}\n`;
    md += `**Araştırmacı Portföyü:** Orçun KUNDAKCI (AÖF Türk Dili ve Edebiyatı & Felsefe)\n`;
    md += `**Dışa Aktarma Tarihi:** ${new Date().toLocaleString('tr-TR')}\n\n`;
    md += `---\n\n`;

    notes.forEach((n, idx) => {
      md += `### ${idx + 1}. [${this.getCategoryLabel(n.category)}] - ${n.createdAt}\n\n`;
      md += `${n.content}\n\n`;
    });

    const blob = new Blob([md], {type: 'text/markdown;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `derkenar_${art.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
