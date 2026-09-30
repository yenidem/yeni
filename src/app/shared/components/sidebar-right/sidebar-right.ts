import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {CategoryCard, SidebarCategoryItem} from './components/category-card/category-card';
import {ArticleService} from '../../../core/services/article.service';
import {LayoutService} from '../../../core/services/layout.service';
import {DisciplineType} from '../../../core/models/article.model';

@Component({
  selector: 'app-sidebar-right',
  imports: [RouterLink, RouterLinkActive, MatIconModule, CategoryCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full',
  },
  template: `
    <div class="w-full p-4 sm:p-5 space-y-6">
      <!-- 0. MERKEZ SAHNE MODLARI (Ana Dashboard & Özel Kürsüler) -->
      <div class="p-3.5 rounded-3xl bg-glass-blue space-y-2.5">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-1.5">
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">dashboard</mat-icon>
            <h3 class="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
              Merkez Sahne Görünümü
            </h3>
          </div>
          <span class="text-[10px] font-mono text-sky-200/80">Canlı Seçim</span>
        </div>

        <div class="space-y-1.5">
          <button
            type="button"
            (click)="openStageMode('dashboard')"
            class="w-full text-left flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer"
            [class.bg-[#12387a]]="isHomeRoute() && articleService.centerStageView() === 'dashboard'"
            [class.border-amber-300]="isHomeRoute() && articleService.centerStageView() === 'dashboard'"
            [class.bg-glass-card]="!isHomeRoute() || articleService.centerStageView() !== 'dashboard'"
            [class.border-sky-300/25]="!isHomeRoute() || articleService.centerStageView() !== 'dashboard'"
          >
            <span class="flex items-center gap-2 text-xs font-bold text-white">
              <mat-icon class="!w-4 !h-4 !text-base icon-luminous">home</mat-icon>
              <span>Ana Kürsü &amp; Külliyat Vitrin</span>
            </span>
            <span class="text-[10px] font-mono text-cyan-200 font-bold">16 Eser</span>
          </button>

          <a
            routerLink="/topluluk-onayi"
            routerLinkActive="!border-amber-300 !bg-[#12387a]"
            (click)="closeMobileDrawers()"
            class="w-full text-left flex items-center justify-between p-2.5 rounded-2xl border border-emerald-400/45 bg-glass-card transition-all cursor-pointer"
          >
            <span class="flex items-center gap-2 text-xs font-bold text-white">
              <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">how_to_vote</mat-icon>
              <span>Topluluk &amp; %96 Blok Zinciri Onayı</span>
            </span>
            <span class="text-[10px] font-mono text-emerald-300 font-bold">1M Baraj</span>
          </a>

          <button
            type="button"
            (click)="openStageMode('ataturk-bektas')"
            class="w-full text-left flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer"
            [class.bg-[#12387a]]="isHomeRoute() && articleService.centerStageView() === 'ataturk-bektas'"
            [class.border-amber-300]="isHomeRoute() && articleService.centerStageView() === 'ataturk-bektas'"
            [class.bg-glass-card]="!isHomeRoute() || articleService.centerStageView() !== 'ataturk-bektas'"
            [class.border-sky-300/25]="!isHomeRoute() || articleService.centerStageView() !== 'ataturk-bektas'"
          >
            <span class="flex items-center gap-2 text-xs font-bold text-white">
              <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">account_balance</mat-icon>
              <span>Atatürk &amp; Hacı Bektaş Kürsüsü</span>
            </span>
            <mat-icon class="!w-4 !h-4 !text-sm text-amber-300">chevron_right</mat-icon>
          </button>

          <button
            type="button"
            (click)="openStageMode('mirat-irfan')"
            class="w-full text-left flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer"
            [class.bg-[#12387a]]="isHomeRoute() && articleService.centerStageView() === 'mirat-irfan'"
            [class.border-amber-300]="isHomeRoute() && articleService.centerStageView() === 'mirat-irfan'"
            [class.bg-glass-card]="!isHomeRoute() || articleService.centerStageView() !== 'mirat-irfan'"
            [class.border-sky-300/25]="!isHomeRoute() || articleService.centerStageView() !== 'mirat-irfan'"
          >
            <span class="flex items-center gap-2 text-xs font-bold text-white">
              <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">auto_awesome</mat-icon>
              <span>Mirat-ı İrfan &amp; 7 Ulu Ozan</span>
            </span>
            <mat-icon class="!w-4 !h-4 !text-sm text-emerald-300">chevron_right</mat-icon>
          </button>
        </div>
      </div>

      <!-- 1. AKADEMİK DİSİPLİN & KONU KÜRSÜLERİ (Ortada Doğrudan Açılır) -->
      <div class="space-y-4">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-xl bg-sky-500/20 border border-sky-300/40 flex items-center justify-center">
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">school</mat-icon>
            </div>
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-white">Kürsü &amp; Disiplinler</h3>
              <p class="text-[10px] text-sky-200/85">Tıklanan kürsü orta sahnede açılır</p>
            </div>
          </div>

          @if (articleService.selectedDiscipline() !== 'all' || articleService.searchQuery() || articleService.centerStageView() !== 'dashboard') {
            <button
              type="button"
              (click)="resetFilters()"
              class="text-[11px] text-amber-300 hover:text-amber-200 font-bold cursor-pointer flex items-center gap-0.5"
              title="Ana Vitrine Dön"
            >
              <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">restart_alt</mat-icon>
              <span>Vitrine Dön</span>
            </button>
          }
        </div>
        
        <div class="space-y-4">
          <!-- TDE SECTION -->
          <div class="space-y-1.5">
            <button
              type="button"
              (click)="filterDiscipline('tde', 'Türk Dili ve Edebiyatı Kürsüsü', 'Klasik Divan şiiri, aruz ve belagat estetiği, metin şerhi ve modern Türk şiiri incelemeleri.')"
              class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-300/25 text-left text-[11px] font-bold text-cyan-300 hover:text-white transition-colors cursor-pointer"
            >
              <span class="flex items-center gap-1.5">
                <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">menu_book</mat-icon>
                <span>TÜRK DİLİ VE EDEBİYATI</span>
              </span>
              <span class="text-[10px] font-mono text-sky-200">Tümünü Aç &rarr;</span>
            </button>
            <div class="space-y-1.5">
              @for (sub of tdeSubCats; track sub.name) {
                <app-category-card [category]="sub" discipline="tde" />
              }
            </div>
          </div>

          <!-- FELSEFE SECTION -->
          <div class="space-y-1.5">
            <button
              type="button"
              (click)="filterDiscipline('felsefe', 'Felsefe ve Analitik Tefekkür Kürsüsü', 'İslam ve Batı felsefesinde ontoloji (varlık), epistemoloji (bilgi) ve etik (ahlak) tahlilleri.')"
              class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300/25 text-left text-[11px] font-bold text-amber-300 hover:text-white transition-colors cursor-pointer"
            >
              <span class="flex items-center gap-1.5">
                <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">psychology</mat-icon>
                <span>FELSEFE &amp; TEFEKKÜR</span>
              </span>
              <span class="text-[10px] font-mono text-amber-200">Tümünü Aç &rarr;</span>
            </button>
            <div class="space-y-1.5">
              @for (sub of philSubCats; track sub.name) {
                <app-category-card [category]="sub" discipline="felsefe" />
              }
            </div>
          </div>

          <!-- DİSİPLİNLERARASI KESİŞİM SECTION -->
          <div class="space-y-1.5">
            <button
              type="button"
              (click)="filterDiscipline('kesisim', 'Disiplinlerarası Kesişim & Anadolu İrfanı', 'Edebiyat ve felsefenin arakesitinde Cumhuriyet aydınlanması, Hacı Bektaş-ı Veli ve hermeneutik araştırmalar.')"
              class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-300/25 text-left text-[11px] font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer"
            >
              <span class="flex items-center gap-1.5">
                <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-emerald">auto_stories</mat-icon>
                <span>İRFAN &amp; ARAKESİT</span>
              </span>
              <span class="text-[10px] font-mono text-emerald-200">Tümünü Aç &rarr;</span>
            </button>
            <div class="space-y-1.5">
              @for (sub of kesisimSubCats; track sub.name) {
                <app-category-card [category]="sub" discipline="kesisim" />
              }
            </div>
          </div>
        </div>
      </div>

      <!-- 2. İNTERAKTİF LABORATUVAR & MODÜLLER (Ortada Tam Sayfa Açılır) -->
      <div class="p-4 rounded-3xl bg-glass-blue space-y-3">
        <div class="flex items-center gap-2 px-1">
          <mat-icon class="!w-4 !h-4 !text-base icon-luminous">bolt</mat-icon>
          <h4 class="text-xs font-bold text-cyan-200 tracking-wider uppercase">İnteraktif Laboratuvar</h4>
        </div>
        <div class="grid grid-cols-1 gap-2">
          <a
            routerLink="/siir-laboratuvari"
            routerLinkActive="!border-amber-300 !bg-[#12387a]"
            (click)="closeMobileDrawers()"
            class="flex items-center gap-3 p-3 rounded-2xl bg-glass-card group"
          >
            <div class="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-300/30 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform shrink-0">
              <mat-icon class="!w-5 !h-5 icon-luminous">music_note</mat-icon>
            </div>
            <div class="min-w-0">
              <span class="block text-xs font-bold text-white group-hover:text-cyan-200 truncate">Aruz &amp; Hece Vezin Lab</span>
              <span class="block text-[10px] text-sky-200/80 truncate">Otomatik tef'ile ve taktî analizi</span>
            </div>
          </a>

          <a
            routerLink="/lugat"
            routerLinkActive="!border-amber-300 !bg-[#12387a]"
            (click)="closeMobileDrawers()"
            class="flex items-center gap-3 p-3 rounded-2xl bg-glass-card group"
          >
            <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-300/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shrink-0">
              <mat-icon class="!w-5 !h-5 icon-luminous-amber">translate</mat-icon>
            </div>
            <div class="min-w-0">
              <span class="block text-xs font-bold text-white group-hover:text-amber-300 truncate">Terimler &amp; Istılah Lügatı</span>
              <span class="block text-[10px] text-sky-200/80 truncate">Edebiyat ve felsefe kavramları</span>
            </div>
          </a>

          <a
            routerLink="/erenler-ve-makamlar"
            routerLinkActive="!border-amber-300 !bg-[#12387a]"
            (click)="closeMobileDrawers()"
            class="flex items-center gap-3 p-3 rounded-2xl bg-glass-card group"
          >
            <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-300/30 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shrink-0">
              <mat-icon class="!w-5 !h-5 icon-luminous-emerald">explore</mat-icon>
            </div>
            <div class="min-w-0">
              <span class="block text-xs font-bold text-white group-hover:text-emerald-300 truncate">Erenler &amp; 4 Kapı 40 Makam</span>
              <span class="block text-[10px] text-sky-200/80 truncate">Anadolu irfan ve ozanlar atlası</span>
            </div>
          </a>

          <a
            routerLink="/kaynaklar"
            routerLinkActive="!border-amber-300 !bg-[#12387a]"
            (click)="closeMobileDrawers()"
            class="flex items-center gap-3 p-3 rounded-2xl bg-glass-card group"
          >
            <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-300/30 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shrink-0">
              <mat-icon class="!w-5 !h-5 icon-luminous-emerald">library_music</mat-icon>
            </div>
            <div class="min-w-0">
              <span class="block text-xs font-bold text-white group-hover:text-emerald-300 truncate">Telifsiz Deyiş &amp; Kaynaklar</span>
              <span class="block text-[10px] text-sky-200/80 truncate">Bağlama stüdyosu ve akademik arşivler</span>
            </div>
          </a>

          <a
            routerLink="/sayilar"
            routerLinkActive="!border-amber-300 !bg-[#12387a]"
            (click)="closeMobileDrawers()"
            class="flex items-center gap-3 p-3 rounded-2xl bg-glass-card group"
          >
            <div class="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-300/30 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform shrink-0">
              <mat-icon class="!w-5 !h-5 icon-luminous">collections_bookmark</mat-icon>
            </div>
            <div class="min-w-0">
              <span class="block text-xs font-bold text-white group-hover:text-cyan-200 truncate">Mecmua Sayıları &amp; Ciltler</span>
              <span class="block text-[10px] text-sky-200/80 truncate">Tematik fasikül arşivi</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class SidebarRight {
  readonly articleService = inject(ArticleService);
  private readonly layoutService = inject(LayoutService);
  private readonly router = inject(Router);

  readonly tdeSubCats: SidebarCategoryItem[] = [
    {
      name: 'Tasavvuf & Klasik Şiir',
      query: 'Tasavvuf|Fuzûlî|Şeyh Gâlib|Nesîmî',
      description: 'Divan edebiyatında vahdet-i vücûd, aşk metafiziği, Fuzûlî, Şeyh Gâlib ve Seyyid Nesîmî tahlilleri.',
      icon: 'auto_stories',
    },
    {
      name: 'Metin Şerhi & Belagat',
      query: 'Şerh|Su Kasidesi|Bâkî|Hüsn-i Aşk',
      description: 'Klasik beyit şerhi metodolojisi, mazmun coğrafyası, Bâkî ve Su Kasidesi belagat incelemeleri.',
      icon: 'history_edu',
    },
    {
      name: 'Modern Türk Şiiri & Poetika',
      query: 'Haşim|Tanpınar|Poetika',
      description: 'Ahmet Haşim saf şiir estetiği, Ahmet Hamdi Tanpınar’da Bergsoncu süre (durée) ve modern poetika.',
      icon: 'menu_book',
    },
  ];

  readonly philSubCats: SidebarCategoryItem[] = [
    {
      name: 'Varlık Felsefesi (Ontoloji)',
      query: 'Ontoloji|İbn Sînâ|Varlık',
      description: 'İbn Sînâ’da zorunlu-mümkün varlık ayrımı, Heideggerci Dasein ve varoluşsal ontoloji.',
      icon: 'all_inclusive',
    },
    {
      name: 'Bilgi, Bilim & Dil Felsefesi',
      query: 'Epistemoloji|Kant|Wittgenstein',
      description: 'Immanuel Kant’ın transandantal idealizmi, Wittgenstein dil felsefesi ve bilimsel yöntem.',
      icon: 'psychology',
    },
    {
      name: 'Ahlak, Etik & Erdem',
      query: 'Etik|Spinoza|Fârâbî|Erdem',
      description: 'Aristoteles ve Fârâbî’de mutluluk (eudaimonia/saâdet) etiği ile Spinoza’nın duygulanım felsefesi.',
      icon: 'balance',
    },
  ];

  readonly kesisimSubCats: SidebarCategoryItem[] = [
    {
      name: 'Atatürk & Hacı Bektaş İrfanı',
      query: 'Atatürk|Hacı Bektaş|Makâlât',
      description: 'Cumhuriyet aydınlanmasının bilimsel mürşit ilkesi ile Hünkâr Hacı Bektâş-ı Velî’nin Anadolu hümanizmi.',
      icon: 'account_balance',
    },
    {
      name: 'Yunus Emre & Anadolu Ozanları',
      query: 'Yunus Emre|Yedi Ulu Ozan|Nesîmî',
      description: 'Yunus Emre’nin gönül ontolojisi, Yedi Ulu Ozan geleneği ve Anadolu irfan nefesleri.',
      icon: 'lyrics',
    },
    {
      name: 'Edebi Hermeneutik & Yorum',
      query: 'Hermeneutik|Gadamer|Zaman',
      description: 'Gadamer’in ufukların kaynaşması kuramı ve edebi metinlerin felsefi yorumbilimi.',
      icon: 'visibility',
    },
  ];

  isHomeRoute(): boolean {
    return this.router.url === '/' || this.router.url.startsWith('/?');
  }

  openStageMode(mode: 'dashboard' | 'ataturk-bektas' | 'mirat-irfan'): void {
    if (mode === 'dashboard') {
      this.articleService.resetToMainDashboard();
      this.router.navigate(['/']);
    } else {
      this.articleService.centerStageView.set(mode);
      if (!this.isHomeRoute()) {
        this.router.navigate(['/']);
      }
      if (typeof window !== 'undefined') {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    }
    this.layoutService.closeAllDrawers();
  }

  filterDiscipline(discipline: DisciplineType, title: string, description: string): void {
    this.articleService.openCategoryInCenter({
      discipline,
      query: '',
      title,
      description,
    });
    this.layoutService.closeAllDrawers();
    this.router.navigate(['/'], {queryParams: {discipline}});
  }

  resetFilters(): void {
    this.articleService.resetToMainDashboard();
    this.layoutService.closeAllDrawers();
    this.router.navigate(['/']);
  }

  closeMobileDrawers(): void {
    this.layoutService.closeAllDrawers();
  }
}
