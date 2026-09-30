import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule, FormControl} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {LayoutService} from '../../../core/services/layout.service';
import {ArticleService} from '../../../core/services/article.service';
import {SpeechService} from '../../../core/services/speech.service';
import {UserCustomizationService} from '../../../core/services/user-customization.service';

export interface AiGuideRecommendation {
  id: string;
  title: string;
  discipline: string;
  reason: string;
}

export interface AiGuideResponseData {
  isOnTopic: boolean;
  summary: string;
  detailedAnswer: string;
  recommendedArticles: AiGuideRecommendation[];
  suggestedSearchQuery: string;
  suggestedRoute: string;
  suggestedRouteLabel: string;
}

@Component({
  selector: 'app-ai-guide-assistant',
  imports: [ReactiveFormsModule, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (customization.showFloatingAiButton() || layoutService.isAiGuideOpen()) {
      <!-- Floating Bottom-Left Lantern Trigger & Expandable Guide Panel -->
      <div class="fixed bottom-11 sm:bottom-12 left-3 sm:left-5 z-40 flex flex-col items-start">
        @if (layoutService.isAiGuideOpen()) {
          <section
            aria-label="YENİDEM İrfan Işığı — Külliyat ve Arama Rehberi"
            class="mb-2.5 w-[calc(100vw-1.5rem)] sm:w-[440px] max-h-[82vh] flex flex-col rounded-3xl bg-glass-blue border border-cyan-300/45 shadow-[0_24px_60px_rgba(2,8,23,0.95)] overflow-hidden reveal-up"
          >
            <!-- Top Header -->
            <div class="p-4 border-b border-sky-300/25 bg-[#051024]/95 flex items-center justify-between gap-3 shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-2xl bg-cyan-400/20 border border-cyan-300/50 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.35)] shrink-0">
                  <mat-icon class="!w-5 !h-5 !text-xl icon-luminous">lightbulb</mat-icon>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-xs sm:text-sm font-serif font-bold text-white">YENİDEM İrfan Işığı</h3>
                    <span class="text-[10px] font-mono font-bold text-emerald-300">
                      · 16 Eser &amp; ORXUN Hâkimi
                    </span>
                  </div>
                  <p class="text-[11px] text-sky-200/85 font-sans">
                    Site, Külliyat, Kuantum Blok Zinciri ve ORXUN Ödül Rehberi
                  </p>
                </div>
              </div>

              <button
                type="button"
                (click)="layoutService.isAiGuideOpen.set(false)"
                class="p-1.5 rounded-xl text-sky-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Rehberi Kapat"
              >
                <mat-icon class="!w-4 !h-4 !text-base">close</mat-icon>
              </button>
            </div>

            <!-- Mode Selector & Security Badge -->
            <div class="px-4 py-2 bg-[#06132c]/90 border-b border-sky-300/20 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div class="flex items-center gap-1.5 text-[11px] text-emerald-300 font-mono">
                <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-emerald">verified_user</mat-icon>
                <span>Site İçi Doğrulanmış Bilgi</span>
              </div>

              <div class="flex items-center gap-1 bg-[#040d1f] p-1 rounded-xl border border-sky-300/20">
                <button
                  type="button"
                  (click)="responseMode.set('concise')"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-serif font-bold transition-all cursor-pointer"
                  [class.bg-cyan-400/25]="responseMode() === 'concise'"
                  [class.text-cyan-200]="responseMode() === 'concise'"
                  [class.text-sky-200/70]="responseMode() !== 'concise'"
                >
                  Kısa Öz
                </button>
                <button
                  type="button"
                  (click)="responseMode.set('detailed')"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-serif font-bold transition-all cursor-pointer"
                  [class.bg-amber-400/25]="responseMode() === 'detailed'"
                  [class.text-amber-200]="responseMode() === 'detailed'"
                  [class.text-sky-200/70]="responseMode() !== 'detailed'"
                >
                  Detaylı Şerh
                </button>
              </div>
            </div>

            <!-- Scrollable Content Area -->
            <div class="p-4 overflow-y-auto custom-scrollbar space-y-3.5 flex-1">
              <!-- Quick Guide Chips -->
              <div class="space-y-1.5">
                <span class="text-[10px] font-mono uppercase tracking-wider text-sky-300/85 block">
                  Hızlı Keşif &amp; Külliyat Soruları:
                </span>
                <div class="flex flex-wrap gap-1.5">
                  @for (chip of quickPrompts; track chip.label) {
                    <button
                      type="button"
                      (click)="askPrebuiltPrompt(chip)"
                      class="px-2.5 py-1 rounded-xl bg-[#071838]/90 hover:bg-sky-400/25 border border-sky-300/30 text-[11px] text-sky-100 hover:text-white transition-all cursor-pointer"
                    >
                      {{ chip.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Loading State -->
              @if (isLoading()) {
                <div class="p-5 rounded-2xl bg-[#071633]/90 border border-cyan-300/30 text-center space-y-2.5">
                  <mat-icon class="!w-6 !h-6 !text-xl icon-luminous animate-spin mx-auto">autorenew</mat-icon>
                  <p class="text-xs font-serif text-cyan-200">
                    İrfan Işığı 16 eseri ve blok zinciri mimarisini tarıyor...
                  </p>
                </div>
              }

              <!-- Active Response Card -->
              @if (!isLoading() && guideResult(); as res) {
                <div class="space-y-3">
                  <!-- Executive Summary Box -->
                  <div class="p-3.5 rounded-2xl bg-[#071633]/95 border-l-3 border-cyan-400 space-y-2 shadow-inner">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                        İRFAN IŞIĞI ÖZET REHBERİ
                      </span>
                      <button
                        type="button"
                        (click)="toggleSpeechForGuide(res)"
                        class="inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer px-2 py-0.5 rounded-lg"
                        [class.bg-rose-500/25]="speechService.isSpeaking()"
                        [class.text-rose-200]="speechService.isSpeaking()"
                        [class.text-amber-300]="!speechService.isSpeaking()"
                        [class.hover:text-amber-200]="!speechService.isSpeaking()"
                        title="Rehber yanıtını sesli dinle veya durdur"
                      >
                        <mat-icon class="!w-3.5 !h-3.5 !text-xs">
                          {{ speechService.isSpeaking() ? 'stop_circle' : 'volume_up' }}
                        </mat-icon>
                        <span>{{ speechService.isSpeaking() ? 'Sesi Durdur' : 'Sesli Dinle' }}</span>
                      </button>
                    </div>
                    <p class="text-xs sm:text-sm font-serif text-white leading-relaxed font-medium">
                      {{ res.summary }}
                    </p>
                  </div>

                  <!-- Detailed Answer (Shown when Detailed Mode or toggled) -->
                  @if (responseMode() === 'detailed' || showFullDetail()) {
                    <div class="p-3.5 rounded-2xl bg-[#06132c]/90 border border-sky-300/25 space-y-2">
                      <div class="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                        DETAYLI KÜLLİYAT ŞERHİ
                      </div>
                      <p class="text-xs text-stone-200 leading-relaxed whitespace-pre-line font-sans">
                        {{ res.detailedAnswer }}
                      </p>
                    </div>
                  } @else {
                    <button
                      type="button"
                      (click)="showFullDetail.set(true)"
                      class="text-[11px] text-cyan-300 hover:text-amber-300 font-serif font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <mat-icon class="!w-3.5 !h-3.5 !text-xs">expand_more</mat-icon>
                      <span>Detaylı Külliyat Açıklamasını Göster</span>
                    </button>
                  }

                  <!-- Recommended Articles from the Site -->
                  @if (res.recommendedArticles && res.recommendedArticles.length > 0) {
                    <div class="space-y-1.5">
                      <span class="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
                        İlgili Külliyat Makaleleri:
                      </span>
                      @for (art of res.recommendedArticles; track art.id) {
                        <a
                          [routerLink]="['/makale', art.id]"
                          (click)="layoutService.isAiGuideOpen.set(false)"
                          class="block p-2.5 rounded-2xl bg-[#071838]/90 hover:bg-sky-400/20 border border-sky-300/30 transition-all group"
                        >
                          <div class="flex items-center justify-between gap-2">
                            <span class="text-[10px] font-mono text-amber-300 uppercase font-bold">{{ art.discipline }}</span>
                            <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous group-hover:translate-x-0.5 transition-transform">arrow_forward</mat-icon>
                          </div>
                          <h4 class="text-xs font-serif font-bold text-white group-hover:text-cyan-200 mt-0.5">
                            {{ art.title }}
                          </h4>
                          <p class="text-[11px] text-sky-200/85 line-clamp-2 mt-0.5">
                            {{ art.reason }}
                          </p>
                        </a>
                      }
                    </div>
                  }

                  <!-- One-Click Archive Filter & Route Shortcuts -->
                  <div class="pt-2 border-t border-sky-300/20 flex flex-wrap items-center justify-between gap-2">
                    @if (res.suggestedSearchQuery) {
                      <button
                        type="button"
                        (click)="applyArchiveSearch(res.suggestedSearchQuery)"
                        class="nav-pill-btn !h-8 !px-3 text-[11px]"
                      >
                        <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous">search</mat-icon>
                        <span>Külliyatta Ara: "{{ res.suggestedSearchQuery }}"</span>
                      </button>
                    }

                    @if (res.suggestedRoute) {
                      <a
                        [routerLink]="res.suggestedRoute"
                        (click)="layoutService.isAiGuideOpen.set(false)"
                        class="nav-pill-btn !h-8 !px-3 text-[11px]"
                      >
                        <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">open_in_new</mat-icon>
                        <span>{{ res.suggestedRouteLabel || 'İlgili Bölüm' }}</span>
                      </a>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Search & Question Input Footer -->
            <form
              (submit)="onSubmitQuestion($event)"
              class="p-3 bg-[#051024]/95 border-t border-sky-300/25 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                [formControl]="questionControl"
                placeholder="Makale, ORXUN token, ozan veya özellik sorun..."
                class="flex-1 bg-[#081b3d] border border-sky-300/35 rounded-2xl px-3.5 py-2 text-xs text-white placeholder:text-sky-200/60 focus:outline-hidden focus:border-cyan-300"
              />
              <button
                type="submit"
                [disabled]="isLoading()"
                class="luxury-btn-primary !h-9 !px-4 text-xs shrink-0"
              >
                <mat-icon class="!w-4 !h-4 !text-sm">send</mat-icon>
                <span>Sor</span>
              </button>
            </form>
          </section>
        }

        <!-- Minimized Floating Lantern Button -->
        <button
          type="button"
          (click)="layoutService.toggleAiGuide()"
          class="h-10 sm:h-11 px-3.5 sm:px-4 rounded-2xl flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-2xl border btn-toggle-luminous text-white"
          title="YENİDEM İrfan Işığı — Yapay Zekâ Külliyat & Arama Rehberi"
        >
          <mat-icon class="!w-4 sm:!w-5 !h-4 sm:!h-5 !text-lg sm:!text-xl icon-luminous">lightbulb</mat-icon>
          <span class="text-xs font-serif font-bold">
            {{ layoutService.isAiGuideOpen() ? 'Rehberi Kapat' : 'İrfan Işığı · AI' }}
          </span>
        </button>
      </div>
    }
  `,
})
export class AiGuideAssistantComponent {
  readonly layoutService = inject(LayoutService);
  readonly speechService = inject(SpeechService);
  readonly customization = inject(UserCustomizationService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly articleService = inject(ArticleService);

  readonly questionControl = new FormControl('', {nonNullable: true});
  readonly responseMode = signal<'concise' | 'detailed'>('concise');
  readonly isLoading = signal<boolean>(false);
  readonly showFullDetail = signal<boolean>(false);

  readonly guideResult = signal<AiGuideResponseData | null>({
    isOnTopic: true,
    summary:
      'Hoş geldiniz! Ben YENİDEM İrfan Işığı. Gazi Mustafa Kemal Atatürk’ün ilim vizyonu, Hünkâr Hacı Bektâş-ı Velî ve 7 Ulu Ozan, 16 mühürlü akademik eser, ORXUN ödül token ekonomisi ve Kuantum Blok Zinciri (%96 Konsensüs) hakkında size anında rehberlik etmeye hazırım.',
    detailedAnswer:
      'Yukarıdaki hızlı soru başlıklarından birine tıklayabilir veya istediğiniz kavramı (ör. Makâlât, Wittgenstein, Su Kasidesi, ORXUN Token, %96 Konsensüs, Dede Korkut, Sarı Saltuk) aşağıya yazarak hem özet hem doğrudan makale bağlantısı alabilirsiniz.',
    recommendedArticles: [
      {
        id: 'art-13',
        title: 'Hacı Bektâş-ı Velî ve Makâlât: Dört Kapı Kırk Makamın Ahlakî ve Ontolojik Mimarisi',
        discipline: 'KESİŞİM',
        reason: 'Anadolu irfanının temel eseri Makâlât ve Dört Kapı Kırk Makam öğretisini felsefi açıdan inceler.',
      },
      {
        id: 'art-1',
        title: "Türk Şiirinde Varlık ve Yokluk Diyalektiği: Tasavvufî Poetikadan Ahmet Haşim'e Semantik Açılımlar",
        discipline: 'TDE',
        reason: 'Klasik ve modern Türk şiirinde varlık-yokluk ontolojisini karşılaştırır.',
      },
    ],
    suggestedSearchQuery: 'Hacı Bektâş',
    suggestedRoute: '/topluluk-onayi',
    suggestedRouteLabel: '%96 Konsensüs & Kuantum Mühür',
  });

  readonly quickPrompts: {
    label: string;
    prompt: string;
    instantData: AiGuideResponseData;
  }[] = [
    {
      label: '16 Eserlik Külliyat',
      prompt: 'Sitedeki 16 makaleyi ve ana disiplinleri kısaca özetler misin?',
      instantData: {
        isOnTopic: true,
        summary:
          'YENİDEM Külliyatı; Türk Dili ve Edebiyatı (5 eser), Felsefe (4 eser) ve Disiplinlerarası İrfan Kesişimi (7 eser) olmak üzere toplam 16 SHA3-512 & BLAKE2b-512 mühürlü akademik makaleden oluşur.',
        detailedAnswer:
          '• Türk Dili ve Edebiyatı (TDE): Varlık-Yokluk Diyalektiği, Divan Mazmunları, Fuzûlî Su Kasidesi, Dede Korkut Tahkiyesi, Bâkî Kanûnî Mersiyesi.\n• Felsefe: Wittgenstein Dil Oyunları, Kant Saf Aklın Eleştirisi, Platon-Gettier Bilgi Kuramı, Aristoteles Organon & Kıyas.\n• İrfan Kesişimi & Kalemimden: Hacı Bektâş-ı Velî Makâlât, Yunus Emre, Pîr Sultan Abdal, Sarı Saltuk, Tanpınar-Bergson Zaman Ontolojisi, Şeyh Gâlib Hüsn ü Aşk ve Paul Ricoeur Metin Hermeneutiği.',
        recommendedArticles: [
          {
            id: 'art-1',
            title: "Türk Şiirinde Varlık ve Yokluk Diyalektiği: Tasavvufî Poetikadan Ahmet Haşim'e Semantik Açılımlar",
            discipline: 'TDE',
            reason: 'Külliyatın açılış eseri; tasavvufi yokluk (adem) ile modern şiiri mukayese eder.',
          },
          {
            id: 'art-2',
            title: "Wittgenstein'ın Dil Oyunları ve Göstergebilimsel Sessizlik: Anlamın Sınırlarında Bir Gezinti",
            discipline: 'FELSEFE',
            reason: 'Tractatus ve Felsefi Soruşturmalar ekseninde dil ve sessizlik ontolojisi.',
          },
          {
            id: 'art-13',
            title: 'Hacı Bektâş-ı Velî ve Makâlât: Dört Kapı Kırk Makamın Ahlakî ve Ontolojik Mimarisi',
            discipline: 'KESİŞİM',
            reason: 'Dört Kapı Kırk Makam öğretisinin epistemolojik ve ahlaki tahlili.',
          },
        ],
        suggestedSearchQuery: 'Makâlât',
        suggestedRoute: '/sayilar',
        suggestedRouteLabel: 'Mecmua Sayıları & Ciltler',
      },
    },
    {
      label: 'ORXUN Token & Ödül',
      prompt: 'ORXUN ödül token sistemi, ilk üyelik hediyesi ve yazar/çizer ödülleri nasıl çalışıyor?',
      instantData: {
        isOnTopic: true,
        summary:
          'ORXUN Token; YENİDEM ekosistemine değer katan okur, yazar, çizer ve topluluk hakemlerini ödüllendiren Rust zinciri uyumlu kültür ve irfan jetonudur. İlk üyelikte her kullanıcıya simüle olarak 1.00 ORXUN hediye edilir.',
        detailedAnswer:
          '• İlk Üyelik Hediyesi: Sisteme giriş yapan her üyeye anında +1.00 ORXUN hoş geldin jetonu tanımlanır.\n• Yazar Ödülü (+5.00 ORXUN): %85 Ön Onay ve %96 Konsensüs havuzuna özgün makale sunan araştırmacılara verilir.\n• Çizer & Tasarım Ödülü (+3.50 ORXUN): <250KB standartlarına uygun özgün kapak illüstrasyonu veya hat eseri üreten çizerlere tanımlanır.\n• Topluluk Denetçisi (+0.50 ORXUN) & Şerhçi (+1.00 ORXUN): Oylama ve beyit şerhi katkısı sunan üyelere verilir.',
        recommendedArticles: [
          {
            id: 'art-13',
            title: 'Hacı Bektâş-ı Velî ve Makâlât: Dört Kapı Kırk Makamın Ahlakî ve Ontolojik Mimarisi',
            discipline: 'KESİŞİM',
            reason: 'İrfan ve emek paylaşımının ahlaki temellerini inceler.',
          },
        ],
        suggestedSearchQuery: 'İrfan',
        suggestedRoute: '/topluluk-onayi',
        suggestedRouteLabel: '%96 Konsensüs & Ödül Havuzu',
      },
    },
    {
      label: 'Atatürk & Hacı Bektaş',
      prompt: 'Sitedeki Atatürk ve Hacı Bektaş-ı Veli başköşesinin felsefi sentezini anlatır mısın?',
      instantData: {
        isOnTopic: true,
        summary:
          'YENİDEM Başköşesi; Gazi Mustafa Kemal Atatürk’ün "Hayatta en hakiki mürşit ilimdir, fendir" rasyonalizmi ile Hünkâr Hacı Bektâş-ı Velî’nin "İlimden gidilmeyen yolun sonu karanlıktır" irfanını tek bir medeniyet ufkunda buluşturur.',
        detailedAnswer:
          'Cumhuriyetin özgür fikri ve pozitif bilim metodolojisi ile 13. yüzyıl Anadolu aydınlanmasının (Hacı Bektaş, Yunus Emre, Yedi Ulu Ozan) insan-ı kâmil ahlakı birbirinin tamamlayıcısıdır. Aslan ile ceylanın aynı kucakta barış içinde duruşu, bilimin gücü ile vicdanın merhametini simgeler.',
        recommendedArticles: [
          {
            id: 'art-13',
            title: 'Hacı Bektâş-ı Velî ve Makâlât: Dört Kapı Kırk Makamın Ahlakî ve Ontolojik Mimarisi',
            discipline: 'KESİŞİM',
            reason: 'Hünkâr Hacı Bektâş-ı Velî’nin ilim ve ahlak felsefesini merkeze alır.',
          },
          {
            id: 'art-14',
            title: 'Yunus Emre Risâletü’n-Nushiyye ve Divân’da Varlık Birliği: “Bir Ben Vardır Bende Benden İçeri”',
            discipline: 'KESİŞİM',
            reason: 'Anadolu Türkçesinin felsefi derinliğini ve içsel benlik ontolojisini şerh eder.',
          },
        ],
        suggestedSearchQuery: 'Yunus Emre',
        suggestedRoute: '/erenler-ve-makamlar',
        suggestedRouteLabel: 'Erenler Atlası & 4 Kapı 40 Makam',
      },
    },
    {
      label: '%96 Kuantum Blok Zinciri',
      prompt: 'Kuantum dirençli üçlü hash (SHA3-512 + BLAKE2b) ve %96 blok zinciri onayı nasıl işliyor?',
      instantData: {
        isOnTopic: true,
        summary:
          'Kurucu yazarın 16 eseri Katman-0 Genesis Zırhı ile kilitlidir. Topluluktan gelen aday eserler önce SHA3-512 + BLAKE2b-512 ile Katman-1 WORM Emanet Zincirinde sertifikalanır, 1.000.000 üye barajı ve %85 ön onaydan sonra %96 konsensüsle Rust ana zincirine mühürlenir.',
        detailedAnswer:
          '• Katman-0: Orçun KUNDAKCI’nın 16 kurucu eseri değiştirilemez Genesis mührü taşır.\n• Katman-1 (WORM Ön-Sertifika): Gönderilen her aday makale oylama bitmeden önce dahi çalınmaya ve değiştirilmeye karşı kuantum-dirençli üçlü özetle (SHA3-512 + BLAKE2b-512 + SLH-DSA) zaman damgalı sertifika alır.\n• Katman-2 & 3: 4 kademeli Tel/Mail/Cihaz KYC doğrulaması, %85 Ön Onay ve %96 Ana Blok Zinciri Konsensüsü.',
        recommendedArticles: [
          {
            id: 'art-3',
            title: 'Edebî Metnin Hermeneutiği: Paul Ricoeur ve Metin Şerhi Geleneğinin Kesişim Noktaları',
            discipline: 'KESİŞİM',
            reason: 'Metnin sahihliği, açıklanması ve yorumlanması arasındaki metodolojik bağı kurar.',
          },
        ],
        suggestedSearchQuery: 'Hermeneutik',
        suggestedRoute: '/topluluk-onayi',
        suggestedRouteLabel: '%96 Konsensüs & Rust Köprüsü',
      },
    },
    {
      label: 'Deyiş & Bağlama Çalar',
      prompt: 'Sitede telifsiz bağlama, deyiş dinletisi ve tam ekran göz konforlu okuma nasıl çalışıyor?',
      instantData: {
        isOnTopic: true,
        summary:
          'Sağ alttaki "Deyiş & Bağlama" kürsüsü, Web Audio API ile %100 telifsiz Hüseynî bağlama, Horasan kopuzu ve ney tınılarını gerçek zamanlı sentezler; sözlü deyişleri ve makaleleri canlı altyazı (teleprompter) eşliğinde seslendirir.',
        detailedAnswer:
          'Ayrıca her makalede yer alan "Tam Ekran Göz Konforlu Oku" butonu ile Sıcak Parşömen, E-Mürekkep, Gece Safir ve Tam Siyah OLED modlarında, mavi ışık (kehribar) filtresiyle göz yormadan okuma yapabilirsiniz.',
        recommendedArticles: [
          {
            id: 'art-15',
            title: 'Pîr Sultan Abdal Deyişlerinde Yol, İkrar ve Direniş Estetiği: Toplumsal Hafızanın Poetikası',
            discipline: 'KESİŞİM',
            reason: 'Deyiş ve nefes geleneğinin estetik ve felsefi arka planını inceler.',
          },
        ],
        suggestedSearchQuery: 'Pîr Sultan',
        suggestedRoute: '/kaynaklar',
        suggestedRouteLabel: 'Kaynaklar & Deyiş Kürsüsü',
      },
    },
  ];

  askPrebuiltPrompt(chip: {label: string; prompt: string; instantData: AiGuideResponseData}): void {
    this.questionControl.setValue(chip.prompt);
    this.showFullDetail.set(this.responseMode() === 'detailed');
    // Provide immediate deterministic response with zero lag, while also allowing custom queries
    this.guideResult.set(chip.instantData);
  }

  onSubmitQuestion(event: Event): void {
    event.preventDefault();
    const q = this.questionControl.value.trim();
    if (!q) return;
    this.executeQuery(q);
  }

  private executeQuery(question: string): void {
    this.isLoading.set(true);
    this.showFullDetail.set(this.responseMode() === 'detailed');

    this.http
      .post<{success: boolean; data: AiGuideResponseData}>('/api/ai/guide', {
        question,
        mode: this.responseMode(),
      })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res?.success && res.data) {
            this.guideResult.set(res.data);
          }
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  applyArchiveSearch(query: string): void {
    this.articleService.setSearchQuery(query);
    this.layoutService.isAiGuideOpen.set(false);
    this.router.navigate(['/'], {queryParams: {q: query}});
  }

  toggleSpeechForGuide(res: AiGuideResponseData): void {
    if (this.speechService.isSpeaking()) {
      this.speechService.stop();
      return;
    }
    const textToRead =
      this.responseMode() === 'detailed' || this.showFullDetail()
        ? `${res.summary}. ${res.detailedAnswer}`
        : res.summary;
    this.speechService.speak(textToRead, 'YENİDEM İrfan Işığı Rehberi');
  }
}
