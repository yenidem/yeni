import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ArticleService } from '../../../core/services/article.service';
import { AiAcademicService } from '../../../core/services/ai-academic.service';
import { SecurityService } from '../../../core/services/security.service';
import { DisciplineType } from '../../../core/models/article.model';

// Subcomponents
import { EditorToolbarComponent, MarkdownAction } from './components/editor-toolbar/editor-toolbar';
import { EditorPreviewComponent } from './components/editor-preview/editor-preview';
import { EditorMetaPanelComponent } from './components/editor-meta-panel/editor-meta-panel';
import { EditorCryptoPanelComponent } from './components/editor-crypto-panel/editor-crypto-panel';
import { EditorAiDialogComponent } from './components/editor-ai-dialog/editor-ai-dialog';

export type ViewMode = 'split' | 'edit' | 'preview';

@Component({
  selector: 'app-article-editor',
  imports: [
    RouterLink,
    MatIconModule,
    ReactiveFormsModule,
    EditorToolbarComponent,
    EditorPreviewComponent,
    EditorMetaPanelComponent,
    EditorCryptoPanelComponent,
    EditorAiDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- Top Action & Navigation Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div class="flex items-center gap-3">
          <a
            routerLink="/"
            class="p-2.5 rounded-xl text-stone-300 hover:text-white bg-[#0c1322] hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            title="Külliyata Geri Dön"
          >
            <mat-icon class="!w-5 !h-5 !text-lg">arrow_back</mat-icon>
          </a>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                {{ editingId() ? 'Akademik Metni Düzenle' : 'Yeni Akademik Makale & Metin Girişi' }}
              </h1>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                Kriptografik Tescil
              </span>
            </div>
            <p class="text-xs text-stone-300 font-sans mt-0.5">
              Orçun Kundakcı Kürsüsü &bull; TDE, Felsefe ve Blok Zinciri Arşiv Masası
            </p>
          </div>
        </div>

        <!-- View Mode Switch & Main Actions -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <!-- View Modes -->
          <div class="flex items-center bg-[#0d1527] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              (click)="viewMode.set('edit')"
              class="px-2.5 py-1.5 rounded-lg text-xs font-serif font-semibold transition-all cursor-pointer flex items-center gap-1"
              [class.bg-amber-500]="viewMode() === 'edit'"
              [class.text-stone-950]="viewMode() === 'edit'"
              [class.text-stone-300]="viewMode() !== 'edit'"
              [class.hover:text-white]="viewMode() !== 'edit'"
              title="Sadece Editör Odaklanma Modu"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-sm">edit_note</mat-icon>
              <span class="hidden sm:inline">Editör</span>
            </button>
            <button
              type="button"
              (click)="viewMode.set('split')"
              class="px-2.5 py-1.5 rounded-lg text-xs font-serif font-semibold transition-all cursor-pointer flex items-center gap-1"
              [class.bg-amber-500]="viewMode() === 'split'"
              [class.text-stone-950]="viewMode() === 'split'"
              [class.text-stone-300]="viewMode() !== 'split'"
              [class.hover:text-white]="viewMode() !== 'split'"
              title="Yan Yana Canlı Önizleme"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-sm">vertical_split</mat-icon>
              <span class="hidden sm:inline">Yan Yana</span>
            </button>
            <button
              type="button"
              (click)="viewMode.set('preview')"
              class="px-2.5 py-1.5 rounded-lg text-xs font-serif font-semibold transition-all cursor-pointer flex items-center gap-1"
              [class.bg-amber-500]="viewMode() === 'preview'"
              [class.text-stone-950]="viewMode() === 'preview'"
              [class.text-stone-300]="viewMode() !== 'preview'"
              [class.hover:text-white]="viewMode() !== 'preview'"
              title="Tam Önizleme"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-sm">visibility</mat-icon>
              <span class="hidden sm:inline">Önizleme</span>
            </button>
          </div>

          <!-- AI Optimization Trigger -->
          <button
            type="button"
            (click)="triggerAiOptimization()"
            [disabled]="aiService.optimizing()"
            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111929] border border-amber-500/30 hover:bg-[#162238] text-amber-200 text-xs font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            @if (aiService.optimizing()) {
              <mat-icon class="!w-4 !h-4 !text-base animate-spin text-amber-400">sync</mat-icon>
              <span>İnceleniyor...</span>
            } @else {
              <mat-icon class="!w-4 !h-4 !text-base text-amber-400">auto_awesome</mat-icon>
              <span class="hidden sm:inline">AI Şerh İncelemesi</span>
            }
          </button>

          <!-- Publish Button -->
          <button
            type="button"
            (click)="saveArticle('published')"
            [disabled]="articleForm.invalid || saving()"
            class="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-lg shadow-amber-950/40 transition-all cursor-pointer disabled:opacity-50 border border-amber-300"
          >
            <mat-icon class="!w-4 !h-4 !text-base">verified</mat-icon>
            <span>{{ saving() ? 'Mühürleniyor...' : 'Kuantum Mühürle Kaydet' }}</span>
          </button>
        </div>
      </div>

      <!-- Draft Restorer Notice (if saved draft exists) -->
      @if (hasStoredDraft() && !editingId()) {
        <div class="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3 text-xs text-amber-200">
          <div class="flex items-center gap-2">
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">restore_page</mat-icon>
            <span>Tarayıcınızda kaydedilmemiş bir taslak çalışma tespit edildi.</span>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              (click)="restoreDraft()"
              class="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg transition-colors cursor-pointer text-xs"
            >
              Taslağı Yükle
            </button>
            <button
              type="button"
              (click)="dismissDraft()"
              class="px-2 py-1 text-stone-400 hover:text-white transition-colors cursor-pointer text-xs"
            >
              Yoksay
            </button>
          </div>
        </div>
      }

      <!-- Admin Status & 2FA Warning Bar -->
      @if (!securityService.isAuthor()) {
        <div class="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/50 via-[#181106] to-[#0a101d] border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2.5 text-amber-200">
            <mat-icon class="!w-5 !h-5 !text-lg text-amber-400">admin_panel_settings</mat-icon>
            <div>
              <strong class="font-serif text-white">Yönetici / Yazar Girişi Gerekli:</strong>
              <span class="text-stone-300 ml-1">Külliyata yeni makale kaydetmek ve mühürlemek için gerçek oturum açınız.</span>
            </div>
          </div>
          <button
            type="button"
            (click)="securityService.open2FAModal()"
            class="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <mat-icon class="!w-4 !h-4 !text-sm">lock_open</mat-icon>
            <span>Yazar Girişi Yap</span>
          </button>
        </div>
      }

      <!-- Form Error Alert -->
      @if (errorMessage()) {
        <div class="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <mat-icon class="!w-4 !h-4 !text-base text-rose-400">error</mat-icon>
            <span>{{ errorMessage() }}</span>
          </div>
          <button type="button" (click)="errorMessage.set(null)" class="text-rose-400 hover:text-white">
            <mat-icon class="!w-4 !h-4 !text-base">close</mat-icon>
          </button>
        </div>
      }

      <!-- MAIN EDITOR WORKSPACE -->
      <form [formGroup]="articleForm" class="space-y-6">
        
        <!-- Metadata Accordion / Panel -->
        <app-editor-meta-panel [form]="articleForm" />

        <!-- Editor & Preview Grid -->
        <div
          class="grid gap-6 items-start"
          [class.grid-cols-1]="viewMode() !== 'split'"
          [class.lg:grid-cols-2]="viewMode() === 'split'"
        >
          <!-- Left: Editor Pane (Visible in 'edit' or 'split' modes) -->
          @if (viewMode() === 'edit' || viewMode() === 'split') {
            <div class="flex flex-col bg-[#0b1220] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
              <!-- Toolbar -->
              <app-editor-toolbar (action)="handleMarkdownAction($event)" />

              <!-- Main Textarea -->
              <div class="relative">
                <textarea
                  #contentArea
                  formControlName="content"
                  rows="22"
                  placeholder="Makale ana metnini burada kaleme alınız. Markdown biçimlendirme araçlarını veya klavye kısayollarını kullanabilirsiniz...&#10;&#10;## 1. Giriş ve Kuramsal Çerçeve&#10;Metin içeriği...&#10;&#10;> 'Alıntı yapılan beyit veya kuramsal pasaj...'&#10;&#10;| Yunus diler Hak'tan vuslat / Aşk yolunda kılmaz minnet&#10;&#10;### 1.1. Ontolojik Temeller"
                  class="w-full p-5 bg-[#090e1b] text-slate-100 font-mono text-xs sm:text-sm leading-relaxed placeholder-stone-600 focus:outline-none resize-y border-0 selection:bg-amber-500/30"
                ></textarea>
              </div>

              <!-- Footer Statistics -->
              <div class="px-4 py-2.5 bg-[#0c1424] border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-stone-400 gap-2">
                <div class="flex items-center gap-3">
                  <span>Kelime: <strong class="text-amber-300">{{ wordCount() }}</strong></span>
                  <span>Karakter: <strong class="text-amber-300">{{ charCount() }}</strong></span>
                  <span>Okuma: <strong class="text-amber-300">~{{ readingTime() }} dk</strong></span>
                </div>
                <div class="text-[10px] text-cyan-300/80">
                  Otomatik taslak koruması aktif
                </div>
              </div>
            </div>
          }

          <!-- Right: Live Preview Pane (Visible in 'split' or 'preview' modes) -->
          @if (viewMode() === 'split' || viewMode() === 'preview') {
            <app-editor-preview
              [title]="articleForm.get('title')?.value || ''"
              [subtitle]="articleForm.get('subtitle')?.value || ''"
              [discipline]="articleForm.get('discipline')?.value || 'tde'"
              [abstract]="articleForm.get('abstract')?.value || ''"
              [content]="articleForm.get('content')?.value || ''"
              [featuredQuote]="articleForm.get('featuredQuote')?.value || ''"
              [references]="articleForm.get('references')?.value || ''"
            />
          }
        </div>

        <!-- Cryptographic and Blockchain Panel -->
        <app-editor-crypto-panel
          [form]="articleForm"
          [isEditing]="!!editingId()"
        />

        <!-- Bottom Save Action Bar -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div class="text-xs text-stone-400 font-sans">
            Kayıt edilen metin, Orçun Kundakcı Akademik Külliyatı SQLite & Blok Zinciri Arşivine işlenir.
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              (click)="saveArticle('draft')"
              [disabled]="saving()"
              class="px-4 py-2 rounded-xl bg-[#131c31] hover:bg-[#1a2744] text-stone-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              Taslak Olarak Sakla
            </button>

            <button
              type="button"
              (click)="saveArticle('published')"
              [disabled]="articleForm.invalid || saving()"
              class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all cursor-pointer disabled:opacity-50 border border-amber-300 flex items-center gap-1.5"
            >
              <mat-icon class="!w-4 !h-4 !text-base">verified</mat-icon>
              <span>{{ saving() ? 'Kaydediliyor...' : (editingId() ? 'Değişiklikleri Mühürle' : 'Külliyatta Yayımla') }}</span>
            </button>
          </div>
        </div>

      </form>

      <!-- AI Optimization Dialog Modal -->
      @if (aiService.lastOptimization(); as res) {
        <app-editor-ai-dialog
          [data]="res"
          (dismiss)="closeAiDialog()"
        />
      }

    </div>
  `,
})
export class ArticleEditor implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly articleService = inject(ArticleService);
  readonly aiService = inject(AiAcademicService);
  readonly securityService = inject(SecurityService);

  @ViewChild('contentArea') contentArea?: ElementRef<HTMLTextAreaElement>;

  readonly editingId = signal<string | null>(null);
  readonly viewMode = signal<ViewMode>('split');
  readonly saving = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly hasStoredDraft = signal<boolean>(false);

  private readonly DRAFT_STORAGE_KEY = 'orcun_kulliyat_editor_draft';

  readonly articleForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    subtitle: new FormControl(''),
    discipline: new FormControl<DisciplineType>('tde', [Validators.required]),
    abstract: new FormControl(''),
    content: new FormControl('', [Validators.required, Validators.minLength(20)]),
    keywords: new FormControl(''),
    featuredQuote: new FormControl(''),
    references: new FormControl(''),
    coverImage: new FormControl(''),
    coverImageCaption: new FormControl(''),
    submitToBlockchain: new FormControl(true),
    generateQuantumSeal: new FormControl(true),
    revisionNote: new FormControl(''),
  });

  readonly wordCount = computed(() => {
    const text = (this.articleForm.get('content')?.value || '').trim();
    return text ? text.split(/\s+/).length : 0;
  });

  readonly charCount = computed(() => {
    return (this.articleForm.get('content')?.value || '').length;
  });

  readonly readingTime = computed(() => {
    return Math.max(1, Math.ceil(this.wordCount() / 180));
  });

  ngOnInit(): void {
    // Check if editing existing article
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId.set(id);
      this.loadArticle(id);
    } else {
      this.checkLocalDraft();
    }

    // Auto-save draft changes locally
    this.articleForm.valueChanges.subscribe((vals) => {
      if (!this.editingId() && (vals.title || vals.content)) {
        try {
          localStorage.setItem(this.DRAFT_STORAGE_KEY, JSON.stringify(vals));
        } catch (err) {
          console.debug('LocalStorage write skipped', err);
        }
      }
    });
  }

  private checkLocalDraft(): void {
    try {
      const raw = localStorage.getItem(this.DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.title || parsed.content) {
          this.hasStoredDraft.set(true);
        }
      }
    } catch (err) {
      console.debug('LocalStorage read skipped', err);
    }
  }

  restoreDraft(): void {
    try {
      const raw = localStorage.getItem(this.DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.articleForm.patchValue(parsed);
        this.hasStoredDraft.set(false);
      }
    } catch (err) {
      console.debug('LocalStorage restore skipped', err);
    }
  }

  dismissDraft(): void {
    this.hasStoredDraft.set(false);
    try {
      localStorage.removeItem(this.DRAFT_STORAGE_KEY);
    } catch (err) {
      console.debug('LocalStorage remove skipped', err);
    }
  }

  private loadArticle(id: string): void {
    this.articleService.getArticle(id).subscribe({
      next: (res) => {
        if (res && res.data) {
          const article = res.data;
          this.articleForm.patchValue({
            title: article.title,
            subtitle: article.subtitle || '',
            discipline: article.discipline,
            abstract: article.abstract,
            content: article.content,
            keywords: (article.keywords || []).join(', '),
            featuredQuote: article.featuredQuote || '',
            references: (article.references || []).join('\n'),
            coverImage: article.coverImage || '',
            coverImageCaption: article.coverImageCaption || '',
            submitToBlockchain: article.isBlockchainVerified ?? true,
          });
        }
      },
      error: () => {
        this.errorMessage.set('Düzenlenecek makale bulunamadı.');
      },
    });
  }

  handleMarkdownAction(action: MarkdownAction): void {
    const textarea = this.contentArea?.nativeElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selected = currentText.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (action) {
      case 'bold':
        replacement = selected ? `**${selected}**` : `**kalın metin**`;
        cursorOffset = selected ? replacement.length : 2;
        break;
      case 'italic':
        replacement = selected ? `*${selected}*` : `*italik metin*`;
        cursorOffset = selected ? replacement.length : 1;
        break;
      case 'h2':
        replacement = selected ? `\n## ${selected}\n` : `\n## Yeni Başlık\n`;
        cursorOffset = replacement.length;
        break;
      case 'h3':
        replacement = selected ? `\n### ${selected}\n` : `\n### Alt Başlık\n`;
        cursorOffset = replacement.length;
        break;
      case 'quote':
        replacement = selected ? `\n> ${selected}\n` : `\n> Akademik alıntı metni...\n`;
        cursorOffset = replacement.length;
        break;
      case 'poem':
        replacement = selected
          ? `\n| ${selected.replace(/\n/g, '\n| ')}\n`
          : `\n| İlim ilim bilmektir / İlim kendin bilmektir\n| Sen kendini bilmezsin / Ya nice okumaktır\n`;
        cursorOffset = replacement.length;
        break;
      case 'bullet':
        replacement = selected ? `\n- ${selected}\n` : `\n- Madde metni\n`;
        cursorOffset = replacement.length;
        break;
      case 'numbered':
        replacement = selected ? `\n1. ${selected}\n` : `\n1. Madde metni\n`;
        cursorOffset = replacement.length;
        break;
      case 'citation':
        replacement = `[^1]`;
        cursorOffset = replacement.length;
        break;
      case 'code':
        replacement = selected ? `\`${selected}\`` : `\`kavram\``;
        cursorOffset = selected ? replacement.length : 1;
        break;
      case 'link':
        replacement = selected ? `[${selected}](URL)` : `[Bağlantı Metni](https://)`;
        cursorOffset = replacement.length - 1;
        break;
      case 'divider':
        replacement = `\n\n---\n\n`;
        cursorOffset = replacement.length;
        break;
    }

    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);
    this.articleForm.get('content')?.setValue(newText);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 0);
  }

  triggerAiOptimization(): void {
    const title = this.articleForm.get('title')?.value || '';
    const content = this.articleForm.get('content')?.value || '';
    const discipline = this.articleForm.get('discipline')?.value || 'tde';
    const abstract = this.articleForm.get('abstract')?.value || '';

    if (!content.trim()) {
      this.errorMessage.set('Değerlendirme için önce metin içeriği girmelisiniz.');
      return;
    }

    this.aiService.optimizeArticle({ title, discipline, content, abstract }).subscribe({
      error: (err: Error) => {
        this.errorMessage.set(err.message || 'Yapay zekâ optimizasyonu sırasında hata oluştu.');
      },
    });
  }

  closeAiDialog(): void {
    this.aiService.lastOptimization.set(null);
  }

  saveArticle(status: 'published' | 'draft'): void {
    if (this.articleForm.invalid) {
      this.errorMessage.set('Lütfen zorunlu alanları (Başlık ve Metin) eksiksiz doldurunuz.');
      return;
    }

    if (!this.securityService.isAuthor()) {
      this.securityService.open2FAModal();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const formVal = this.articleForm.value;
    const parsedKeywords = (formVal.keywords || '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const parsedReferences = (formVal.references || '')
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const payload = {
      title: formVal.title!,
      subtitle: formVal.subtitle || '',
      discipline: formVal.discipline || 'tde',
      abstract: formVal.abstract || '',
      content: formVal.content!,
      keywords: parsedKeywords,
      featuredQuote: formVal.featuredQuote || '',
      references: parsedReferences,
      coverImage: formVal.coverImage || '',
      coverImageCaption: formVal.coverImageCaption || '',
      status,
      lastRevisionReason: formVal.revisionNote || 'Akademik metin girişi/güncellemesi',
    };

    const editId = this.editingId();
    if (editId) {
      this.articleService.updateArticle(editId, payload).subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res?.data?.slug) {
            this.router.navigate(['/makale', res.data.slug]);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMessage.set(err.error?.error || 'Güncelleme kaydedilemedi. Oturumunuzu kontrol ediniz.');
        },
      });
    } else {
      this.articleService.createArticle(payload).subscribe({
        next: (res) => {
          this.saving.set(false);
          this.dismissDraft();
          if (res?.data?.slug) {
            this.router.navigate(['/makale', res.data.slug]);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMessage.set(err.error?.error || 'Makale kaydedilemedi. Oturumunuzu kontrol ediniz.');
        },
      });
    }
  }
}
