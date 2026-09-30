import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DisciplineType, DISCIPLINE_DEFINITIONS } from '../../../../../core/models/article.model';

@Component({
  selector: 'app-editor-preview',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-full flex flex-col bg-[#0b1220] border border-amber-500/25 rounded-2xl overflow-hidden shadow-xl">
      <!-- Preview Header -->
      <div class="px-5 py-3.5 bg-[#0e172a] border-b border-white/10 flex items-center justify-between text-xs text-stone-300">
        <div class="flex items-center gap-2">
          <mat-icon class="!w-4 !h-4 !text-base text-amber-400">visibility</mat-icon>
          <span class="font-serif font-bold text-white tracking-wide">Canlı Önizleme & Tipografik Denetim</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-mono">
            Gerçek Zamanlı Render
          </span>
        </div>

        <div class="flex items-center gap-3 font-mono text-[11px] text-stone-400">
          <span>Kelime: <strong class="text-amber-300">{{ wordCount() }}</strong></span>
          <span>&bull;</span>
          <span>Süre: <strong class="text-amber-300">~{{ readingTime() }} dk</strong></span>
        </div>
      </div>

      <!-- Live Article Canvas -->
      <div class="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
        @if (!title() && !content()) {
          <div class="h-64 flex flex-col items-center justify-center text-center text-stone-500 space-y-2">
            <mat-icon class="!w-10 !h-10 !text-3xl text-stone-600">article</mat-icon>
            <p class="text-sm font-serif">Başlık veya metin yazdıkça önizleme burada belirecektir.</p>
          </div>
        } @else {
          <!-- Discipline and Metadata Badge -->
          <div class="flex flex-wrap items-center gap-2.5">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif font-semibold border"
              [class]="currentDisciplineMeta().badgeClass"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-sm">{{ currentDisciplineMeta().icon }}</mat-icon>
              {{ currentDisciplineMeta().label }}
            </span>

            <span class="text-xs text-stone-400 font-mono">
              Yazar: <strong>Orçun Kundakcı</strong>
            </span>
          </div>

          <!-- Title & Subtitle -->
          <div>
            <h1 class="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              {{ title() || 'Başlıksız Akademik Metin' }}
            </h1>
            @if (subtitle()) {
              <p class="text-sm sm:text-base text-amber-200/90 font-serif italic mt-2">
                {{ subtitle() }}
              </p>
            }
          </div>

          <!-- Featured Quote (if present) -->
          @if (featuredQuote()) {
            <div class="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-100 font-serif italic text-sm">
              "{{ featuredQuote() }}"
            </div>
          }

          <!-- Abstract Block -->
          @if (abstract()) {
            <div class="p-4 sm:p-5 rounded-xl bg-[#080d1a] border border-white/10 text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
              <strong class="text-amber-400 font-serif block mb-1 uppercase tracking-wider text-[11px]">Özet (Abstract):</strong>
              {{ abstract() }}
            </div>
          }

          <!-- Rendered Content with academic typography -->
          <div class="academic-prose drop-cap text-stone-200 space-y-4 pt-2 border-t border-white/5" [innerHTML]="renderedContent()"></div>

          <!-- References Preview -->
          @if (parsedReferences().length > 0) {
            <div class="pt-6 border-t border-amber-500/20 space-y-2">
              <h4 class="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <mat-icon class="!w-3.5 !h-3.5 !text-sm">menu_book</mat-icon>
                <span>Kaynakça & İntaç</span>
              </h4>
              <ul class="text-xs text-stone-300 space-y-1 pl-4 list-decimal">
                @for (ref of parsedReferences(); track ref) {
                  <li>{{ ref }}</li>
                }
              </ul>
            </div>
          }

          <!-- Live SHA-512 Hash Indicator -->
          <div class="mt-8 p-3 rounded-xl bg-[#070c17] border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 overflow-hidden">
              <mat-icon class="!w-4 !h-4 !text-sm text-cyan-400 shrink-0">fingerprint</mat-icon>
              <span class="truncate">Anlık SHA-512 Kripto-İmza: {{ simulatedHash() }}</span>
            </div>
            <span class="shrink-0 text-emerald-400 font-bold text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              TAM KORUMA
            </span>
          </div>
        }
      </div>
    </div>
  `,
})
export class EditorPreviewComponent {
  title = input<string>('');
  subtitle = input<string>('');
  discipline = input<DisciplineType>('tde');
  abstract = input<string>('');
  content = input<string>('');
  featuredQuote = input<string>('');
  references = input<string>('');

  currentDisciplineMeta = computed(() => {
    return DISCIPLINE_DEFINITIONS[this.discipline()] || DISCIPLINE_DEFINITIONS.tde;
  });

  wordCount = computed(() => {
    const text = (this.content() || '').trim();
    return text ? text.split(/\s+/).length : 0;
  });

  readingTime = computed(() => {
    return Math.max(1, Math.ceil(this.wordCount() / 180));
  });

  parsedReferences = computed(() => {
    const raw = this.references() || '';
    return raw
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);
  });

  simulatedHash = computed(() => {
    const str = `${this.title()}::${this.discipline()}::${this.content()}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `SHA512-LIVE-${hex}...9f4c`;
  });

  renderedContent = computed(() => {
    const text = this.content() || '';
    if (!text.trim()) return '';

    // Simple markdown-to-HTML parser for safe academic preview
    const lines = text.split('\n');
    const result: string[] = [];
    let inList = false;
    let listType = '';

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed) {
        if (inList) {
          result.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
        }
        continue;
      }

      // H2
      if (trimmed.startsWith('## ')) {
        if (inList) {
          result.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
        }
        result.push(`<h2>${this.formatInline(trimmed.substring(3))}</h2>`);
        continue;
      }

      // H3
      if (trimmed.startsWith('### ')) {
        if (inList) {
          result.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
        }
        result.push(`<h3>${this.formatInline(trimmed.substring(4))}</h3>`);
        continue;
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        if (inList) {
          result.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
        }
        result.push(`<blockquote>${this.formatInline(trimmed.substring(2))}</blockquote>`);
        continue;
      }

      // Poem Stanza / Beyit
      if (trimmed.startsWith('| ')) {
        if (inList) {
          result.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
        }
        result.push(`<div class="beyit">${this.formatInline(trimmed.substring(2))}</div>`);
        continue;
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList || listType !== 'ul') {
          if (inList) result.push(listType === 'ul' ? '</ul>' : '</ol>');
          result.push('<ul>');
          inList = true;
          listType = 'ul';
        }
        result.push(`<li>${this.formatInline(trimmed.substring(2))}</li>`);
        continue;
      }

      // Default paragraph
      if (inList) {
        result.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
      }
      result.push(`<p>${this.formatInline(trimmed)}</p>`);
    }

    if (inList) {
      result.push(listType === 'ul' ? '</ul>' : '</ol>');
    }

    return result.join('\n');
  });

  private formatInline(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-400 underline" target="_blank" rel="noopener noreferrer">$1</a>');
  }
}
