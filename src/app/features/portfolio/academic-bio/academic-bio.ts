import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-academic-bio',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
      
      <!-- Academic Profile Header Card -->
      <header class="p-8 sm:p-12 rounded-3xl cloud-lit-hero text-white flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <div class="relative w-28 h-28 flex-shrink-0 rounded-2xl bg-gradient-to-br from-cyan-400/25 via-[#132854] to-[#081530] border border-sky-300/50 p-3 shadow-xl flex items-center justify-center">
          <span class="font-serif font-black text-4xl text-amber-300">
            YD
          </span>
          <div class="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center shadow-md">
            ✓
          </div>
        </div>

        <div class="space-y-3 text-center sm:text-left flex-1">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>YENİDEM Kurucusu & Başyazarı &bull; Araştırmacı</span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Orçun KUNDAKCI
          </h1>

          <p class="text-sm sm:text-base text-stone-200 font-medium leading-relaxed font-sans">
            Anadolu Üniversitesi Açıköğretim Fakültesi <br class="hidden sm:inline" />
            <strong class="text-amber-300 font-semibold">Türk Dili ve Edebiyatı</strong> &
            <strong class="text-emerald-300 font-semibold">Felsefe</strong> Lisans Eğitimi
          </p>

          <p class="text-xs sm:text-sm text-stone-300 max-w-xl font-sans leading-relaxed pt-1">
            Kişisel iddialardan ve suni süslerden uzak; Türkçenin duru pınarı ile felsefi düşüncenin mantıksal 
            tutarlılığını bir araya getirerek klasik ve çağdaş metinleri şerh etme ve anlama cehdi.
          </p>
        </div>
      </header>

      <!-- Academic Philosophy & Methodology -->
      <section class="space-y-4">
        <h2 class="text-xs font-bold uppercase tracking-widest text-amber-400 font-serif flex items-center gap-2">
          <mat-icon class="!w-4 !h-4 !text-base text-amber-400">menu_book</mat-icon>
          <span>Akademik Yaklaşım ve Yöntem</span>
        </h2>
        
        <div class="prose max-w-none text-stone-200 font-serif leading-relaxed text-justify space-y-4 text-base bg-[#0c1322] p-7 sm:p-9 rounded-3xl border border-amber-500/20 shadow-xl">
          <p class="drop-cap">
            Bu mecra, şahsi bir övgü yahut gösteriş sahası olarak değil; Türk Dili ve Edebiyatı ile Felsefe 
            disiplinlerinin kesiştiği müşterek zeminde ortaya çıkan düşüncelerin, şerhlerin ve kavramsal soruşturmaların 
            kayda geçirilmesi gayesiyle inşa edilmiştir.
          </p>
          <p>
            Edebiyat, yalnızca hoş bir estetik temaşa vasıtası değildir; bir milletin varlıkla kurduğu ontolojik bağın, 
            dilsel hafızasının ve kolektif şuurunun tecessüm etmiş hâlidir. Felsefe ise bu hafızanın dayandığı 
            kavramları sorgulayan, argümanları mantıksal doğruluk terazisine koyan ve dilin sınırlarını tayin eden 
            bir tefekkür disiplinidir.
          </p>
          <p>
            Dolayısıyla bir Yunus Emre nefesini, Hacı Bektâş-ı Velî'nin Makâlât'ını, Pîr Sultan Abdal'ın adalet deyişini 
            yahut Fuzûlî'nin bir gazelini tahlil ederken; yalnızca aruz kalıplarını ve kafiye örgüsünü aramak yetersizdir. 
            Esas olan, o mısraların arkasındaki varlık felsefesini, ahlak nizamını ve epistemolojik duruşu gün yüzüne çıkarmaktır.
          </p>
        </div>
      </section>

      <!-- Dual Disciplines Detailed Breakdown -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        <!-- Türk Dili ve Edebiyatı (TDE) Card -->
        <div class="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121929] to-[#0a0f1d] border border-amber-500/35 space-y-4 shadow-xl">
          <div class="flex items-center gap-3.5">
            <div class="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <mat-icon class="!w-6 !h-6 !text-2xl">menu_book</mat-icon>
            </div>
            <div>
              <h3 class="text-base font-serif font-bold text-white">Türk Dili ve Edebiyatı</h3>
              <p class="text-xs text-amber-300 font-sans font-medium">AÖF TDE Programı İncelemeleri</p>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
            Klasik Türk şiirinin semantik katmanları, tasavvufi mazmunlar, Osmanlı dönemi şerh geleneği 
            ve Türk dilinin tarihsel gramer gelişimi üzerine müstakil araştırmalar.
          </p>

          <div class="pt-3 border-t border-amber-500/20 space-y-2 text-xs text-stone-300">
            <div class="font-serif font-bold text-amber-300">Öncelikli Çalışma Alanları:</div>
            <ul class="list-disc list-inside space-y-1 font-sans pl-1 text-stone-300">
              <li>Klasik Metin Şerhi Usulü ve Belâgat</li>
              <li>Divan Poetikası ve Aşkın Ontolojisi (Fuzûlî, Şeyh Gâlib)</li>
              <li>Anadolu Tasavvuf Edebiyatı (Yunus Emre, Hacı Bektaş)</li>
              <li>Halk Şiirinde Adalet ve Politik Duruş (Pîr Sultan Abdal)</li>
              <li>Türkçe Morfoloji ve Kökenbilim (Etimoloji)</li>
            </ul>
          </div>
        </div>

        <!-- Felsefe Card -->
        <div class="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121929] to-[#0a0f1d] border border-emerald-500/35 space-y-4 shadow-xl">
          <div class="flex items-center gap-3.5">
            <div class="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <mat-icon class="!w-6 !h-6 !text-2xl">psychology</mat-icon>
            </div>
            <div>
              <h3 class="text-base font-serif font-bold text-white">Felsefe ve Mantık</h3>
              <p class="text-xs text-emerald-300 font-sans font-medium">AÖF Felsefe Programı İncelemeleri</p>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
            Dil ile dünya arasındaki temsil ilişkisi, mantıksal önermelerin doğrulanabilirliği, metin hermeneutiği 
            ve İslam felsefesindeki illiyet tartışmaları üzerine araştırmalar.
          </p>

          <div class="pt-3 border-t border-emerald-500/20 space-y-2 text-xs text-stone-300">
            <div class="font-serif font-bold text-emerald-300">Öncelikli Çalışma Alanları:</div>
            <ul class="list-disc list-inside space-y-1 font-sans pl-1 text-stone-300">
              <li>Dil Felsefesi ve Dil Oyunları (Ludwig Wittgenstein)</li>
              <li>Hermeneutik ve Metin Yorumlama Kuramı (Paul Ricoeur)</li>
              <li>Tehâfüt Münazarası ve Nedensellik (Gazâlî & İbn Rüşd)</li>
              <li>Varlık ve Yokluk Felsefesi (Ontoloji)</li>
              <li>Klasik ve Sembolik Mantık Kuralları</li>
            </ul>
          </div>
        </div>

      </section>

      <!-- Erenler & 40 Makam Feature Spotlight -->
      <section class="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#10192d] via-[#09101f] to-[#050811] border border-amber-500/35 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-3 max-w-xl text-center md:text-left">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <mat-icon class="!w-3.5 !h-3.5 !text-xs text-amber-400">explore</mat-icon>
            <span>Özel Dijital Araştırma Projesi</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-serif font-bold text-white">
            Erenler Atlası & Dört Kapı Kırk Makam
          </h3>
          <p class="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
            Hacı Bektâş-ı Velî, Yunus Emre, Pîr Sultan Abdal, Sarı Saltuk ve Ahî Evran'ın düşünce evrenini 
            ve 40 Makamın psikolojik/felsefi izahlarını interaktif harita ve yaşam pusulası formatında keşfedin.
          </p>
        </div>

        <a
          routerLink="/erenler-ve-makamlar"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-950/40 border border-amber-300 flex-shrink-0"
        >
          <mat-icon class="!w-4 !h-4 !text-base">explore</mat-icon>
          <span>Atlası Keşfet →</span>
        </a>
      </section>

      <!-- Academic & Technical Principles -->
      <section class="p-7 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0c1322] to-[#060912] border border-amber-500/30 text-stone-100 space-y-5 shadow-2xl">
        <h3 class="text-sm font-serif font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
          <mat-icon class="!w-5 !h-5 !text-lg text-amber-400">verified</mat-icon>
          <span>Bu Külliyatın Akademik ve Teknik İlkeleri</span>
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1 text-xs">
          <div class="p-5 rounded-2xl bg-[#080d1a] border border-white/10 space-y-2">
            <span class="font-serif font-bold text-amber-300 block text-sm">Hakiki ve Kalıcı Veri</span>
            <p class="text-stone-300 leading-relaxed font-sans">
              Asla sahte simülasyon veya geçici placeholder veri barındırmaz. Bütün makaleler, kaynakçalar ve tahliller 
              gerçek akademik okumaların ürünüdür.
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-[#080d1a] border border-white/10 space-y-2">
            <span class="font-serif font-bold text-emerald-300 block text-sm">Metodolojik Titizlik</span>
            <p class="text-stone-300 leading-relaxed font-sans">
              Her metin APA 7 formatında kaynakça içerir; doğrudan alıntılar ve tahliller kaynak eserlerine sadık 
              kalarak sunulur.
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-[#080d1a] border border-white/10 space-y-2">
            <span class="font-serif font-bold text-sky-300 block text-sm">Yüksek Çözünürlüklü Kartlar</span>
            <p class="text-stone-300 leading-relaxed font-sans">
              Sosyal ağlarda paylaşım için X, LinkedIn ve Instagram formatlarında yüksek çözünürlüklü alıntı kartları 
              doğrudan tarayıcıda üretilir.
            </p>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <div class="text-center pt-4">
        <a
          routerLink="/"
          class="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-xl shadow-amber-950/50 border border-amber-300"
        >
          <mat-icon class="!w-4 !h-4 !text-base">menu_book</mat-icon>
          <span>Külliyatı ve Makaleleri İnceleyin</span>
        </a>
      </div>

    </div>
  `,
})
export class AcademicBio {}
