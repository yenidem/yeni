import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {DOORS_DATA, ERENLER_DATA, FORTY_MAKAMS_DATA, WISDOM_DILEMMAS} from '../../../core/constants/makam-data';
import {DoorType} from '../../../core/models/makam.model';

type ActiveTab = 'makamlar' | 'erenler' | 'pusula' | 'manifesto';

@Component({
  selector: 'app-makam-atlas',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      <!-- Top Scholarly & Philosophical Header -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#090d18] to-[#040711] border border-amber-500/25 p-8 sm:p-12 shadow-2xl text-stone-100">
        <!-- Background Sacred Geometric Glow -->
        <div class="absolute -right-24 -top-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 max-w-4xl space-y-5">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-wide">
            <mat-icon class="!w-4 !h-4 !text-sm text-amber-400">explore</mat-icon>
            <span>Anadolu İrfanı & Felsefi Ontoloji Atlası</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Erenler Atlası ve <br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-300">
              Dört Kapı Kırk Makamın
            </span> Çağdaş İzahı
          </h1>

          <p class="text-sm sm:text-base text-stone-300 leading-relaxed font-sans max-w-3xl">
            Hacı Bektâş-ı Velî'den Yunus Emre'ye, Pîr Sultan Abdal'dan Sarı Saltuk ve Ahî Evran'a uzanan Anadolu irfanı;
            yalnızca geçmişin hatırası değil, modern insanın anlam krizine, yabancılaşmasına ve kutuplaşmasına sunulmuş
            evrensel bir <strong>bilişsel ve varoluşsal tekâmül pusulasıdır</strong>.
          </p>

          <!-- Quick Stats Banner -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-left">
            <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-2xl font-serif font-bold text-amber-400">4 Kapı</span>
              <span class="text-[11px] text-stone-400">Şeriat, Tarikat, Marifet, Hakikat</span>
            </div>
            <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-2xl font-serif font-bold text-emerald-400">40 Makam</span>
              <span class="text-[11px] text-stone-400">Tamamı Çağdaş Psikolojiyle Şerh Edildi</span>
            </div>
            <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-2xl font-serif font-bold text-cyan-400">7 Pîr & Bilge</span>
              <span class="text-[11px] text-stone-400">Modern Felsefi İzdüşümleriyle</span>
            </div>
            <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span class="block text-2xl font-serif font-bold text-rose-400">İrfan Pusulası</span>
              <span class="text-[11px] text-stone-400">Gündelik Çıkmazlara Somut Rehber</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Navigation Tabs -->
      <nav class="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 font-sans text-xs sm:text-sm">
        <button
          type="button"
          (click)="activeTab.set('makamlar')"
          class="px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer"
          [class.bg-amber-500/20]="activeTab() === 'makamlar'"
          [class.text-amber-300]="activeTab() === 'makamlar'"
          [class.border]="activeTab() === 'makamlar'"
          [class.border-amber-500/40]="activeTab() === 'makamlar'"
          [class.text-stone-300]="activeTab() !== 'makamlar'"
          [class.hover:text-white]="activeTab() !== 'makamlar'"
          [class.hover:bg-white/5]="activeTab() !== 'makamlar'"
        >
          <mat-icon class="!w-4 !h-4 !text-base text-amber-400">grid_view</mat-icon>
          <span>Dört Kapı 40 Makam Matrisi</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('erenler')"
          class="px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer"
          [class.bg-amber-500/20]="activeTab() === 'erenler'"
          [class.text-amber-300]="activeTab() === 'erenler'"
          [class.border]="activeTab() === 'erenler'"
          [class.border-amber-500/40]="activeTab() === 'erenler'"
          [class.text-stone-300]="activeTab() !== 'erenler'"
          [class.hover:text-white]="activeTab() !== 'erenler'"
          [class.hover:bg-white/5]="activeTab() !== 'erenler'"
        >
          <mat-icon class="!w-4 !h-4 !text-base text-amber-400">groups</mat-icon>
          <span>Erenler ve Bilgeler Galerisi</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('pusula')"
          class="px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer"
          [class.bg-emerald-500/20]="activeTab() === 'pusula'"
          [class.text-emerald-300]="activeTab() === 'pusula'"
          [class.border]="activeTab() === 'pusula'"
          [class.border-emerald-500/40]="activeTab() === 'pusula'"
          [class.text-stone-300]="activeTab() !== 'pusula'"
          [class.hover:text-white]="activeTab() !== 'pusula'"
          [class.hover:bg-white/5]="activeTab() !== 'pusula'"
        >
          <mat-icon class="!w-4 !h-4 !text-base text-emerald-400">compass_calibration</mat-icon>
          <span>İrfan Pusulası (Modern Yaşam)</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('manifesto')"
          class="px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer"
          [class.bg-cyan-500/20]="activeTab() === 'manifesto'"
          [class.text-cyan-300]="activeTab() === 'manifesto'"
          [class.border]="activeTab() === 'manifesto'"
          [class.border-cyan-500/40]="activeTab() === 'manifesto'"
          [class.text-stone-300]="activeTab() !== 'manifesto'"
          [class.hover:text-white]="activeTab() !== 'manifesto'"
          [class.hover:bg-white/5]="activeTab() !== 'manifesto'"
        >
          <mat-icon class="!w-4 !h-4 !text-base text-cyan-400">auto_stories</mat-icon>
          <span>Modernizasyon Manifestosu</span>
        </button>
      </nav>

      <!-- TAB 1: DÖRT KAPI KIRK MAKAM MATRİSİ -->
      @if (activeTab() === 'makamlar') {
        <div class="space-y-8">
          
          <!-- Door Selection Cards (4 Doors) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            @for (door of doors; track door.id) {
              <button
                type="button"
                (click)="selectedDoor.set(door.id)"
                class="text-left w-full p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group shadow-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                [class.bg-gradient-to-br]="true"
                [class]="selectedDoor() === door.id ? door.accentBg + ' border-amber-400 ring-2 ring-amber-400/40' : 'from-[#0e1628] to-[#070b16] border-white/10 hover:border-white/20'"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10" [class]="door.color">
                    {{ door.element }}
                  </span>
                  <mat-icon class="!w-5 !h-5 !text-xl" [class]="door.color">{{ door.icon }}</mat-icon>
                </div>

                <h3 class="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                  {{ door.name }}
                </h3>
                
                <p class="text-xs text-amber-300/90 font-medium mt-1">
                  {{ door.symbol }}
                </p>

                <p class="text-[11px] text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                  {{ door.modernConcept }}
                </p>

                <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
                  <span>10 Makam</span>
                  <span class="font-medium" [class]="door.color">
                    {{ selectedDoor() === door.id ? 'Aktif Kapı ✓' : 'İncele →' }}
                  </span>
                </div>
              </button>
            }
          </div>

          <!-- Active Door Detailed Info Card -->
          @if (currentDoorDef(); as activeDoor) {
            <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#10182b] to-[#080d1a] border border-amber-500/25 space-y-4 shadow-xl">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold">
                      Kozmik Unsur: {{ activeDoor.element }}
                    </span>
                    <span class="text-xs text-stone-400 font-mono">
                      {{ activeDoor.spiritualLevel }}
                    </span>
                  </div>
                  <h2 class="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                    {{ activeDoor.name }}: <span [class]="activeDoor.color">{{ activeDoor.symbol }}</span>
                  </h2>
                </div>
                <div class="text-xs sm:text-sm text-stone-300 max-w-md bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <strong class="text-white block font-serif">Çağdaş Felsefi Anlamı:</strong>
                  {{ activeDoor.modernConcept }}
                </div>
              </div>
              <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans pt-1">
                {{ activeDoor.description }}
              </p>
            </div>
          }

          <!-- The 10 Makams for Current Door -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold uppercase tracking-wider text-amber-400 font-serif flex items-center gap-2">
                <mat-icon class="!w-4 !h-4 !text-base text-amber-400">format_list_numbered</mat-icon>
                <span>{{ currentDoorDef().name }} Basamakları (10 Makam)</span>
              </h3>
              <span class="text-xs text-stone-400 font-mono">
                Detayını görmek için karta tıklayın
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (makam of filteredMakams(); track makam.id) {
                <div
                  role="button"
                  tabindex="0"
                  (click)="toggleMakamExpand(makam.id)"
                  (keydown.enter)="toggleMakamExpand(makam.id)"
                  (keydown.space)="toggleMakamExpand(makam.id)"
                  class="p-5 rounded-2xl border transition-all cursor-pointer bg-[#0a0f1d] hover:bg-[#0f172a] shadow-md space-y-3 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  [class.border-amber-400]="expandedMakamId() === makam.id"
                  [class.ring-1]="expandedMakamId() === makam.id"
                  [class.ring-amber-400/40]="expandedMakamId() === makam.id"
                  [class.border-white/10]="expandedMakamId() !== makam.id"
                >
                  <!-- Card Header -->
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <span class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-xs">
                        #{{ makam.numberInDoor }}
                      </span>
                      <div>
                        <h4 class="text-base font-serif font-bold text-white group-hover:text-amber-300">
                          {{ makam.title }}
                        </h4>
                        <span class="text-[11px] text-stone-400 font-mono italic">
                          Kadim Terim: "{{ makam.originalTerm }}"
                        </span>
                      </div>
                    </div>
                    <span class="text-xs text-amber-400 font-mono">
                      {{ expandedMakamId() === makam.id ? '▲ Kapat' : '▼ Aç' }}
                    </span>
                  </div>

                  <!-- Core Principle Preview -->
                  <p class="text-xs text-stone-300 font-sans leading-relaxed">
                    {{ makam.classicalMeaning }}
                  </p>

                  <!-- Expanded Content Section -->
                  @if (expandedMakamId() === makam.id) {
                    <div class="mt-4 pt-4 border-t border-white/10 space-y-3 text-xs text-stone-200">
                      
                      <!-- Modern Psychological/Philosophical Interpretation -->
                      <div class="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 space-y-1">
                        <span class="font-serif font-bold text-cyan-300 flex items-center gap-1.5">
                          <mat-icon class="!w-3.5 !h-3.5 !text-sm text-cyan-400">psychology</mat-icon>
                          Çağdaş Bilişsel ve Varoluşsal Yorum:
                        </span>
                        <p class="text-stone-300 font-sans leading-relaxed">
                          {{ makam.modernInterpretation }}
                        </p>
                      </div>

                      <!-- 21st Century Daily Practice -->
                      <div class="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                        <span class="font-serif font-bold text-emerald-300 flex items-center gap-1.5">
                          <mat-icon class="!w-3.5 !h-3.5 !text-sm text-emerald-400">check_circle</mat-icon>
                          21. Yüzyıl Yaşam Pratiği:
                        </span>
                        <p class="text-stone-300 font-sans leading-relaxed">
                          {{ makam.contemporaryPractice }}
                        </p>
                      </div>

                      <!-- Quote Banner -->
                      <div class="p-3 rounded-xl bg-white/5 border border-white/10 italic font-serif text-stone-300 flex items-start gap-2">
                        <mat-icon class="!w-4 !h-4 !text-sm text-amber-400 mt-0.5">format_quote</mat-icon>
                        <div>
                          <span>"{{ makam.relatedQuote }}"</span>
                          <span class="block not-italic text-[10px] text-amber-300 font-mono mt-1">
                            — {{ makam.quoteAuthor }}
                          </span>
                        </div>
                      </div>

                    </div>
                  }
                </div>
              }
            </div>
          </div>

        </div>
      }

      <!-- TAB 2: ERENLER VE BİLGELER GALERİSİ -->
      @if (activeTab() === 'erenler') {
        <div class="space-y-10">
          
          <!-- Sage Selector Chips -->
          <div class="flex flex-wrap gap-2">
            @for (sage of erenler; track sage.id) {
              <button
                type="button"
                (click)="selectedSageId.set(sage.id)"
                class="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                [class.bg-amber-500]="selectedSageId() === sage.id"
                [class.text-stone-950]="selectedSageId() === sage.id"
                [class.font-bold]="selectedSageId() === sage.id"
                [class.bg-[#0f172a]]="selectedSageId() !== sage.id"
                [class.text-stone-300]="selectedSageId() !== sage.id"
                [class.border]="selectedSageId() !== sage.id"
                [class.border-white/10]="selectedSageId() !== sage.id"
              >
                <span>{{ sage.name }}</span>
              </button>
            }
          </div>

          <!-- Featured Sage Card -->
          @if (currentSage(); as sage) {
            <article class="rounded-3xl bg-gradient-to-br from-[#10182b] via-[#090f1d] to-[#040812] border border-amber-500/30 overflow-hidden shadow-2xl space-y-6">
              
              <!-- Banner Image with Overlay -->
              <div class="relative h-64 sm:h-80 w-full overflow-hidden">
                <img
                  [src]="sage.bannerImage"
                  [alt]="sage.name"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover object-center filter brightness-75 hover:scale-105 transition-transform duration-700"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#090f1d] via-[#090f1d]/50 to-transparent"></div>
                
                <div class="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span class="text-xs px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-mono font-bold">
                      {{ sage.era }}
                    </span>
                    <h2 class="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
                      {{ sage.name }}
                    </h2>
                    <p class="text-sm text-amber-300 font-sans font-medium">
                      {{ sage.title }}
                    </p>
                  </div>
                  <div class="text-xs text-stone-300 font-mono bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    📍 {{ sage.location }}
                  </div>
                </div>
              </div>

              <!-- Sage Detailed Content Body -->
              <div class="p-6 sm:p-10 space-y-8">
                
                <!-- Archetype & Modern Counterpart Highlights -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/25 space-y-1">
                    <span class="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider block">
                      Evrensel Arketip
                    </span>
                    <p class="text-sm font-serif font-bold text-white">
                      {{ sage.archetype }}
                    </p>
                    <span class="text-[11px] text-stone-400 font-mono">
                      Sembolik Öğe: {{ sage.symbolicElement }}
                    </span>
                  </div>

                  <div class="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/25 space-y-1">
                    <span class="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider block">
                      Çağdaş Felsefi İzdüşümü
                    </span>
                    <p class="text-sm font-serif font-bold text-white">
                      {{ sage.modernCounterpart }}
                    </p>
                    <span class="text-[11px] text-stone-400 font-sans">
                      Ortak Problem: İnsan onuru, hakikat, ötekiyle diyalog
                    </span>
                  </div>
                </div>

                <!-- Biography & Philosophical Core -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 text-stone-300 text-xs sm:text-sm font-sans leading-relaxed">
                  <div class="space-y-3">
                    <h3 class="text-base font-serif font-bold text-white flex items-center gap-2">
                      <mat-icon class="!w-4 !h-4 !text-base text-amber-400">history_edu</mat-icon>
                      <span>Tarihsel Kimliği ve Hareketi</span>
                    </h3>
                    <p class="text-justify">
                      {{ sage.biography }}
                    </p>
                  </div>

                  <div class="space-y-3">
                    <h3 class="text-base font-serif font-bold text-white flex items-center gap-2">
                      <mat-icon class="!w-4 !h-4 !text-base text-emerald-400">psychology</mat-icon>
                      <span>Ontolojik ve Felsefi Özü</span>
                    </h3>
                    <p class="text-justify">
                      {{ sage.philosophicalEssence }}
                    </p>
                  </div>
                </div>

                <!-- Why Listen Today Box -->
                <div class="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#111827] to-[#0b101d] border border-amber-500/30 space-y-2">
                  <div class="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm">
                    <mat-icon class="!w-4 !h-4 !text-base text-amber-400">lightbulb</mat-icon>
                    <span>Neden Bugün Onu Dinlemeliyiz? (21. Yüzyıl Cevabı)</span>
                  </div>
                  <p class="text-xs sm:text-sm text-stone-200 font-sans leading-relaxed">
                    {{ sage.keyDifferentiator }}
                  </p>
                </div>

                <!-- Famous Aphorisms with Modern Interpretations -->
                <div class="space-y-4">
                  <h3 class="text-sm font-bold uppercase tracking-wider text-amber-400 font-serif flex items-center gap-2">
                    <mat-icon class="!w-4 !h-4 !text-base text-amber-400">auto_stories</mat-icon>
                    <span>Özlü Sözleri ve Çağdaş Açılımları</span>
                  </h3>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    @for (ap of sage.famousAphorisms; track ap.quote) {
                      <div class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <blockquote class="font-serif italic text-white text-xs sm:text-sm leading-relaxed">
                          "{{ ap.quote }}"
                        </blockquote>
                        <div class="text-[10px] text-amber-400 font-mono">
                          Kaynak: {{ ap.source }}
                        </div>
                        <div class="pt-2 border-t border-white/10 text-xs text-stone-300 font-sans">
                          <strong class="text-emerald-300 font-medium">Çağdaş Anlam:</strong>
                          {{ ap.modernTake }}
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Related Academic Article Link (if exists) -->
                @if (sage.relatedArticleSlug) {
                  <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="text-xs text-stone-400">
                      Bu eren hakkında Külliyat'ta kaleme alınmış detaylı akademik incelemeyi okumak ister misiniz?
                    </div>
                    <a
                      [routerLink]="['/makale', sage.relatedArticleSlug]"
                      class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors shadow-md"
                    >
                      <mat-icon class="!w-4 !h-4 !text-sm">menu_book</mat-icon>
                      <span>Akademik Makaleyi Oku</span>
                    </a>
                  </div>
                }

              </div>

            </article>
          }

        </div>
      }

      <!-- TAB 3: İRFAN PUSULASI (MODERN YAŞAM REHBERİ) -->
      @if (activeTab() === 'pusula') {
        <div class="space-y-8">
          
          <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#10182b] to-[#070b14] border border-emerald-500/30 text-stone-100 shadow-xl space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">
              <mat-icon class="!w-3.5 !h-3.5 !text-xs text-emerald-400">explore</mat-icon>
              <span>İçsel Hal ve Durum Teşhisi</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-serif font-bold text-white">
              Hangi Hal Üzeresin? Günlük Yaşam İrfan Pusulası
            </h2>
            <p class="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Modern dünyada sıkıştığımız tükenmişlik, kibir, kutuplaşma, hırs veya affedememe gibi varoluşsal düğümlere
              Anadolu erenlerinin 40 Makam içerisinden verdiği somut cevaplar ve pratik öneriler:
            </p>
          </div>

          <!-- Dilemmas Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (dilemma of dilemmas; track dilemma.id) {
              <div
                class="p-6 rounded-2xl border border-white/10 bg-[#090e1c] hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-stone-300">
                      {{ dilemma.category }}
                    </span>
                    <span class="text-xs font-mono text-amber-400">
                      Makam #{{ dilemma.makamNumber }}
                    </span>
                  </div>

                  <h3 class="text-base font-serif font-bold text-white">
                    "{{ dilemma.situation }}"
                  </h3>

                  <p class="text-xs text-stone-400 leading-relaxed font-sans">
                    {{ dilemma.description }}
                  </p>

                  <!-- Associated Door & Makam -->
                  <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-300 font-mono">
                    <span class="text-stone-400 block text-[10px]">İrfani Çözüm Kapısı:</span>
                    {{ dilemma.makamTitle }}
                  </div>

                  <!-- Sage Quote -->
                  <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-200 italic font-serif">
                    "{{ dilemma.sageQuote }}"
                    <span class="block not-italic text-[10px] text-amber-300 font-mono mt-1">
                      — {{ dilemma.sageName }}
                    </span>
                  </div>
                </div>

                <!-- Actionable Step -->
                <div class="pt-3 border-t border-white/10 space-y-1">
                  <span class="text-[11px] font-bold text-emerald-400 flex items-center gap-1 font-sans">
                    <mat-icon class="!w-3.5 !h-3.5 !text-sm text-emerald-400">task_alt</mat-icon>
                    Bugün Atabileceğin Somut Adım:
                  </span>
                  <p class="text-xs text-stone-300 font-sans leading-relaxed">
                    {{ dilemma.actionableStep }}
                  </p>
                </div>
              </div>
            }
          </div>

        </div>
      }

      <!-- TAB 4: MODERNİZASYON MANİFESTOSU -->
      @if (activeTab() === 'manifesto') {
        <article class="max-w-4xl mx-auto space-y-8 bg-[#0c1322] p-8 sm:p-12 rounded-3xl border border-amber-500/25 shadow-2xl text-stone-100 font-sans">
          
          <div class="space-y-3 text-center sm:text-left">
            <span class="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
              Akademik & Felsefi Perspektif
            </span>
            <h2 class="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Anadolu İrfanını 21. Yüzyıla Taşımak: <br />
              Nasıl Bir Dil ve Yöntem?
            </h2>
            <p class="text-xs sm:text-sm text-stone-300">
              Külliyat Kürsüsü Araştırma Notu &bull; Orçun KUNDAKCI
            </p>
          </div>

          <div class="prose max-w-none text-stone-200 font-serif leading-relaxed text-justify space-y-6 text-sm sm:text-base border-t border-white/10 pt-6">
            
            <h3 class="text-amber-300 font-serif font-bold text-lg not-italic">
              1. Şekilperest Nostaljiden "Bilişsel Arketip"e Geçiş
            </h3>
            <p>
              Anadolu erenleri asırlardır ya folklorik bir türkü figürü olarak sınırlandırılmış ya da katı mezhebî tartışmaların 
              içine hapsedilmiştir. Oysa Hacı Bektâş-ı Velî'nin <em>Makâlât</em>'ı bir ahlak felsefesi başyapıtıdır; Yunus Emre'nin 
              şiirleri fenomenolojik bir varlık araştırmasıdır; Pîr Sultan Abdal'ın haykırışı ise politik ontolojinin en tavizsiz 
              vicdan sesidir. Sarı Saltuk ise sınırları aşan kolonizatör dervişliğiyle kültürlerarası diyaloğun tarihsel öncüsüdür.
            </p>
            <p>
              Onları modern insana anlatmanın yolu, eskiyi körü körüne taklit etmek değil; söyledikleri evrensel kavramları 
              (ego, adalet, ötekileştirmeme, sevgi, bilişsel alçakgönüllülük) çağdaş felsefenin ve psikolojinin diliyle 
              <strong>çapraz okumaya (cross-reading)</strong> tabi tutmaktır.
            </p>

            <h3 class="text-amber-300 font-serif font-bold text-lg not-italic">
              2. Dört Kapı Kırk Makam: İnsanın Zihinsel Tekâmül Haritası
            </h3>
            <p>
              Dört Kapı Kırk Makam doktrini, insanın hamlıktan (egoist dürtülerden) kâmil insana (kozmik bütünleşmeye) 
              uzanan psikolojik gelişim basamaklarıdır:
            </p>
            <ul class="list-disc list-inside space-y-2 text-stone-300 font-sans text-xs sm:text-sm pl-2">
              <li><strong>Şeriat (Sosyal Sözleşme & Hukuk):</strong> Hukuk devleti, toplum sözleşmesi, zarar vermeme kuralı.</li>
              <li><strong>Tarikat (İç Disiplin & Karakter):</strong> Bencillikle savaş, minimalizm, karşılıksız kamu hizmeti.</li>
              <li><strong>Marifet (Bilişsel Sezgi & Empati):</strong> Öz-farkındalık ("Kendini bilmek"), kozmik huşu, derin irfan.</li>
              <li><strong>Hakikat (Vahdet & Egosuzluk):</strong> 72 millete aynı nazarla bakmak, mülkiyet hırsından arınmak, mutlak adalet.</li>
            </ul>

            <h3 class="text-amber-300 font-serif font-bold text-lg not-italic">
              3. Görsel ve Tasarımsal Dil: Mistik Minimalizm
            </h3>
            <p>
              Eski püskü sararmış kağıt efektleri veya klişe minyatürler genç zihinlerde merak uyandırmaz. 
              İhtiyacımız olan görsel dil: <strong>Mistik Minimalizm</strong>dir. Koyu kozmik obsidiyen fonlar, Selçuklu sekizgeni 
              ve kutsal geometri hatları, yüksek çözünürlüklü doğa ve mimari kompozisyonlar ve vurucu çağdaş tipografi... 
              Bilgi, hap tefekkür kartları ve interaktif keşif ağaçları şeklinde sunulmalıdır.
            </p>

            <div class="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 not-italic font-sans text-xs sm:text-sm">
              <strong class="font-serif text-white block mb-1 text-base">Sonuç:</strong>
              Anadolu irfanı bir müze eseri değildir; yaşayan, nefes alan, yapay zeka ve yabancılaşma çağında insana 
              özünü hatırlatan en berrak pınardır.
            </div>

          </div>

        </article>
      }

    </div>
  `,
})
export class MakamAtlas {
  readonly doors = DOORS_DATA;
  readonly fortyMakams = FORTY_MAKAMS_DATA;
  readonly erenler = ERENLER_DATA;
  readonly dilemmas = WISDOM_DILEMMAS;

  readonly activeTab = signal<ActiveTab>('makamlar');
  readonly selectedDoor = signal<DoorType>('seriat');
  readonly expandedMakamId = signal<number | null>(1);
  readonly selectedSageId = signal<string>('haci-bektas-veli');

  readonly currentDoorDef = computed(() => {
    return this.doors.find((d) => d.id === this.selectedDoor()) ?? this.doors[0];
  });

  readonly filteredMakams = computed(() => {
    return this.fortyMakams.filter((m) => m.door === this.selectedDoor());
  });

  readonly currentSage = computed(() => {
    return this.erenler.find((s) => s.id === this.selectedSageId()) ?? this.erenler[0];
  });

  toggleMakamExpand(makamId: number): void {
    if (this.expandedMakamId() === makamId) {
      this.expandedMakamId.set(null);
    } else {
      this.expandedMakamId.set(makamId);
    }
  }
}
