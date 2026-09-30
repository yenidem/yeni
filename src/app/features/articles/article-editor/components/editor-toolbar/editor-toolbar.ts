import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type MarkdownAction =
  | 'bold'
  | 'italic'
  | 'h2'
  | 'h3'
  | 'quote'
  | 'poem'
  | 'bullet'
  | 'numbered'
  | 'citation'
  | 'code'
  | 'link'
  | 'divider';

@Component({
  selector: 'app-editor-toolbar',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap items-center gap-1.5 p-2 bg-[#0c1322] border-b border-white/10 rounded-t-xl text-stone-300">
      <span class="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 font-bold px-2 py-0.5 select-none hidden sm:inline-block">
        Akademik Editör:
      </span>

      <!-- Text Styles -->
      <div class="flex items-center gap-1 bg-[#10192e] p-1 rounded-lg border border-white/5">
        <button
          type="button"
          (click)="trigger('bold')"
          class="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Kalın Metin (**metin**)"
        >
          <mat-icon class="!w-4 !h-4 !text-sm">format_bold</mat-icon>
        </button>
        <button
          type="button"
          (click)="trigger('italic')"
          class="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="İtalik Metin (*metin*)"
        >
          <mat-icon class="!w-4 !h-4 !text-sm">format_italic</mat-icon>
        </button>
      </div>

      <!-- Headings -->
      <div class="flex items-center gap-1 bg-[#10192e] p-1 rounded-lg border border-white/5">
        <button
          type="button"
          (click)="trigger('h2')"
          class="px-2 py-1 hover:bg-white/10 rounded text-xs font-serif font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
          title="Ana Başlık 2 (## Başlık)"
        >
          H2
        </button>
        <button
          type="button"
          (click)="trigger('h3')"
          class="px-2 py-1 hover:bg-white/10 rounded text-xs font-serif font-bold text-amber-300/80 hover:text-amber-200 transition-colors cursor-pointer"
          title="Alt Başlık 3 (### Başlık)"
        >
          H3
        </button>
      </div>

      <!-- Academic Blocks -->
      <div class="flex items-center gap-1 bg-[#10192e] p-1 rounded-lg border border-white/5">
        <button
          type="button"
          (click)="trigger('quote')"
          class="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Akademik Alıntı / Bloknot (> Alıntı)"
        >
          <mat-icon class="!w-4 !h-4 !text-sm">format_quote</mat-icon>
        </button>
        <button
          type="button"
          (click)="trigger('poem')"
          class="p-1.5 hover:bg-white/10 rounded text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
          title="Şiir / Beyit / Dörtlük Düzeni"
        >
          <mat-icon class="!w-4 !h-4 !text-sm">auto_stories</mat-icon>
        </button>
        <button
          type="button"
          (click)="trigger('citation')"
          class="p-1.5 hover:bg-white/10 rounded text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
          title="Dipnot / Kaynakça Atfı ([^1])"
        >
          <mat-icon class="!w-4 !h-4 !text-sm">bookmark</mat-icon>
        </button>
      </div>

      <!-- Lists -->
      <div class="flex items-center gap-1 bg-[#10192e] p-1 rounded-lg border border-white/5">
        <button
          type="button"
          (click)="trigger('bullet')"
          class="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Maddeli Liste (- Madde)"
        >
          <mat-icon class="!w-4 !h-4 !text-sm">format_list_bulleted</mat-icon>
        </button>
        <button
          type="button"
          (click)="trigger('numbered')"
          class="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Numaralı Liste (1. Madde)"
        >
          <mat-icon class="!w-4 !h-4 !text-sm">format_list_numbered</mat-icon>
        </button>
      </div>

      <!-- Utilities -->
      <div class="flex items-center gap-1 bg-[#10192e] p-1 rounded-lg border border-white/5 ml-auto">
        <button
          type="button"
          (click)="trigger('code')"
          class="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Kod / Çeviri Bloğu"
        >
          <mat-icon class="!w-4 !h-4 !text-sm">code</mat-icon>
        </button>
        <button
          type="button"
          (click)="trigger('link')"
          class="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Bağlantı Ekle ([Metin](URL))"
        >
          <mat-icon class="!w-4 !h-4 !text-sm">link</mat-icon>
        </button>
        <button
          type="button"
          (click)="trigger('divider')"
          class="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Ayraç Çizgisi (---)"
        >
          <mat-icon class="!w-4 !h-4 !text-sm">horizontal_rule</mat-icon>
        </button>
      </div>
    </div>
  `,
})
export class EditorToolbarComponent {
  action = output<MarkdownAction>();

  trigger(type: MarkdownAction): void {
    this.action.emit(type);
  }
}
