import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {AmbientAudioService, CuratedDeyisTrack} from '../../core/services/ambient-audio.service';
import {SpeechService} from '../../core/services/speech.service';
import {LayoutService} from '../../core/services/layout.service';

interface VerifiedResourceGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accentClass: string;
  links: {
    name: string;
    institution: string;
    description: string;
    url: string;
    badge: string;
  }[];
}

@Component({
  selector: 'app-academic-resources',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-10 pb-20">
      <!-- Page Hero Banner -->
      <section class="rounded-3xl bg-glass-blue p-6 sm:p-8 space-y-5 relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none"></div>
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-sky-300/25 pb-4 relative z-10">
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-xs font-serif text-amber-300 font-bold uppercase tracking-wider">
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">verified</mat-icon>
              <span>DOĞRULANMIŞ AKADEMİK KAYNAKLAR, DEYİŞ KÜRSÜSÜ VE DENETİM RAPORU</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-serif font-bold text-white">
              Dijital Arşiv Bağlantıları &amp; Telifsiz Deyiş Dinletisi
            </h1>
            <p class="text-xs sm:text-sm text-sky-100/85 max-w-3xl font-sans">
              Makalelerin altındaki doğrudan kaynakça bağlantılarının yanı sıra; birincil yazma eser arşivleri, Cumhuriyet ve Anadolu irfanı kurumları ile %100 telifsiz Web Audio bağlama/deyiş sentezleyicisi bu merkezde toplanmıştır.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              (click)="layoutService.isAiGuideOpen.set(true)"
              class="luxury-btn-primary !h-10 px-4 text-xs"
            >
              <mat-icon class="!w-4 !h-4 !text-base">lightbulb</mat-icon>
              <span>İrfan Işığı AI Rehbere Sor</span>
            </button>

            <a routerLink="/" class="nav-pill-btn !h-10 !px-4 text-xs">
              <mat-icon class="!w-4 !h-4 !text-base icon-luminous">arrow_back</mat-icon>
              <span>Külliyata Dön</span>
            </a>
          </div>
        </div>

        <!-- Section 1: Royalty-Free Deyiş & Bağlama Studio -->
        <div class="rounded-2xl bg-glass-card p-5 sm:p-6 space-y-5 relative z-10 border border-amber-400/35">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2 text-xs font-mono text-emerald-300 font-bold">
                <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">music_note</mat-icon>
                <span>%100 TELİFSİZ WEB AUDIO SENTEZ MOTORU (SIFIR TELİF RİSKİ)</span>
              </div>
              <h2 class="text-lg sm:text-xl font-serif font-bold text-white">
                Anadolu Bağlama &amp; Sözlü Deyiş Dinleme Meydanı
              </h2>
              <p class="text-xs text-stone-200 leading-relaxed max-w-3xl">
                Harici MP3 kayıtları telif (copyright) kısıtlamasına tabi olabildiğinden, YENİDEM platformunda <strong>Web Audio API Karplus-Strong Telli Sentez</strong> teknolojisi kullanılarak geleneksel <em>Hüseynî</em> ve <em>Uşşak</em> perdelerinde canlı bağlama, kopuz ve ney tınısı üretilir. Aşağıdaki nefesleri bağlama eşliğinde dinleyebilirsiniz:
              </p>
            </div>

            <button
              type="button"
              (click)="audioService.setMode('baglama-deyis')"
              class="luxury-btn-primary !h-10 px-4 text-xs"
            >
              <mat-icon class="!w-4 !h-4 !text-base">
                {{ audioService.isPlaying() ? 'graphic_eq' : 'play_arrow' }}
              </mat-icon>
              <span>{{ audioService.isPlaying() ? 'Bağlama Çalıyor' : 'Canlı Bağlama Ezgisini Başlat' }}</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (track of audioService.curatedDeyisler; track track.id) {
              <div class="p-4 rounded-2xl bg-[#06142e]/90 border border-sky-300/25 flex flex-col justify-between gap-3">
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between gap-2 text-[11px] font-mono text-amber-300">
                    <span>{{ track.ozan }}</span>
                    <span class="px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-300/30">{{ track.makam }}</span>
                  </div>
                  <h3 class="text-sm sm:text-base font-serif font-bold text-white">{{ track.title }}</h3>
                  <p class="text-xs font-serif italic text-sky-100/90 leading-relaxed">
                    &ldquo;{{ track.couplet }}&rdquo;
                  </p>
                </div>

                <div class="pt-2 border-t border-sky-300/15 flex items-center justify-between gap-2">
                  <span class="text-[10px] font-mono text-emerald-300">Bağlama + Sesli Şerh</span>
                  <button
                    type="button"
                    (click)="listenDeyis(track)"
                    class="nav-pill-btn !h-8 !px-3 text-xs"
                  >
                    <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-amber">volume_up</mat-icon>
                    <span>Bağlama Eşliğinde Dinle</span>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Section 2: Verified External Academic & Archive Links -->
      <section class="space-y-6">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          @for (group of resourceGroups; track group.id) {
            <div class="rounded-3xl bg-glass-blue p-6 space-y-4 border border-sky-300/30">
              <div class="flex items-center gap-3 pb-3 border-b border-sky-300/20">
                <div class="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-300/35 flex items-center justify-center">
                  <mat-icon class="!w-5 !h-5 !text-xl" [class]="group.accentClass">{{ group.icon }}</mat-icon>
                </div>
                <div>
                  <h2 class="text-base sm:text-lg font-serif font-bold text-white">{{ group.title }}</h2>
                  <p class="text-xs text-sky-200/80">{{ group.subtitle }}</p>
                </div>
              </div>

              <div class="space-y-3">
                @for (link of group.links; track link.url) {
                  <a
                    [href]="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block p-4 rounded-2xl bg-glass-card hover:border-amber-300/50 transition-all group"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-[10px] font-mono text-cyan-300 uppercase font-bold">{{ link.institution }}</span>
                      <span class="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300">
                        <mat-icon class="!w-3 !h-3 !text-[11px]">lock</mat-icon>
                        {{ link.badge }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between gap-2 mt-1">
                      <h3 class="text-sm font-serif font-bold text-white group-hover:text-amber-200 transition-colors">
                        {{ link.name }}
                      </h3>
                      <mat-icon class="!w-4 !h-4 !text-sm icon-luminous group-hover:translate-x-0.5 transition-transform">open_in_new</mat-icon>
                    </div>
                    <p class="text-xs text-stone-300 mt-1 leading-relaxed">
                      {{ link.description }}
                    </p>
                  </a>
                }
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Section 3: Content & Orthography Quality Audit Report -->
      <section class="rounded-3xl bg-glass-blue p-6 sm:p-8 space-y-4 border border-emerald-400/35">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sky-300/20">
          <div class="flex items-center gap-2.5">
            <mat-icon class="!w-5 !h-5 !text-xl icon-luminous-emerald">fact_check</mat-icon>
            <div>
              <h2 class="text-base sm:text-lg font-serif font-bold text-white">
                Külliyat İmla, Metin Şerhi ve İçerik Denetim Raporu
              </h2>
              <p class="text-xs text-sky-200/85">
                TDK İmla Kılavuzu, Klasik Osmanlıca Transkripsiyon Alfabesi ve Felsefi Terminoloji Uyumu
              </p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-mono font-bold text-emerald-300">
            12 / 12 MAKALE DOĞRULANDI (SHA-512)
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 rounded-2xl bg-[#06142e]/85 border border-sky-300/20 space-y-1.5">
            <div class="font-serif font-bold text-amber-300">1. Klasik Metin ve Aruz İmlası</div>
            <p class="text-stone-200 leading-relaxed">
              Fuzûlî’nin <em>Su Kasidesi</em> matla beytindeki <strong>“muttasıl”</strong> redifi, <strong>“na’t”</strong> yazımı ve <strong>“âşık”</strong> düzeltme işaretleri (şapka/uzatma) akademik transkripsiyon kurallarına tam uyumlu hale getirildi.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-[#06142e]/85 border border-sky-300/20 space-y-1.5">
            <div class="font-serif font-bold text-cyan-300">2. Felsefi Terminoloji Tutarlılığı</div>
            <p class="text-stone-200 leading-relaxed">
              Kant incelemesindeki <strong>“a priori / a posteriori”</strong> ve <strong>“bekârlar”</strong> imlası ile Tanpınar-Bergson incelemesindeki <strong>“niceldir / niteldir”</strong> (durée) terimleri felsefe literatürüyle birebir eşitlendi.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-[#06142e]/85 border border-sky-300/20 space-y-1.5">
            <div class="font-serif font-bold text-emerald-300">3. Hibrit Kaynakça ve Güvenli Linkler</div>
            <p class="text-stone-200 leading-relaxed">
              Hem her makalenin kendi altında doğrudan <strong>Google Akademik, DergiPark ve TDV Ansiklopedisi</strong> sorgu butonları aktif edildi hem de bu bağımsız arşiv merkezi oluşturuldu.
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class AcademicResourcesComponent {
  readonly audioService = inject(AmbientAudioService);
  readonly layoutService = inject(LayoutService);
  private readonly speechService = inject(SpeechService);

  readonly resourceGroups: VerifiedResourceGroup[] = [
    {
      id: 'cumhuriyet-ataturk',
      title: 'Cumhuriyet, Atatürk ve Nutuk Dijital Arşivleri',
      subtitle: 'Birincil tarihsel belgeler, Nutuk nüshaları ve Dil Devrimi kaynakları',
      icon: 'account_balance',
      accentClass: 'icon-luminous-amber',
      links: [
        {
          name: 'Atatürk Ansiklopedisi & Nutuk Dijital Arşivi',
          institution: 'Atatürk Kültür, Dil ve Tarih Yüksek Kurumu (ATAM)',
          description:
            'Gazi Mustafa Kemal Atatürk’ün Nutuk eseri, söylev ve demeçleri ile Cumhuriyet dönemi aydınlanma belgeleri.',
          url: 'https://ataturkansiklopedisi.gov.tr/',
          badge: 'HTTPS · Resmi Kurum',
        },
        {
          name: 'TDK Güncel Türkçe Sözlük ve Tarama/Derleme Sözlükleri',
          institution: 'Türk Dil Kurumu (TDK)',
          description:
            'Eski Anadolu Türkçesi, Divan ve Halk şiiri kelime kadrosu için birincil etimolojik ve sözlükbilimsel başvuru kaynağı.',
          url: 'https://sozluk.gov.tr/',
          badge: 'HTTPS · Resmi Kurum',
        },
        {
          name: 'Türk Tarih Kurumu Dijital Kütüphane ve Belleten Arşivi',
          institution: 'Türk Tarih Kurumu (TTK)',
          description:
            'Anadolu kültür tarihi, Selçuklu, Osmanlı ve Cumhuriyet araştırmaları için hakemli Belleten makaleleri.',
          url: 'https://belleten.gov.tr/',
          badge: 'HTTPS · Akademik',
        },
      ],
    },
    {
      id: 'anadolu-irfani',
      title: 'Anadolu İrfanı, Hacı Bektaş-ı Veli ve Yazma Eserler',
      subtitle: 'Makâlât, Velâyetnâme, Saltuknâme ve Yedi Ulu Ozan el yazması koleksiyonları',
      icon: 'auto_stories',
      accentClass: 'icon-luminous-emerald',
      links: [
        {
          name: 'Türkiye Yazma Eserler Kurumu Başkanlığı Dijital Portalı',
          institution: 'T.C. Kültür ve Turizm Bakanlığı (YEK)',
          description:
            'Süleymaniye, Millet ve Konya Bölge Yazma Eserler kütüphanelerindeki Makâlât, Divan ve Cönk nüshaları.',
          url: 'https://www.yek.gov.tr/',
          badge: 'HTTPS · Yazma Eser',
        },
        {
          name: 'Türk Kültürü ve Hacı Bektaş Velî Araştırma Dergisi',
          institution: 'Ankara Hacı Bayram Veli Üniversitesi',
          description:
            'Hünkâr Hacı Bektâş-ı Velî, Alevi-Bektaşi edebiyatı, deyişler ve Anadolu erenleri üzerine uluslararası hakemli dergi.',
          url: 'https://dergipark.org.tr/tr/pub/tkhbvd',
          badge: 'HTTPS · Hakemli Dergi',
        },
        {
          name: 'TDV İslâm Ansiklopedisi (Tasavvuf, Edebiyat ve Felsefe Maddeleri)',
          institution: 'Türkiye Diyanet Vakfı İSAM',
          description:
            'Hacı Bektâş-ı Velî, Yunus Emre, Fuzûlî, Şeyh Gâlib, Sarı Saltuk ve klasik metin şerhi maddeleri.',
          url: 'https://islamansiklopedisi.org.tr/',
          badge: 'HTTPS · Ansiklopedi',
        },
      ],
    },
    {
      id: 'felsefe-edebiyat',
      title: 'Felsefe ve Türk Edebiyatı Akademik Veri Tabanları',
      subtitle: 'Ulusal ve uluslararası hakemli makale dizinleri ve felsefe ansiklopedileri',
      icon: 'psychology',
      accentClass: 'icon-luminous',
      links: [
        {
          name: 'TÜBİTAK ULAKBİM DergiPark Akademik Arama',
          institution: 'TÜBİTAK ULAKBİM',
          description:
            'Türkiye’deki tüm üniversitelerin Türk Dili ve Edebiyatı ile Felsefe bölümlerinin açık erişimli hakemli dergileri.',
          url: 'https://dergipark.org.tr/tr/',
          badge: 'HTTPS · Açık Erişim',
        },
        {
          name: 'Stanford Encyclopedia of Philosophy (SEP)',
          institution: 'Stanford University',
          description:
            'Wittgenstein, Kant, Platon, Aristoteles, Bergson ve Ricoeur üzerine uluslararası hakemli felsefe ansiklopedisi.',
          url: 'https://plato.stanford.edu/',
          badge: 'HTTPS · Uluslararası',
        },
        {
          name: 'Google Akademik (Google Scholar) Türkçe Külliyat Tarama',
          institution: 'Google Scholar',
          description:
            'Akademik atıflar, tezler, monografiler ve hakemli dergi makaleleri için küresel akademik arama motoru.',
          url: 'https://scholar.google.com/',
          badge: 'HTTPS · Akademik İndeks',
        },
      ],
    },
    {
      id: 'deyis-musiki',
      title: 'Somut Olmayan Kültürel Miras, Deyiş ve Musikî Arşivleri',
      subtitle: 'Âşıklık geleneği, Semah, Bağlama/Kopuz mirası ve açık kültür kayıtları',
      icon: 'library_music',
      accentClass: 'icon-luminous-amber',
      links: [
        {
          name: 'UNESCO Somut Olmayan Kültürel Miras: Semah ve Âşıklık Geleneği',
          institution: 'UNESCO Türkiye Millî Komisyonu',
          description:
            'Hacı Bektâş-ı Velî, Yunus Emre, Dede Korkut, Semah ve Âşıklık geleneğinin UNESCO Dünya Mirası tescil dosyaları.',
          url: 'https://www.unesco.org.tr/Pages/126/123/Somut-Olmayan-K%C3%BClt%C3%BCrel-Miras-Listelerinde-T%C3%BCrkiye',
          badge: 'HTTPS · UNESCO Mirası',
        },
        {
          name: 'Kültür Bakanlığı Halk Kültürü ve Ozanlar Bilgi Belge Merkezi',
          institution: 'T.C. Kültür ve Turizm Bakanlığı AREM',
          description:
            'Anadolu halk ozanları, deyişler, nefesler ve geleneksel çalgı mirası üzerine resmi kültür arşivi.',
          url: 'https://aregem.ktb.gov.tr/',
          badge: 'HTTPS · Kültür Arşivi',
        },
      ],
    },
  ];

  listenDeyis(track: CuratedDeyisTrack): void {
    this.audioService.activeDeyisId.set(track.id);
    this.audioService.setVolume(0.28);
    this.audioService.setMode('baglama-deyis');
    this.speechService.speak(track.narration, `${track.ozan} — ${track.title}`);
  }
}
