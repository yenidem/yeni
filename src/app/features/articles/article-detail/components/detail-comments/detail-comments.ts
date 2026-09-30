import {ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal} from '@angular/core';
import {ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {AcademicArticle} from '../../../../../core/models/article.model';
import {SecurityService} from '../../../../../core/services/security.service';

export interface ScholarlyComment {
  id: string;
  authorName: string;
  authorTitle?: string;
  isAuthor: boolean; // Orçun Kundakcı official reply
  date: string;
  content: string;
  upvotes: number;
  replies?: ScholarlyComment[];
}

@Component({
  selector: 'app-detail-comments',
  imports: [MatIconModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6 sm:p-10 rounded-3xl bg-[#090f1d]/90 border border-white/10 shadow-2xl space-y-8">
      
      <!-- Section Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <mat-icon class="!w-5 !h-5 !text-xl">forum</mat-icon>
          </div>
          <div>
            <h3 class="text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
              <span>Derkenar Kürsüsü & Tenkit Meclisi</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {{ totalCommentsCount() }}
              </span>
            </h3>
            <p class="text-xs text-stone-400 font-sans">
              Metin üzerine okur şerhleri, akademik mütalaalar ve yazar münazarası
            </p>
          </div>
        </div>

        <button
          type="button"
          (click)="showForm.set(!showForm())"
          class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <mat-icon class="!w-4 !h-4 !text-base">{{ showForm() ? 'close' : 'add_comment' }}</mat-icon>
          <span>{{ showForm() ? 'Vazgeç' : 'Tenkit / Mütalaa Bırak' }}</span>
        </button>
      </div>

      <!-- Add Comment Form Card -->
      @if (showForm()) {
        <form
          [formGroup]="commentForm"
          (ngSubmit)="submitComment()"
          class="p-6 rounded-2xl bg-[#070b16] border border-amber-400/30 space-y-4 animate-in fade-in duration-200"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-serif font-bold text-amber-300">
              Yeni Akademik Mütalaa veya Şerh Notu
            </span>
            <span class="text-[10px] text-stone-400">YENİDEM Editoryal İlkelerine Uygun</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="comment-name" class="block text-xs font-medium text-stone-300 mb-1">Adınız Soyadınız *</label>
              <input
                id="comment-name"
                type="text"
                formControlName="name"
                placeholder="Örn: Dr. Selim Akgün veya Mehmet Aydın"
                class="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div>
              <label for="comment-title" class="block text-xs font-medium text-stone-300 mb-1">Unvan / Kurum / İlgi Alanı (Opsiyonel)</label>
              <input
                id="comment-title"
                type="text"
                formControlName="title"
                placeholder="Örn: Edebiyat Araştırmacısı / Felsefe Lisans"
                class="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label for="comment-text" class="block text-xs font-medium text-stone-300 mb-1">Mütalaa, Şerh veya Tenkidiniz *</label>
            <textarea
              id="comment-text"
              rows="4"
              formControlName="content"
              placeholder="Metnin kavramsal örgüsü, kullanılan deliller veya klasik kaynaklar hakkında düşüncelerinizi yazınız..."
              class="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-400 leading-relaxed"
            ></textarea>
          </div>

          <div class="flex items-center justify-between pt-2">
            <span class="text-[11px] text-stone-400 italic">
              Metin üzerine edebi nezaket ve düşünsel ciddiyetle yapılan katkılar yayımlanır.
            </span>

            <button
              type="submit"
              [disabled]="commentForm.invalid"
              class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              Mütalaayı Kürsüye İlet
            </button>
          </div>
        </form>
      }

      <!-- Comments Stream List -->
      <div class="space-y-6">
        @for (comment of comments(); track comment.id) {
          <div
            class="p-5 sm:p-6 rounded-2xl border transition-all space-y-4"
            [class.bg-[#070b16]]="true"
            [class.border-amber-500/30]="comment.isAuthor"
            [class.border-white/10]="!comment.isAuthor"
          >
            <!-- Comment Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-8 h-8 rounded-xl flex items-center justify-center font-serif font-bold text-xs"
                  [class.bg-amber-500]="comment.isAuthor"
                  [class.text-stone-950]="comment.isAuthor"
                  [class.bg-white/10]="!comment.isAuthor"
                  [class.text-stone-300]="!comment.isAuthor"
                >
                  {{ comment.isAuthor ? 'YD' : comment.authorName.charAt(0) }}
                </div>

                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-serif font-bold text-sm text-white">
                      {{ comment.authorName }}
                    </span>
                    @if (comment.isAuthor) {
                      <span class="text-[9px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        Yazar & Kurucu
                      </span>
                    }
                  </div>
                  @if (comment.authorTitle) {
                    <span class="text-[11px] text-stone-400">{{ comment.authorTitle }}</span>
                  }
                </div>
              </div>

              <span class="text-[11px] font-mono text-stone-400">{{ comment.date }}</span>
            </div>

            <!-- Comment Body -->
            <p class="text-xs sm:text-sm text-stone-200 font-sans leading-relaxed">
              {{ comment.content }}
            </p>

            <!-- Comment Footer & Upvote -->
            <div class="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <button
                type="button"
                (click)="upvote(comment.id)"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-amber-500/15 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer text-xs"
              >
                <mat-icon class="!w-3.5 !h-3.5 !text-xs text-amber-400">thumb_up</mat-icon>
                <span>Takdir ({{ comment.upvotes }})</span>
              </button>

              <span class="text-[11px] text-stone-400">
                #DerkenarNotu
              </span>
            </div>

            <!-- Nested Author Reply (If Any) -->
            @if (comment.replies && comment.replies.length > 0) {
              <div class="mt-3 pl-4 border-l-2 border-amber-400/40 space-y-3 pt-2">
                @for (reply of comment.replies; track reply.id) {
                  <div class="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-serif font-bold text-amber-300 flex items-center gap-1.5">
                        <mat-icon class="!w-3.5 !h-3.5 !text-xs">reply</mat-icon>
                        {{ reply.authorName }} (Yazar Yanıtı)
                      </span>
                      <span class="text-[10px] font-mono text-stone-400">{{ reply.date }}</span>
                    </div>
                    <p class="text-xs text-stone-300 leading-relaxed font-serif italic">
                      &ldquo;{{ reply.content }}&rdquo;
                    </p>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

    </section>
  `,
})
export class DetailCommentsComponent implements OnInit {
  readonly article = input.required<AcademicArticle>();
  readonly securityService = inject(SecurityService);

  readonly showForm = signal<boolean>(false);
  readonly comments = signal<ScholarlyComment[]>([]);

  readonly totalCommentsCount = computed(() => {
    let count = this.comments().length;
    for (const c of this.comments()) {
      if (c.replies) count += c.replies.length;
    }
    return count;
  });

  readonly commentForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    title: new FormControl(''),
    content: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  ngOnInit(): void {
    this.loadComments();
  }

  private getStorageKey(): string {
    return `yenidem_comments_${this.article().id}`;
  }

  private loadComments(): void {
    const key = this.getStorageKey();
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          this.comments.set(JSON.parse(stored));
          return;
        } catch {
          // no-op
        }
      }
    }

    // Seed realistic scholarly comments
    const seed: ScholarlyComment[] = [
      {
        id: 'c-1',
        authorName: 'Doç. Dr. Emrehan Saygılı',
        authorTitle: 'Klasik Türk Edebiyatı Araştırmacısı',
        isAuthor: false,
        date: '2 gün önce',
        content:
          'Metindeki tasavvufi adem kavramının Ahmet Haşim’in Piyâle poetikasındaki kaçış arzusuyla mukayesesi son derece özgün bir ontolojik tahlil olmuş. Özellikle Fuzûlî’nin usanç kavramını bir pes ediş değil, varlığın çözülüşü olarak ele almanız klasik şerh geleneğine çağdaş felsefe açısından nefis bir derinlik kazandırmış.',
        upvotes: 14,
        replies: [
          {
            id: 'c-1-r1',
            authorName: 'Orçun KUNDAKCI',
            authorTitle: 'YENİDEM Başyazarı',
            isAuthor: true,
            date: '1 gün önce',
            content:
              'Kıymetli mütalaanız için teşekkür ederim Emrehan Hocam. Amacımız kadim mazmunlarımızın kabuğunu kırarak onları çağdaş varoluşçuluk ve fenomenoloji ile yüzleştirmekti; teveccühünüz tefekkür yolumuzu aydınlattı.',
            upvotes: 9,
          },
        ],
      },
      {
        id: 'c-2',
        authorName: 'Selin Karadağ',
        authorTitle: 'Felsefe Yüksek Lisans Öğrencisi',
        isAuthor: false,
        date: '5 gün önce',
        content:
          'Spinoza’nın töz anlayışı ile vahdet-i vücûd arasındaki paralelliğe değindiğiniz dipnot harika bir tez konusu niteliğinde. YENİDEM’in bu disiplinlerarası bakışı Türkiye’deki düşünce hayatı için çok taze bir soluk.',
        upvotes: 8,
      },
    ];

    this.comments.set(seed);
    this.saveToStorage(seed);
  }

  private saveToStorage(list: ScholarlyComment[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(list));
    }
  }

  submitComment(): void {
    if (this.commentForm.invalid) return;

    const val = this.commentForm.value;
    const newComment: ScholarlyComment = {
      id: 'c_' + Date.now(),
      authorName: (val.name || 'Misafir Araştırmacı').trim(),
      authorTitle: (val.title || '').trim(),
      isAuthor: this.securityService.isAuthor(),
      date: 'Az önce',
      content: (val.content || '').trim(),
      upvotes: 1,
    };

    const updated = [newComment, ...this.comments()];
    this.comments.set(updated);
    this.saveToStorage(updated);
    this.commentForm.reset();
    this.showForm.set(false);
  }

  upvote(commentId: string): void {
    const updated = this.comments().map((c) => {
      if (c.id === commentId) {
        return {...c, upvotes: c.upvotes + 1};
      }
      return c;
    });
    this.comments.set(updated);
    this.saveToStorage(updated);
  }
}
