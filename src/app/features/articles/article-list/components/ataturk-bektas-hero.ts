import {ChangeDetectionStrategy, Component, computed, inject, output, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {SpeechService} from '../../../../core/services/speech.service';

interface PillarTeaching {
  id: string;
  tabLabel: string;
  badge: string;
  quote: string;
  source: string;
  analysis: string;
  searchKeyword: string;
}

@Component({
  selector: 'app-ataturk-bektas-hero',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <section
      aria-label="Cumhuriyetin İlim Meşalesi Gazi Mustafa Kemal Atatürk ve Anadolu İrfan Piri Hünkâr Hacı Bektâş-ı Velî Başköşesi"
      class="rounded-3xl bg-glass-blue p-5 sm:p-8 space-y-6 relative overflow-hidden"
    >
      <!-- Ambient Horizon Cloud & Gold/Turquoise Illumination -->
      <div class="absolute -top-24 left-1/5 w-96 h-56 bg-amber-400/15 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 right-1/5 w-96 h-56 bg-emerald-400/15 blur-3xl pointer-events-none"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-40 bg-sky-400/10 blur-3xl pointer-events-none"></div>

      <!-- Top Section Banner Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sky-300/25 relative z-10">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2 text-xs font-serif text-amber-300">
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">auto_awesome</mat-icon>
            <span class="font-bold tracking-wider uppercase">AKIL, İLİM VE ANADOLU İRFANI BAŞKÖŞESİ</span>
            <span aria-hidden="true">·</span>
            <span class="text-cyan-200">YENİDEM Felsefe ve Edebiyat Kürsüsü</span>
          </div>
          <p class="text-xs text-sky-100/85 font-sans">
            Cumhuriyet aydınlanmasının bilimsel rehberliği ile Anadolu hümanizminin gönül birliğini buluşturan iki temel sütun
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            (click)="listenSynthesisBridge()"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
            title="Atatürk ve Hacı Bektaş-ı Veli ortak tefekkür şerhini sesli dinle"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">record_voice_over</mat-icon>
            <span>Ortak Şerhi Dinle</span>
          </button>

          <a
            routerLink="/erenler-ve-makamlar"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">explore</mat-icon>
            <span>İrfan Atlası</span>
          </a>
        </div>
      </div>

      <!-- Symmetrical Dual Pillar Grid: Atatürk (Left) & Hacı Bektaş-ı Veli (Right) -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch relative z-10">

        <!-- PILLAR 1: GAZİ MUSTAFA KEMAL ATATÜRK (Nutuk & İlim Kütüphanesi) -->
        <article class="xl:col-span-6 rounded-3xl bg-glass-card overflow-hidden flex flex-col justify-between border border-amber-400/40 group">
          <div>
            <!-- Library Portrait Showcase Header -->
            <div class="relative h-60 sm:h-68 w-full overflow-hidden bg-gradient-to-br from-[#0d234a] to-[#061126] border-b border-amber-400/25">
              @if (!ataturkImgError()) {
                <img
                  src="/src/assets/images/ataturk_library_nutuk_1790712520394.jpg"
                  alt="Gazi Mustafa Kemal Atatürk kütüphanede Nutuk eseri ile — Hayatta en hakiki mürşit ilimdir, fendir"
                  (error)="ataturkImgError.set(true)"
                  class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerpolicy="no-referrer"
                />
              } @else {
                <img
                  src="/assets/default-article-cover.svg"
                  alt="Gazi Mustafa Kemal Atatürk"
                  class="w-full h-full object-cover"
                />
              }
              <div class="absolute inset-0 bg-gradient-to-t from-[#051024] via-[#051024]/30 to-transparent"></div>

              <!-- Top Arch Inscription Ribbon -->
              <div class="absolute top-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2">
                <span class="px-3 py-1 rounded-xl bg-[#050f24]/85 backdrop-blur-md border border-amber-400/50 text-[11px] font-serif font-bold text-amber-300 shadow-lg flex items-center gap-1.5">
                  <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">menu_book</mat-icon>
                  <span>CUMHURİYET VE İLİM KÜRSÜSÜ</span>
                </span>
                <span class="px-2.5 py-1 rounded-xl bg-[#050f24]/85 backdrop-blur-md border border-sky-300/40 text-[11px] font-mono font-semibold text-cyan-200">
                  NUTUK · 1927
                </span>
              </div>

              <!-- Name & Title Overlay -->
              <div class="absolute bottom-3.5 left-4 right-4">
                <h2 class="text-xl sm:text-2xl font-serif font-bold text-white drop-shadow-md">
                  Gazi Mustafa Kemal ATATÜRK
                </h2>
                <p class="text-xs text-amber-200/95 font-serif italic">
                  Türkiye Cumhuriyeti Kurucusu · Başöğretmen ve Fikir Önderi (1881 – 1938)
                </p>
              </div>
            </div>

            <!-- Interactive Teaching Selector & Content -->
            <div class="p-5 sm:p-6 space-y-4">
              <!-- Teaching Tabs -->
              <div class="flex flex-wrap items-center gap-1.5 pb-1 border-b border-sky-300/15">
                @for (item of ataturkTeachings; track item.id; let idx = $index) {
                  <button
                    type="button"
                    (click)="activeAtaturkIndex.set(idx)"
                    class="px-3 py-1.5 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer border"
                    [class.bg-amber-400/20]="activeAtaturkIndex() === idx"
                    [class.text-amber-200]="activeAtaturkIndex() === idx"
                    [class.border-amber-300/60]="activeAtaturkIndex() === idx"
                    [class.shadow-sm]="activeAtaturkIndex() === idx"
                    [class.bg-white/5]="activeAtaturkIndex() !== idx"
                    [class.text-sky-200/80]="activeAtaturkIndex() !== idx"
                    [class.border-white/10]="activeAtaturkIndex() !== idx"
                  >
                    {{ item.tabLabel }}
                  </button>
                }
              </div>

              @let currentAtaturk = activeAtaturkTeaching();

              <blockquote class="p-4 rounded-2xl bg-[#071633]/90 border-l-3 border-amber-400 space-y-2 shadow-inner">
                <div class="text-[11px] font-mono text-amber-300/90 uppercase tracking-wider">
                  {{ currentAtaturk.badge }}
                </div>
                <p class="font-serif text-sm sm:text-base text-amber-100 font-semibold leading-relaxed">
                  &ldquo;{{ currentAtaturk.quote }}&rdquo;
                </p>
                <footer class="text-[11px] text-sky-200/80 font-mono">
                  — {{ currentAtaturk.source }}
                </footer>
              </blockquote>

              <p class="text-xs sm:text-sm text-stone-200/95 leading-relaxed font-sans">
                {{ currentAtaturk.analysis }}
              </p>
            </div>
          </div>

          <!-- Card Footer Actions -->
          <div class="px-5 sm:px-6 py-3.5 border-t border-sky-300/20 bg-[#06132c]/70 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              (click)="listenAtaturk()"
              class="nav-pill-btn !h-9 !px-3.5 text-xs"
            >
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">volume_up</mat-icon>
              <span>Vecizeyi Sesli Dinle</span>
            </button>

            <button
              type="button"
              (click)="filterKeyword.emit(activeAtaturkTeaching().searchKeyword)"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-cyan-200 transition-colors cursor-pointer"
            >
              <span>{{ activeAtaturkTeaching().searchKeyword }} İncelemeleri</span>
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">arrow_forward</mat-icon>
            </button>
          </div>
        </article>

        <!-- PILLAR 2: HÜNKÂR HACI BEKTÂŞ-I VELÎ (Aslan ile Ceylanın Dostluğu) -->
        <article class="xl:col-span-6 rounded-3xl bg-glass-card overflow-hidden flex flex-col justify-between border border-emerald-400/40 group">
          <div>
            <!-- Symbolic Portrait Showcase Header (Matching Height & Full Uncropped View) -->
            <div class="relative h-60 sm:h-68 w-full overflow-hidden bg-gradient-to-br from-[#09292b] via-[#0a203d] to-[#061226] border-b border-emerald-400/25 flex items-center justify-center">
              @if (!bektasImgError()) {
                <!-- Ambient Blurred Backdrop Layer -->
                <img
                  src="/src/assets/images/haci_bektas_veli_portrait_1790712530952.jpg"
                  alt=""
                  aria-hidden="true"
                  class="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-45 pointer-events-none"
                  referrerpolicy="no-referrer"
                />
                <!-- Crisp Full Composition Layer (Shows Lion & Gazelle completely) -->
                <img
                  src="/src/assets/images/haci_bektas_veli_portrait_1790712530952.jpg"
                  alt="Hünkâr Hacı Bektâş-ı Velî — Aslan ve Ceylanı kucağında buluşturan Anadolu irfan piri"
                  (error)="bektasImgError.set(true)"
                  class="relative z-10 h-full w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_10px_25px_rgba(2,8,23,0.9)]"
                  referrerpolicy="no-referrer"
                />
              } @else {
                <img
                  src="/assets/default-article-cover.svg"
                  alt="Hünkâr Hacı Bektâş-ı Velî"
                  class="w-full h-full object-cover"
                />
              }
              <div class="absolute inset-0 bg-gradient-to-t from-[#051024] via-[#051024]/25 to-transparent z-10 pointer-events-none"></div>

              <!-- Top Arch Inscription Ribbon -->
              <div class="absolute top-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2 z-20">
                <span class="px-3 py-1 rounded-xl bg-[#050f24]/85 backdrop-blur-md border border-emerald-400/50 text-[11px] font-serif font-bold text-emerald-300 shadow-lg flex items-center gap-1.5">
                  <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-emerald">flare</mat-icon>
                  <span>ANADOLU İRFAN SERÇEŞMESİ</span>
                </span>
                <span class="px-2.5 py-1 rounded-xl bg-[#050f24]/85 backdrop-blur-md border border-sky-300/40 text-[11px] font-mono font-semibold text-cyan-200">
                  MAKÂLÂT · XIII. YY
                </span>
              </div>

              <!-- Name & Title Overlay -->
              <div class="absolute bottom-3.5 left-4 right-4 z-20">
                <h2 class="text-xl sm:text-2xl font-serif font-bold text-white drop-shadow-md">
                  Hünkâr Hacı Bektâş-ı VELÎ
                </h2>
                <p class="text-xs text-emerald-200/95 font-serif italic">
                  Anadolu Erenlerinin Pîri · Horasan – Sulucakarahöyük (1209 – 1271)
                </p>
              </div>
            </div>

            <!-- Interactive Teaching Selector & Content -->
            <div class="p-5 sm:p-6 space-y-4">
              <!-- Teaching Tabs -->
              <div class="flex flex-wrap items-center gap-1.5 pb-1 border-b border-sky-300/15">
                @for (item of bektasTeachings; track item.id; let idx = $index) {
                  <button
                    type="button"
                    (click)="activeBektasIndex.set(idx)"
                    class="px-3 py-1.5 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer border"
                    [class.bg-emerald-400/20]="activeBektasIndex() === idx"
                    [class.text-emerald-200]="activeBektasIndex() === idx"
                    [class.border-emerald-300/60]="activeBektasIndex() === idx"
                    [class.shadow-sm]="activeBektasIndex() === idx"
                    [class.bg-white/5]="activeBektasIndex() !== idx"
                    [class.text-sky-200/80]="activeBektasIndex() !== idx"
                    [class.border-white/10]="activeBektasIndex() !== idx"
                  >
                    {{ item.tabLabel }}
                  </button>
                }
              </div>

              @let currentBektas = activeBektasTeaching();

              <blockquote class="p-4 rounded-2xl bg-[#071633]/90 border-l-3 border-emerald-400 space-y-2 shadow-inner">
                <div class="text-[11px] font-mono text-emerald-300/90 uppercase tracking-wider">
                  {{ currentBektas.badge }}
                </div>
                <p class="font-serif text-sm sm:text-base text-emerald-100 font-semibold leading-relaxed">
                  &ldquo;{{ currentBektas.quote }}&rdquo;
                </p>
                <footer class="text-[11px] text-sky-200/80 font-mono">
                  — {{ currentBektas.source }}
                </footer>
              </blockquote>

              <p class="text-xs sm:text-sm text-stone-200/95 leading-relaxed font-sans">
                {{ currentBektas.analysis }}
              </p>
            </div>
          </div>

          <!-- Card Footer Actions -->
          <div class="px-5 sm:px-6 py-3.5 border-t border-sky-300/20 bg-[#06132c]/70 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              (click)="listenBektas()"
              class="nav-pill-btn !h-9 !px-3.5 text-xs"
            >
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">volume_up</mat-icon>
              <span>Hikmeti Sesli Dinle</span>
            </button>

            <button
              type="button"
              (click)="filterKeyword.emit(activeBektasTeaching().searchKeyword)"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-cyan-200 transition-colors cursor-pointer"
            >
              <span>{{ activeBektasTeaching().searchKeyword }} İncelemeleri</span>
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">arrow_forward</mat-icon>
            </button>
          </div>
        </article>

      </div>

      <!-- Bottom Historical & Philosophical Synthesis Bridge -->
      <div class="rounded-2xl bg-[#06142e]/85 border border-sky-300/30 p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-300/40 flex items-center justify-center shrink-0 mt-0.5">
            <mat-icon class="!w-5 !h-5 !text-lg icon-luminous-amber">handshake</mat-icon>
          </div>
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2 text-xs font-serif font-bold text-amber-200">
              <span>Hacıbektaş’tan Cumhuriyet’e Fikrî Köprü (22–23 Aralık 1919)</span>
              <span aria-hidden="true" class="text-sky-400">·</span>
              <span class="text-cyan-300 font-mono text-[11px]">İlim, Akıl ve İnsan-ı Kâmil Sentezi</span>
            </div>
            <p class="text-xs text-stone-200/90 leading-relaxed font-sans">
              Gazi Mustafa Kemal Atatürk’ün Millî Mücadele’nin en kritik günlerinde Hacıbektaş Dergâhı’nı ziyaret ederek Anadolu erenleriyle kurduğu gönül ve ülkü birliği; Hünkâr’ın <em>“İlimden gidilmeyen yolun sonu karanlıktır”</em> hikmeti ile Cumhuriyet’in <em>“Hayatta en hakiki mürşit ilimdir, fendir”</em> ilkesini aynı aydınlanma ufkunda birleştirmiştir.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0 self-end lg:self-center">
          <a
            routerLink="/kaynaklar"
            class="nav-pill-btn !h-9 !px-3.5 text-xs"
          >
            <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">library_music</mat-icon>
            <span>Deyiş Kürsüsü &amp; Kaynaklar</span>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class AtaturkBektasHero {
  private readonly speechService = inject(SpeechService);

  readonly filterKeyword = output<string>();
  readonly ataturkImgError = signal<boolean>(false);
  readonly bektasImgError = signal<boolean>(false);

  readonly activeAtaturkIndex = signal<number>(0);
  readonly activeBektasIndex = signal<number>(0);

  readonly ataturkTeachings: PillarTeaching[] = [
    {
      id: 'ilim-fen',
      tabLabel: '1. İlim ve Fen Düsturu',
      badge: 'KÜTÜPHANE KEMERİ VECİZESİ · 22 EYLÜL 1924',
      quote:
        'Hayatta en hakiki mürşit ilimdir, fendir. İlim ve fenden başka yol gösterici aramak gaflettir, dalalettir, cehalettir.',
      source: 'Samsun İstiklâl Ticaret Mektebi Konuşması & Kütüphane Kemeri',
      analysis:
        'Atatürk’ün çalışma kütüphanesinin kemerine nakşedilen bu temel ilke ve masasında duran Nutuk; Türk düşüncesinin hurafelerden arınarak bilimsel yöntem, eleştirel akıl ve çağdaş felsefeyle yükselmesinin ebedî pusulasıdır.',
      searchKeyword: 'Cumhuriyet',
    },
    {
      id: 'nutuk-kultur',
      tabLabel: '2. Nutuk ve Kültür',
      badge: 'MİLLÎ HAFIZA VE TEFEKKÜR · EKİM 1927',
      quote:
        'Türkiye Cumhuriyeti’nin temeli kültürdür. Kültür; okumak, anlamak, görebilmek, görebildiğinden anlam çıkarmak, düşünmek ve zekâyı terbiye etmektir.',
      source: 'Nutuk Mirası & Kültür Üzerine Tefekkür Notları (1927–1936)',
      analysis:
        'Atatürk’ün masasında açık duran Nutuk, yalnızca bir bağımsızlık destanı değil; aynı zamanda genç kuşaklara bırakılmış analitik bir tarih felsefesi ve fikrî uyanış vesikasıdır.',
      searchKeyword: 'Felsefe',
    },
    {
      id: 'dil-irfan',
      tabLabel: '3. Türk Dili ve Hür İrfan',
      badge: 'DİL VE EDEBİYAT DEVRİMİ · 1924–1930',
      quote:
        'Türk dili, dillerin en zenginlerindendir; yeter ki bu dil şuurla işlensin. Cumhuriyet sizden fikri hür, vicdanı hür, irfanı hür nesiller ister.',
      source: 'Muallimler Birliği Kongresi & Dil Tetkik Cemiyeti Direktifleri',
      analysis:
        'Kavramların kendi ana dilimizde berraklaşmasını sağlayan Dil Devrimi, Anadolu’nun bin yıllık Türkçe irfan mirasını modern akademi ve felsefe diliyle buluşturmuştur.',
      searchKeyword: 'Türk Dili',
    },
  ];

  readonly bektasTeachings: PillarTeaching[] = [
    {
      id: 'aslan-ceylan',
      tabLabel: '1. Aslan ve Ceylan',
      badge: 'KUDRET İLE MASUMİYETİN BARIŞI · VELÂYETNÂME',
      quote:
        'İncinsen de incitme. Nefsine ağır geleni kimseye tatbik etme; hiçbir milleti ve insanı ayıplamayınız.',
      source: 'Hünkâr Hacı Bektâş-ı Velî Velâyetnâmesi & Anadolu İrfan Geleneği',
      analysis:
        'Hünkâr’ın kucağında yan yana duran Aslan (kudret ve celâl) ile Ceylan (masumiyet ve cemâl); kâmil insanın gönlünde zıtlıkların barışa kavuşmasını, güçlünün zayıfı incitmediği adalet nizamını simgeler.',
      searchKeyword: 'Makâlât',
    },
    {
      id: 'makalat-ilim',
      tabLabel: '2. Makâlât ve İlim',
      badge: 'AKIL VE HAKİKAT YOLU · MAKÂLÂT',
      quote:
        'İlimden gidilmeyen yolun sonu karanlıktır. Araştırma açık bir sınavdır; düşünce karanlığına ışık tutanlara ne mutlu.',
      source: 'Makâlât-ı Hacı Bektâş-ı Velî (Akıl ve Marifet Bâbı)',
      analysis:
        '13. yüzyıl Anadolu’sunda bilimi ve aklı hakikat yolculuğunun merkezine yerleştiren Hünkâr, dogmatik taklit yerine tahkiki (araştırarak öğrenmeyi) insan-ı kâmil olmanın ilk şartı saymıştır.',
      searchKeyword: 'Tasavvuf',
    },
    {
      id: 'dort-kapi',
      tabLabel: '3. Dört Kapı Kırk Makam',
      badge: 'AHLÂK VE EŞİTLİK NİZAMI · MARİFET KAPISI',
      quote:
        'Eline, beline, diline sahip ol. Kadınları okutunuz; ilim ve irfanda erkek ile kadın bir can, bir nurdur.',
      source: 'Makâlât — Dört Kapı Kırk Makam Öğretisi',
      analysis:
        'Şeriat, Tarikat, Marifet ve Hakikat kapılarından oluşan ahlâk felsefesi; insanı merkeze alan, kadın-erkek eşitliğini savunan ve emeği kutsal bilen Anadolu aydınlanmasının temelidir.',
      searchKeyword: 'Yunus Emre',
    },
  ];

  readonly activeAtaturkTeaching = computed(
    () => this.ataturkTeachings[this.activeAtaturkIndex()] || this.ataturkTeachings[0]
  );

  readonly activeBektasTeaching = computed(
    () => this.bektasTeachings[this.activeBektasIndex()] || this.bektasTeachings[0]
  );

  listenAtaturk(): void {
    const t = this.activeAtaturkTeaching();
    this.speechService.speak(
      `Gazi Mustafa Kemal Atatürk. ${t.tabLabel}. ${t.quote}. Kaynak: ${t.source}. Felsefi tahlil: ${t.analysis}`,
      `Atatürk — ${t.tabLabel}`
    );
  }

  listenBektas(): void {
    const t = this.activeBektasTeaching();
    this.speechService.speak(
      `Hünkâr Hacı Bektâş-ı Velî. ${t.tabLabel}. ${t.quote}. Kaynak: ${t.source}. Felsefi tahlil: ${t.analysis}`,
      `Hacı Bektâş-ı Velî — ${t.tabLabel}`
    );
  }

  listenSynthesisBridge(): void {
    this.speechService.speak(
      'Hacıbektaş’tan Cumhuriyet’e Fikrî Köprü. Gazi Mustafa Kemal Atatürk’ün 22 Aralık 1919’da Hacıbektaş Dergâhı’nı ziyaret ederek Anadolu erenleriyle kurduğu gönül ve ülkü birliği; Hünkâr Hacı Bektâş-ı Velî’nin İlimden gidilmeyen yolun sonu karanlıktır hikmeti ile Cumhuriyet’in Hayatta en hakiki mürşit ilimdir, fendir ilkesini aynı aydınlanma ufkunda birleştirmiştir.',
      'Atatürk ve Hacı Bektâş-ı Velî — İlim ve İrfan Sentezi'
    );
  }
}
