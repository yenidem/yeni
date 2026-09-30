import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

interface PoemPreset {
  id: string;
  poet: string;
  period: string;
  type: 'aruz' | 'hece';
  kalipName: string;
  kalipPattern: string; // e.g. "- . - - / - . - - / - . - - / - . -"
  firstLine: string;
  secondLine: string;
  kafiye: string;
  kafiyeTuru: string;
  redif: string;
  serh: string;
}

interface SyllableAnalysis {
  syllable: string;
  isOpen: boolean; // true = '.', false = '-'
  symbol: string;  // '.' or '-'
}

const PRESETS: PoemPreset[] = [
  {
    id: 'fuzuli-can',
    poet: 'Fuzûlî',
    period: '16. Yüzyıl Klasik Divan Edebiyatı',
    type: 'aruz',
    kalipName: 'Mef’ûlü Mefâ’îlü Mefâ’îlü Fe’ûlün',
    kalipPattern: '- - . / . - - . / . - - . / . - -',
    firstLine: 'Beni candan usandırdı cefâdan yâr usanmaz mı',
    secondLine: 'Felekler yandı âhımdan murâdım şem’i yanmaz mı',
    kafiye: '-an (Tam Kafiye)',
    kafiyeTuru: 'Tam Kafiye',
    redif: '-maz mı',
    serh: 'Fuzûlî’nin aşk ızdırabını varoluşun şahikası kıldığı şaheser gazelidir. Sevgilinin cefası aşığa can verir; âhı felekleri tutuştururken murat mumu hala yanmamıştır. Aşk burada dünyevi bir heves değil, ontolojik bir tezkiye ve Hakk’a yöneliştir.',
  },
  {
    id: 'seyh-galib-zat',
    poet: 'Şeyh Gâlib',
    period: '18. Yüzyıl Sebk-i Hindî Divan Şiiri',
    type: 'aruz',
    kalipName: 'Mef’ûlü Mefâ’îlün Mef’ûlü Mefâ’îlün',
    kalipPattern: '- - . / . - - - / - - . / . - - -',
    firstLine: 'Hoşça bak zâtına kim zübde-i âlemsin sen',
    secondLine: 'Merdüm-i dîde-i ekvân olan âdemsin sen',
    kafiye: '-em (Tam Kafiye)',
    kafiyeTuru: 'Tam Kafiye',
    redif: '-sin sen',
    serh: 'İnsan-ı kâmil metafiziğinin zirve beytidir. İnsanın salt biyolojik bir varlık değil, kâinatın özü (zübde-i âlem) ve varoluşun gözbebeği (merdüm-i dîde-i ekvân) olduğu hatırlatılır. Kendine hürmet etmesi, ilahi emanetin bilincinde olması tembihlenir.',
  },
  {
    id: 'baki-avaze',
    poet: 'Bâkî',
    period: '16. Yüzyıl Klasik Dönem (Sultanü’ş-Şuarâ)',
    type: 'aruz',
    kalipName: 'Fâ’ilâtün Fâ’ilâtün Fâ’ilâtün Fâ’ilün',
    kalipPattern: '- . - - / - . - - / - . - - / - . -',
    firstLine: 'Âvâzeyi bu âleme Dâvûd gibi sal',
    secondLine: 'Bâkî kalan bu kubbede bir hoş sadâ imiş',
    kafiye: '-â (Uzatmalı Tam/Zengin)',
    kafiyeTuru: 'Zengin Kafiye',
    redif: '-imiş (varsayımsal sonlama)',
    serh: 'Fanilik karşısında sanatın ve güzel seda bırakmanın zaferi. Gök kubbe altında her şey silinip giderken geriye ancak Dâvûd gibi yankılanan asil bir seda kalacaktır.',
  },
  {
    id: 'yunus-ilim',
    poet: 'Yunus Emre',
    period: '13. Yüzyıl Tasavvufi Türk Halk Şiiri',
    type: 'hece',
    kalipName: '8’li Hece Ölçüsü (4+4 Duraklı)',
    kalipPattern: '4 + 4 = 8 Hece',
    firstLine: 'İlim ilim bilmektir / İlim kendin bilmektir',
    secondLine: 'Sen kendini bilmezsin / Ya nice okumaktır',
    kafiye: '-mek / -mak (Yarım/Tam Kafiye)',
    kafiyeTuru: 'Yarım Kafiye',
    redif: '-tir',
    serh: 'Sokratik "kendini bil" öğretisinin Anadolu irfanındaki derin billurlaşması. Marifetullah olmaksızın yığılan malumatın hamallık olduğunu, hakiki ilmin nefsi bilmekten geçtiğini haykırır.',
  },
  {
    id: 'karacaoglan-elif',
    poet: 'Karacaoğlan',
    period: '17. Yüzyıl Âşık Edebiyatı',
    type: 'hece',
    kalipName: '11’li Hece Ölçüsü (6+5 veya 4+4+3 Duraklı)',
    kalipPattern: '6 + 5 = 11 Hece',
    firstLine: 'İncecikten bir kar yağar / Tozar Elif Elif diye',
    secondLine: 'Deli gönül abdal olmuş / Gezer Elif Elif diye',
    kafiye: '-ar / -er (Yarım Kafiye)',
    kafiyeTuru: 'Yarım Kafiye',
    redif: 'Elif Elif diye',
    serh: 'Halk şiirinde doğa ile aşkın iç içe geçtiği lirik doruk. Yağan karın tozuşunda dahi sevgilinin ismini heceleyen bir gönül abdalı.',
  },
  {
    id: 'yahya-kemal-sessiz-gemi',
    poet: 'Yahya Kemal Beyatlı',
    period: '20. Yüzyıl Neo-Klasik Türk Şiiri',
    type: 'aruz',
    kalipName: 'Mef’ûlü Mefâ’îlü Mefâ’îlü Fe’ûlün',
    kalipPattern: '- - . / . - - . / . - - . / . - -',
    firstLine: 'Artık demir almak günü gelmişse zamandan',
    secondLine: 'Meçhule giden bir gemi kalkar bu limandan',
    kafiye: '-an (Tam Kafiye)',
    kafiyeTuru: 'Tam Kafiye',
    redif: '-dan',
    serh: 'Ölümü bir trajedi değil, vakur ve ebedi bir seyahat olarak resmeden neoklasik şaheser. Aruz vezninin Türkçe ile kusursuz kaynaşmasının zirvesidir.',
  },
  {
    id: 'ahmet-hasim-merdiven',
    poet: 'Ahmet Haşim',
    period: 'Fecr-i Âtî & Türk Sembolizmi',
    type: 'aruz',
    kalipName: 'Fâ’ilâtün Fâ’ilâtün Fâ’ilâtün Fâ’ilün',
    kalipPattern: '- . - - / - . - - / - . - - / - . -',
    firstLine: 'Ağır ağır çıkacaksın bu merdivenlerden',
    secondLine: 'Eteklerinde güneş rengi bir yığın yaprak',
    kafiye: '-rak (Tam/Zengin Kafiye)',
    kafiyeTuru: 'Serbest Müstezad Örgüsü',
    redif: 'Yok',
    serh: 'Ömrün sonbaharını ve varoluşsal hüznü renklerin musıkisiyle anlatan sembolist manifesto. Şiirde anlam değil, kelimelerin ses ve rengi öne çıkar.',
  },
  {
    id: 'asik-veysel-uzun-ince',
    poet: 'Âşık Veysel',
    period: '20. Yüzyıl Çağdaş Âşık Edebiyatı',
    type: 'hece',
    kalipName: '8’li Hece Ölçüsü (4+4 Duraklı)',
    kalipPattern: '4 + 4 = 8 Hece',
    firstLine: 'Uzun ince bir yoldayım / Gidiyorum gündüz gece',
    secondLine: 'Bilmiyorum ne haldeyim / Gidiyorum gündüz gece',
    kafiye: '-ol / -hal (Tam Kafiye)',
    kafiyeTuru: 'Tam Kafiye',
    redif: '-dayım / Gidiyorum gündüz gece',
    serh: 'Doğum ile ölüm arasındaki iki kapılı han metaforu. İnsan ömrünün telaşsız ama durmaksızın akan seyr-ü seferini en yalın Türkçeyle felsefeye dönüştürür.',
  },
  {
    id: 'cahit-sitki-otuz-bes-yas',
    poet: 'Cahit Sıtkı Tarancı',
    period: 'Cumhuriyet Dönemi Saf (Öz) Şiir',
    type: 'hece',
    kalipName: '11’li Hece Ölçüsü (4+4+3 veya 6+5 Duraklı)',
    kalipPattern: '4 + 4 + 3 = 11 Hece',
    firstLine: 'Yaş otuz beş yolun yarısı eder',
    secondLine: 'Dante gibi ortasındayız ömrün',
    kafiye: '-er (Yarım Kafiye)',
    kafiyeTuru: 'Yarım Kafiye',
    redif: 'Yok',
    serh: 'İtalyan şairi Dante’nin İlahi Komedya’sındaki "yaşam yolumuzun ortasında" dizesine telmih yapan, ölüm ve zaman endişesini derinleştiren modern başyapıt.',
  },
];

@Component({
  selector: 'app-poetics-lab',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      <!-- Poetics Lab Hero Banner -->
      <header class="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0e1628] via-[#09101d] to-[#05070e] border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div class="max-w-3xl space-y-3 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <mat-icon class="!w-4 !h-4 !text-base text-amber-400">music_note</mat-icon>
            <span>Aruz & Hece Ölçüsü & Poetik Tahlil</span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Şiir Tahlil & <span class="text-amber-400">Vezin Laboratuvarı</span>
          </h1>

          <p class="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Klasik Türk Edebiyatı (Divan) ve Tasavvuf/Halk şiirinin ahenk matematiğini keşfedin. Açık-kapalı hece sürelerini tarayın, Aruz kalıplarını karşılaştırın, kafiye-redif şemalarını ve felsefi şerhlerini inceleyin.
          </p>
        </div>
      </header>

      <!-- Preset Selector Ribbon -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-serif font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <mat-icon class="!w-4 !h-4 !text-base">auto_stories</mat-icon>
            <span>Klasik Şaheserlerden Bir Beyit Seçin:</span>
          </h2>
          <span class="text-[11px] text-stone-300 font-mono">veya aşağıda kendi beytinizi girin</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          @for (preset of presets; track preset.id) {
            <button
              type="button"
              (click)="selectPreset(preset)"
              class="text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between"
              [class.bg-amber-500/15]="activePreset()?.id === preset.id"
              [class.border-amber-400]="activePreset()?.id === preset.id"
              [class.text-white]="activePreset()?.id === preset.id"
              [class.bg-[#0a0f1d]]="activePreset()?.id !== preset.id"
              [class.border-white/10]="activePreset()?.id !== preset.id"
              [class.text-stone-300]="activePreset()?.id !== preset.id"
              [class.hover:border-amber-500/40]="activePreset()?.id !== preset.id"
            >
              <div>
                <div class="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-1">
                  <span class="font-bold">{{ preset.poet }}</span>
                  <span class="text-stone-300 uppercase">{{ preset.type }}</span>
                </div>
                <p class="font-serif italic text-xs leading-snug line-clamp-2">
                  "{{ preset.firstLine }}"
                </p>
              </div>

              <div class="mt-2 pt-2 border-t border-white/5 text-[10px] text-stone-300 font-mono truncate">
                {{ preset.kalipName }}
              </div>
            </button>
          }
        </div>
      </div>

      <!-- Interactive Input Area -->
      <div class="p-6 sm:p-8 rounded-3xl bg-[#090e1c] border border-white/10 shadow-xl space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
          <h3 class="text-base font-serif font-bold text-white flex items-center gap-2">
            <mat-icon class="!w-5 !h-5 !text-xl text-amber-400">edit</mat-icon>
            <span>İncelenen Şiir / Beyit</span>
          </h3>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="clearLines()"
              class="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            >
              Temizle
            </button>
          </div>
        </div>

        <!-- Two input lines -->
        <div class="space-y-4">
          <div>
            <label for="first-line-input" class="block text-xs font-mono text-stone-300 mb-1.5">1. Mısra (Mısra-ı Evvel):</label>
            <input
              id="first-line-input"
              type="text"
              [value]="line1()"
              (input)="updateLine1($event)"
              placeholder="İlk mısrayı yazınız..."
              class="w-full px-4 py-3 rounded-xl bg-[#0c1424] border border-white/10 text-stone-100 font-serif text-base focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
            />
          </div>

          <div>
            <label for="second-line-input" class="block text-xs font-mono text-stone-300 mb-1.5">2. Mısra (Mısra-ı Sâni):</label>
            <input
              id="second-line-input"
              type="text"
              [value]="line2()"
              (input)="updateLine2($event)"
              placeholder="İkinci mısrayı yazınız..."
              class="w-full px-4 py-3 rounded-xl bg-[#0c1424] border border-white/10 text-stone-100 font-serif text-base focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
            />
          </div>
        </div>

        <!-- Real-Time Syllable & Rhythm Scanning Board -->
        <div class="space-y-6 pt-4 border-t border-white/5">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <mat-icon class="!w-4 !h-4 !text-base">view_week</mat-icon>
              <span>Aruz / Hece Tarama Şeması (Ritim & Vuruşlar)</span>
            </h4>
            <div class="flex items-center gap-3 text-xs font-mono text-stone-300">
              <span class="flex items-center gap-1">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span>Açık (.) Kısa</span>
              </span>
              <span class="flex items-center gap-1">
                <span class="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block"></span>
                <span>Kapalı (-) Uzun</span>
              </span>
            </div>
          </div>

          <!-- Line 1 Breakdown -->
          <div class="p-4 rounded-2xl bg-[#060a14] border border-white/5 space-y-3">
            <div class="flex items-center justify-between text-xs font-mono text-stone-300 border-b border-white/5 pb-1">
              <span>1. Mısra: <strong class="text-white">{{ line1() }}</strong></span>
              <span class="text-amber-300">{{ line1Analysis().length }} Hece</span>
            </div>

            <div class="flex flex-wrap items-center gap-1.5 pt-1">
              @for (item of line1Analysis(); track $index) {
                <div class="flex flex-col items-center p-1.5 rounded-lg bg-[#0e172a] border border-white/5 min-w-[34px]">
                  <span class="text-xs font-serif text-stone-200">{{ item.syllable }}</span>
                  <span
                    class="text-xs font-mono font-bold mt-1 px-1.5 py-0.2 rounded"
                    [class.text-amber-300]="item.isOpen"
                    [class.bg-amber-500/20]="item.isOpen"
                    [class.text-cyan-300]="!item.isOpen"
                    [class.bg-cyan-500/20]="!item.isOpen"
                  >
                    {{ item.symbol }}
                  </span>
                </div>
              }
            </div>

            <div class="text-[11px] font-mono text-stone-300 tracking-widest pt-1">
              Metre Kodu: <span class="text-amber-300">{{ line1Pattern() }}</span>
            </div>
          </div>

          <!-- Line 2 Breakdown -->
          <div class="p-4 rounded-2xl bg-[#060a14] border border-white/5 space-y-3">
            <div class="flex items-center justify-between text-xs font-mono text-stone-300 border-b border-white/5 pb-1">
              <span>2. Mısra: <strong class="text-white">{{ line2() }}</strong></span>
              <span class="text-amber-300">{{ line2Analysis().length }} Hece</span>
            </div>

            <div class="flex flex-wrap items-center gap-1.5 pt-1">
              @for (item of line2Analysis(); track $index) {
                <div class="flex flex-col items-center p-1.5 rounded-lg bg-[#0e172a] border border-white/5 min-w-[34px]">
                  <span class="text-xs font-serif text-stone-200">{{ item.syllable }}</span>
                  <span
                    class="text-xs font-mono font-bold mt-1 px-1.5 py-0.2 rounded"
                    [class.text-amber-300]="item.isOpen"
                    [class.bg-amber-500/20]="item.isOpen"
                    [class.text-cyan-300]="!item.isOpen"
                    [class.bg-cyan-500/20]="!item.isOpen"
                  >
                    {{ item.symbol }}
                  </span>
                </div>
              }
            </div>

            <div class="text-[11px] font-mono text-stone-300 tracking-widest pt-1">
              Metre Kodu: <span class="text-amber-300">{{ line2Pattern() }}</span>
            </div>
          </div>

          <!-- Matched Kalıp and Poetic Form -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-2xl bg-[#0c1424] border border-amber-500/20 space-y-1">
              <span class="text-[10px] uppercase font-mono text-stone-300 block">Tespit Edilen Ölçü</span>
              <h4 class="text-sm font-serif font-bold text-amber-300">
                {{ matchedKalip() }}
              </h4>
              <p class="text-[11px] text-stone-300 font-mono">{{ matchedKalipDetail() }}</p>
            </div>

            <div class="p-4 rounded-2xl bg-[#0c1424] border border-white/10 space-y-1">
              <span class="text-[10px] uppercase font-mono text-stone-300 block">Kafiye & Ahenk Türü</span>
              <h4 class="text-sm font-serif font-bold text-cyan-300">
                {{ activePreset()?.kafiyeTuru || 'Geleneksel Uyak' }}
              </h4>
              <p class="text-[11px] text-stone-300 font-mono">{{ activePreset()?.kafiye || 'Son ses benzerliği incelendi' }}</p>
            </div>

            <div class="p-4 rounded-2xl bg-[#0c1424] border border-white/10 space-y-1">
              <span class="text-[10px] uppercase font-mono text-stone-300 block">Redif</span>
              <h4 class="text-sm font-serif font-bold text-emerald-300">
                {{ activePreset()?.redif || 'Mısra sonu tekrarı' }}
              </h4>
              <p class="text-[11px] text-stone-300 font-mono">Görev ve anlam ayniyeti</p>
            </div>
          </div>

          <!-- Deep Philosophical & Literary Commentary (Şerh) -->
          @if (activePreset()?.serh) {
            <div class="p-6 rounded-2xl bg-[#080d1a] border-l-4 border-amber-400 space-y-2 shadow-lg">
              <div class="flex items-center gap-2">
                <mat-icon class="!w-4 !h-4 !text-base text-amber-400">import_contacts</mat-icon>
                <h4 class="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
                  Beytin Felsefi & Edebi Şerhi (Orçun Kundakcı Tahlili)
                </h4>
              </div>
              <p class="text-stone-200 text-xs sm:text-sm leading-relaxed font-sans">
                {{ activePreset()?.serh }}
              </p>
            </div>
          }
        </div>

        <!-- Action Bar: Copy Analysis -->
        <div class="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            (click)="copyAnalysis()"
            class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <mat-icon class="!w-4 !h-4 !text-base text-stone-950">content_copy</mat-icon>
            <span>{{ analysisCopied() ? 'Tahlil Panoya Kopyalandı!' : 'Tahlil Raporunu Kopyala' }}</span>
          </button>
        </div>

      </div>

    </div>
  `,
})
export class PoeticsLabComponent {
  readonly presets = PRESETS;
  readonly activePreset = signal<PoemPreset | null>(PRESETS[0]);
  readonly line1 = signal<string>(PRESETS[0].firstLine);
  readonly line2 = signal<string>(PRESETS[0].secondLine);
  readonly analysisCopied = signal<boolean>(false);

  selectPreset(preset: PoemPreset): void {
    this.activePreset.set(preset);
    this.line1.set(preset.firstLine);
    this.line2.set(preset.secondLine);
  }

  updateLine1(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.line1.set(val);
    this.activePreset.set(null);
  }

  updateLine2(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.line2.set(val);
    this.activePreset.set(null);
  }

  clearLines(): void {
    this.line1.set('');
    this.line2.set('');
    this.activePreset.set(null);
  }

  // Heuristic syllabification & open/closed syllable tagging
  private analyzeLine(text: string): SyllableAnalysis[] {
    if (!text.trim()) return [];

    // Simple robust Turkish syllable splitter
    const words = text.trim().split(/\s+/);
    const result: SyllableAnalysis[] = [];
    const vowels = new Set(['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü', 'â', 'î', 'û', 'A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü', 'Â', 'Î', 'Û']);
    const longVowels = new Set(['â', 'î', 'û', 'Â', 'Î', 'Û']);

    for (const word of words) {
      const cleanWord = word.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜâÂîÎûÛ]/g, '');
      if (!cleanWord) continue;

      // Extract syllables using standard Turkish phonotactics
      const syllables = this.syllabifyWord(cleanWord);
      for (let i = 0; i < syllables.length; i++) {
        const syl = syllables[i];
        const lastChar = syl[syl.length - 1];
        const isWordEnd = i === syllables.length - 1;
        const hasLongVowel = Array.from(syl).some((c) => longVowels.has(c));

        // In Aruz:
        // A syllable is closed (-) if it ends in a consonant OR contains a long vowel OR is the last syllable of a line
        // A syllable is open (.) if it ends in a short vowel (and is not line end)
        let isOpen = vowels.has(lastChar) && !hasLongVowel;
        if (isWordEnd && i === syllables.length - 1 && word === words[words.length - 1]) {
          // Rule of aruz: last syllable of mısra is always closed (-)
          isOpen = false;
        }

        result.push({
          syllable: syl,
          isOpen,
          symbol: isOpen ? '.' : '-',
        });
      }
    }

    return result;
  }

  private syllabifyWord(word: string): string[] {
    const vowels = 'aeıioöuüâîûAEIİOÖUÜÂÎÛ';
    const syllables: string[] = [];
    let current = '';

    for (let i = 0; i < word.length; i++) {
      current += word[i];
      const charIsVowel = vowels.includes(word[i]);

      // Peek next chars
      if (charIsVowel) {
        let nextVowelIdx = -1;
        for (let j = i + 1; j < word.length; j++) {
          if (vowels.includes(word[j])) {
            nextVowelIdx = j;
            break;
          }
        }

        if (nextVowelIdx === -1) {
          // No more vowels, rest belongs to this syllable
          current += word.slice(i + 1);
          syllables.push(current);
          current = '';
          break;
        } else {
          const consonantsBetween = nextVowelIdx - (i + 1);
          if (consonantsBetween === 0) {
            // Hiatus: two vowels together
            syllables.push(current);
            current = '';
          } else if (consonantsBetween === 1) {
            // One consonant: belongs to the next syllable
            syllables.push(current);
            current = '';
          } else {
            // Two or more consonants: first belongs to current, rest to next
            current += word[i + 1];
            i++;
            syllables.push(current);
            current = '';
          }
        }
      }
    }

    if (current) {
      if (syllables.length > 0) {
        syllables[syllables.length - 1] += current;
      } else {
        syllables.push(current);
      }
    }

    return syllables;
  }

  readonly line1Analysis = computed(() => this.analyzeLine(this.line1()));
  readonly line2Analysis = computed(() => this.analyzeLine(this.line2()));

  readonly line1Pattern = computed(() => this.line1Analysis().map((s) => s.symbol).join(' '));
  readonly line2Pattern = computed(() => this.line2Analysis().map((s) => s.symbol).join(' '));

  readonly matchedKalip = computed(() => {
    if (this.activePreset()) {
      return this.activePreset()?.kalipName;
    }
    const len = this.line1Analysis().length;
    if (len === 11) return '11’li Hece Ölçüsü veya 11’li Aruz Kalıbı';
    if (len === 8) return '8’li Hece Ölçüsü (Semai / Koşma tarzı)';
    if (len === 7) return '7’li Hece Ölçüsü (Mani tarzı)';
    if (len === 14) return '14’lü Aruz Vezni (Mef’ûlü Mefâ’îlü Fe’ûlün türevi)';
    if (len === 15) return '15’li Aruz Kalıbı (Fâ’ilâtün Fâ’ilâtün Fâ’ilâtün Fâ’ilün)';
    if (len === 16) return '16’lı Klasik Divan Aruz Kalıbı (Müstef’ilün Müstef’ilün)';
    return `${len} Heceli Aruz / Hece Kalıbı`;
  });

  readonly matchedKalipDetail = computed(() => {
    if (this.activePreset()) {
      return this.activePreset()?.kalipPattern;
    }
    return `Mısra hece adedi: ${this.line1Analysis().length} / ${this.line2Analysis().length}`;
  });

  copyAnalysis(): void {
    const preset = this.activePreset();
    const text = `
=== ŞİİR TAHLİL VE VEZİN RAPORU (ORÇUN KUNDAKCI PORTFÖYÜ) ===
1. Mısra: ${this.line1()}
   Ritim Kodu: ${this.line1Pattern()} (${this.line1Analysis().length} hece)
2. Mısra: ${this.line2()}
   Ritim Kodu: ${this.line2Pattern()} (${this.line2Analysis().length} hece)
Ölçü / Vezin: ${this.matchedKalip()}
${preset ? `Kafiye Türü: ${preset.kafiyeTuru}\nRedif: ${preset.redif}\nŞerh: ${preset.serh}` : ''}
Tahlil Tarihi: ${new Date().toLocaleDateString('tr-TR')}
=============================================================
`.trim();

    navigator.clipboard?.writeText(text).then(() => {
      this.analysisCopied.set(true);
      setTimeout(() => this.analysisCopied.set(false), 2500);
    });
  }
}
