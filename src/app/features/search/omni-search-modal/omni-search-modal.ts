import {ChangeDetectionStrategy, Component, computed, inject, output, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {ArticleService} from '../../../core/services/article.service';
import {LugatService} from '../../../core/services/lugat.service';

interface SearchResultItem {
  id: string;
  type: 'article' | 'lugat' | 'makam';
  title: string;
  subtitle: string;
  badge: string;
  route: string[];
  icon: string;
}

@Component({
  selector: 'app-omni-search-modal',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="presentation"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md"
      (click)="closeOnBackdrop($event)"
      (keydown.escape)="dismiss.emit()"
    >
      <div
        role="dialog"
        aria-modal="true"
        class="relative w-full max-w-2xl rounded-3xl bg-[#090f1d] border border-amber-500/40 shadow-2xl overflow-hidden text-stone-200"
      >
        <!-- Search Input Header -->
        <div class="p-4 border-b border-white/10 flex items-center gap-3">
          <mat-icon class="!w-6 !h-6 !text-2xl text-amber-400">search</mat-icon>
          <input
            type="text"
            [value]="query()"
            (input)="onInput($event)"
            placeholder="Makale, kavram, düşünür, beyit veya makam arayın (örn. Vahdet, Heidegger, Aruz)..."
            class="w-full bg-transparent border-none text-stone-100 placeholder-stone-400 text-base focus:outline-hidden font-sans"
          />
          @if (query()) {
            <button
              type="button"
              (click)="query.set('')"
              class="p-1 rounded-lg text-stone-400 hover:text-white cursor-pointer"
            >
              <mat-icon class="!w-4 !h-4 !text-base">close</mat-icon>
            </button>
          }
          <kbd class="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-stone-300">
            ESC
          </kbd>
        </div>

        <!-- Search Results List -->
        <div class="max-h-[60vh] overflow-y-auto p-2 divide-y divide-white/5">
          @if (query().trim() === '') {
            <!-- Quick Suggestions -->
            <div class="p-4 space-y-3">
              <span class="text-[11px] font-mono text-stone-300 uppercase tracking-wider block">
                Önerilen Hızlı Başlıklar
              </span>
              <div class="flex flex-wrap gap-2">
                @for (tag of quickTags; track tag) {
                  <button
                    type="button"
                    (click)="query.set(tag)"
                    class="px-3 py-1 rounded-xl bg-white/5 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 text-xs font-mono transition-colors cursor-pointer border border-white/5"
                  >
                    #{{ tag }}
                  </button>
                }
              </div>
            </div>
          } @else if (results().length === 0) {
            <div class="py-12 text-center space-y-2 text-stone-400">
              <mat-icon class="!w-8 !h-8 !text-3xl text-stone-600">search_off</mat-icon>
              <p class="text-xs">"{{ query() }}" için bir eşleşme bulunamadı.</p>
            </div>
          } @else {
            @for (item of results(); track item.id) {
              <button
                type="button"
                (click)="navigate(item.route)"
                class="w-full text-left p-3.5 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#0e172a] border border-white/10 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors">
                    <mat-icon class="!w-4 !h-4 !text-base">{{ item.icon }}</mat-icon>
                  </div>
                  <div>
                    <h4 class="text-xs font-serif font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                      {{ item.title }}
                    </h4>
                    <p class="text-[11px] text-stone-300 line-clamp-1">
                      {{ item.subtitle }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-[10px] px-2 py-0.5 rounded font-mono" [class]="badgeColor(item.type)">
                    {{ item.badge }}
                  </span>
                  <mat-icon class="!w-4 !h-4 !text-base text-stone-500 group-hover:text-amber-400 transition-colors">
                    arrow_forward
                  </mat-icon>
                </div>
              </button>
            }
          }
        </div>

        <!-- Footer -->
        <div class="p-3 bg-[#060a14] border-t border-white/10 flex items-center justify-between text-[11px] text-stone-300 font-mono">
          <span>{{ results().length }} sonuç bulundu</span>
          <span>Seçmek için tıklayın &bull; Kapatmak için ESC</span>
        </div>
      </div>
    </div>
  `,
})
export class OmniSearchModalComponent {
  readonly dismiss = output<void>();

  private readonly articleService = inject(ArticleService);
  private readonly lugatService = inject(LugatService);
  private readonly router = inject(Router);

  readonly query = signal<string>('');
  readonly quickTags = ['Vahdet-i Vücûd', 'Aruz', 'Heidegger', 'Fuzûlî', 'Şeyh Gâlib', 'Dasein', 'Anadolu İrfanı', 'Sebk-i Hindî'];

  readonly results = computed<SearchResultItem[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];

    const items: SearchResultItem[] = [];

    // Search Articles
    for (const art of this.articleService.articles()) {
      if (
        art.title.toLowerCase().includes(q) ||
        (art.abstract && art.abstract.toLowerCase().includes(q)) ||
        (art.keywords && art.keywords.some((k) => k.toLowerCase().includes(q)))
      ) {
        items.push({
          id: `art-${art.id}`,
          type: 'article',
          title: art.title,
          subtitle: art.abstract || 'Akademik Makale',
          badge: art.discipline.toUpperCase(),
          route: ['/makale', art.slug || art.id],
          icon: 'article',
        });
      }
    }

    // Search Lugat
    for (const term of this.lugatService.filteredTerms()) {
      if (
        term.term.toLowerCase().includes(q) ||
        term.shortDefinition.toLowerCase().includes(q) ||
        term.associatedThinkers.some((th) => th.toLowerCase().includes(q))
      ) {
        items.push({
          id: `lugat-${term.id}`,
          type: 'lugat',
          title: `${term.term} ${term.osmanlica ? '(' + term.osmanlica + ')' : ''}`,
          subtitle: term.shortDefinition,
          badge: 'LÜGAT',
          route: ['/lugat'],
          icon: 'translate',
        });
      }
    }

    // Search Static App Hubs
    if ('yazılarım makalelerim blog tefekkür güncel şahsi deneme'.includes(q)) {
      items.push({
        id: 'hub-yazilarim',
        type: 'article',
        title: 'Tefekkür Defteri & Şahsi Makalelerim',
        subtitle: 'Orçun Kundakcı şahsi süzgecinden geçen güncel felsefi ve edebi tahliller',
        badge: 'BLOG',
        route: ['/yazilarim'],
        icon: 'history_edu',
      });
    }

    if ('erenler 40 makam hacı bektaş hacı bayram yunus emre atlas'.includes(q)) {
      items.push({
        id: 'hub-erenler',
        type: 'makam',
        title: 'Erenler Atlası & Dört Kapı Kırk Makam',
        subtitle: 'Anadolu irfanı, Horasan erenleri ve tasavvufi mertebeler',
        badge: 'ATLAS',
        route: ['/erenler-ve-makamlar'],
        icon: 'explore',
      });
    }

    if ('vezin aruz hece şiir tahlil fuzuli baki galib'.includes(q)) {
      items.push({
        id: 'hub-poetics',
        type: 'lugat',
        title: 'Şiir Tahlil & Aruz/Hece Laboratuvarı',
        subtitle: 'Klasik Divan ve Halk şiiri vezin tarayıcısı ve şerh laboratuvarı',
        badge: 'LAB',
        route: ['/siir-laboratuvari'],
        icon: 'music_note',
      });
    }

    return items.slice(0, 10);
  });

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.query.set(val);
  }

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.dismiss.emit();
    }
  }

  navigate(route: string[]): void {
    this.dismiss.emit();
    this.router.navigate(route);
  }

  badgeColor(type: 'article' | 'lugat' | 'makam'): string {
    switch (type) {
      case 'article':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'lugat':
        return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
      case 'makam':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    }
  }
}
