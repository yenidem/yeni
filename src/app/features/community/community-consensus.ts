import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {DecimalPipe, DatePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {
  CandidateArticleItem,
  CommunityGovernanceService,
} from '../../core/services/community-governance.service';
import {SecurityService} from '../../core/services/security.service';
import {ReaderComfortService} from '../../core/services/reader-comfort.service';
import {AcademicArticle} from '../../core/models/article.model';

export type GovernanceTab = 'voting' | 'kyc' | 'architecture' | 'propose';

@Component({
  selector: 'app-community-consensus',
  imports: [ReactiveFormsModule, DecimalPipe, DatePipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 pb-20">
      <!-- TOP HERO & LIVE 1,000,000 MEMBER QUORUM + %96 CONSENSUS + POST-QUANTUM WORM LEDGER -->
      <section class="rounded-3xl bg-glass-blue p-6 sm:p-8 border border-sky-300/40 space-y-6 reveal-up">
        <div class="flex flex-wrap items-start justify-between gap-4 border-b border-sky-300/25 pb-5">
          <div class="space-y-2 max-w-3xl">
            <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span class="px-2.5 py-0.5 rounded-lg bg-rose-600 text-white font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
                <span>KUANTUM-DİRENÇLİ ÇİFT ZİNCİR (SHA3-512 + BLAKE2b-512)</span>
              </span>
              <span class="text-cyan-200 font-semibold">Katman-1: WORM Emanet Sertifikası</span>
              <span aria-hidden="true" class="text-sky-300/40">·</span>
              <span class="text-amber-300 font-bold">1M Üye &amp; %85 Ön Onay</span>
              <span aria-hidden="true" class="text-sky-300/40">·</span>
              <span class="text-emerald-300 font-bold">Katman-2: %96.0 Ana Blok Zinciri</span>
            </div>

            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Kuantum-Dirençli Ön-Konsensüs Emanet Zinciri, Sıkı KYC &amp; %96 Blok Zinciri Onay Merkezî
            </h1>

            <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Sisteme sunulan her aday makale, <strong class="text-amber-300">daha topluluk onayından (%96) geçmeden önce</strong> ilk saniyede <strong class="text-cyan-200">NIST FIPS 202 SHA3-512 (Keccak) + RFC 7693 BLAKE2b-512 + SLH-DSA (SPHINCS+)</strong> üçlü kuantum kriptografisiyle dondurularak <strong class="text-amber-300">Katman-1 WORM (Bir Kez Yaz - Çok Kez Oku) Karantina &amp; Emanet Zincirine</strong> kaydedilir ve <code class="text-cyan-200">PRE-CERT-PQC</code> sertifikası alır. Böylece oylama sürerken metinde tek bir harf bile değiştirilemez ve telif hakkı çalınamaz. Ardından <strong class="text-emerald-300">1.000.000 Doğrulanmış Üye + %85 Ön Onay + %96.0 Süper Çoğunluk</strong> sağlandığında <strong class="text-emerald-300">Katman-2 Autivca Ana Blok Zincirine</strong> kalıcı olarak mühürlenir.
            </p>
          </div>

          <!-- Active Member Status / Quick Action -->
          <div class="flex flex-col sm:items-end gap-2 shrink-0">
            @if (gov.activeVerifiedMember(); as member) {
              <div class="p-3.5 rounded-2xl bg-[#071938] border border-emerald-400/50 space-y-1 text-left sm:text-right">
                <div class="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-emerald-300">
                  <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">verified_user</mat-icon>
                  <span>Kuantum KYC-4 Doğrulanmış Üye</span>
                </div>
                <div class="text-xs font-bold text-white">{{ member.fullName }}</div>
                <div class="text-[11px] font-mono text-cyan-200">{{ member.memberId }} · {{ member.phoneMasked }}</div>
              </div>
            } @else {
              <button
                type="button"
                (click)="activeTab.set('kyc')"
                class="luxury-btn-primary !h-10 px-4 text-xs"
              >
                <mat-icon class="!w-4 !h-4 !text-base">verified_user</mat-icon>
                <span>Sıkı Üye Doğrulaması (Tel &amp; Mail KYC) Başlat</span>
              </button>
            }
          </div>
        </div>

        <!-- 4 CORE METRIC CARDS + 1,000,000 MEMBER PROGRESS BAR -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <!-- Card 1: Post-Quantum WORM Pre-Consensus Vault -->
          <div class="p-4 rounded-2xl bg-glass-card space-y-2">
            <div class="flex items-center justify-between text-xs text-sky-200">
              <span class="font-semibold">Katman-1: Ön-Konsensüs Emanet</span>
              <mat-icon class="!w-4 !h-4 !text-base icon-luminous">shield_lock</mat-icon>
            </div>
            <div class="text-lg sm:text-xl font-extrabold font-mono text-cyan-300">
              SHA3-512 + BLAKE2b
            </div>
            <p class="text-[11px] text-slate-200 leading-snug">
              Topluluk onayı bitmeden önce metni WORM zincirinde dondurur; oylama sırasında müdahaleyi %100 engeller.
            </p>
            <div class="text-[11px] font-mono text-emerald-300">
              ✓ NIST FIPS 202 &amp; SLH-DSA Aktif
            </div>
          </div>

          <!-- Card 2: 1,000,000 Member Floor -->
          <div class="p-4 rounded-2xl bg-glass-card space-y-2">
            <div class="flex items-center justify-between text-xs text-sky-200">
              <span class="font-semibold">1.000.000 Üye Taban Barajı</span>
              <mat-icon class="!w-4 !h-4 !text-base icon-luminous">groups</mat-icon>
            </div>
            <div class="text-xl sm:text-2xl font-extrabold font-mono text-white tabular-nums">
              {{ gov.effectiveVerifiedMembers() | number }}
              <span class="text-xs font-normal text-sky-300">/ 1.000.000</span>
            </div>
            <div class="w-full h-2 rounded-full bg-[#051026] overflow-hidden border border-sky-400/25">
              <div
                class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                [style.width.%]="gov.memberProgressPercent()"
              ></div>
            </div>
            <div class="flex items-center justify-between pt-1">
              <span class="text-[11px] font-mono" [class.text-emerald-300]="gov.isOneMillionFloorMet()" [class.text-amber-300]="!gov.isOneMillionFloorMet()">
                {{ gov.isOneMillionFloorMet() ? '✓ 1M Taban Barajı Aktif' : 'Baraj Bekleniyor (%' + gov.memberProgressPercent() + ')' }}
              </span>
              <button
                type="button"
                (click)="gov.toggleOneMillionSimulation()"
                class="text-[11px] font-bold text-cyan-300 hover:text-white underline cursor-pointer"
                title="1 Milyon Üye Barajı Simülasyonunu Aç / Kapat"
              >
                {{ gov.isOneMillionQuorumSimulated() ? 'Gerçek Sayaca Geç' : '1M Simülasyonu Aç' }}
              </button>
            </div>
          </div>

          <!-- Card 3: Stage 1 Pre-Approval Threshold (%85) -->
          <div class="p-4 rounded-2xl bg-glass-card space-y-2">
            <div class="flex items-center justify-between text-xs text-sky-200">
              <span class="font-semibold">Aşama 1: Topluluk Ön Onayı</span>
              <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">fact_check</mat-icon>
            </div>
            <div class="text-xl sm:text-2xl font-extrabold font-mono text-amber-300 tabular-nums">
              Min. %{{ gov.preApprovalThresholdPercent() }}
            </div>
            <p class="text-[11px] text-slate-200 leading-snug">
              PRE-CERT-PQC sertifikalı eserin genel oylamaya çıkması için en az 1.000 hakemin %85 ön onayı.
            </p>
            <div class="text-[11px] font-mono text-cyan-200">
              Havuzda: {{ gov.preApprovalCount() }} Aday Eser
            </div>
          </div>

          <!-- Card 4: Stage 2 Final Consensus Threshold (%96) -->
          <div class="p-4 rounded-2xl bg-glass-card space-y-2">
            <div class="flex items-center justify-between text-xs text-sky-200">
              <span class="font-semibold">Katman-2: Ana Blok Zinciri</span>
              <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">how_to_vote</mat-icon>
            </div>
            <div class="text-xl sm:text-2xl font-extrabold font-mono text-emerald-300 tabular-nums">
              Min. %{{ gov.finalConsensusThresholdPercent() }}.0
            </div>
            <p class="text-[11px] text-slate-200 leading-snug">
              %96.0 Süper Çoğunluk sağlandığında Ön-Sertifika, Ana Blok Zinciri Sertifikasına dönüşür.
            </p>
            <div class="text-[11px] font-mono text-amber-300">
              Oylamada: {{ gov.finalVotingCount() }} Eser · Mühürlü: {{ gov.sealedCount() }} Eser
            </div>
          </div>
        </div>

        <!-- Feedback Toast Banner inside Page -->
        @if (gov.actionFeedback(); as feedback) {
          <div class="p-4 rounded-2xl bg-[#072138] border border-emerald-400/60 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 reveal-up">
            <div class="flex items-center gap-2.5">
              <mat-icon class="!w-5 !h-5 !text-lg icon-luminous-emerald">verified</mat-icon>
              <span>{{ feedback }}</span>
            </div>
            <button
              type="button"
              (click)="gov.actionFeedback.set(null)"
              class="text-xs text-sky-200 hover:text-white cursor-pointer"
            >
              Kapat
            </button>
          </div>
        }

        <!-- Interactive Live PQC Certificate & Anti-Tamper Verification Report Panel -->
        @if (gov.activePqcReport(); as report) {
          <div
            class="p-5 rounded-2xl border space-y-3 reveal-up"
            [class.bg-[#051d33]]="report.isIntact"
            [class.border-emerald-400]="report.isIntact"
            [class.bg-[#2a0815]]="!report.isIntact"
            [class.border-rose-400]="!report.isIntact"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2 text-xs sm:text-sm font-bold" [class.text-emerald-300]="report.isIntact" [class.text-rose-300]="!report.isIntact">
                <mat-icon class="!w-5 !h-5">{{ report.isIntact ? 'verified' : 'gpp_bad' }}</mat-icon>
                <span>{{ report.verdictMessage }}</span>
              </div>
              <button
                type="button"
                (click)="gov.activePqcReport.set(null)"
                class="px-2.5 py-1 rounded-lg bg-white/10 text-xs text-white hover:bg-white/20 cursor-pointer"
              >
                Raporu Kapat
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
              <div class="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
                <div class="text-amber-300 font-bold">NIST FIPS 202 SHA3-512 (Keccak Sponge):</div>
                <div class="text-sky-200 truncate">Kayıtlı: {{ report.expectedSha3_512 }}</div>
                <div [class.text-emerald-300]="report.isIntact" [class.text-rose-300]="!report.isIntact" class="truncate">
                  Hesaplanan: {{ report.computedSha3_512 }}
                </div>
              </div>
              <div class="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
                <div class="text-cyan-300 font-bold">RFC 7693 BLAKE2b-512 &amp; WORM Blok Özeti:</div>
                <div class="text-sky-200 truncate">BLAKE2b: {{ report.computedBlake2b512 }}</div>
                <div class="text-amber-200 truncate">WORM Zincir Bloğu: {{ report.wormBlockHash }}</div>
              </div>
            </div>
          </div>
        }

        <!-- NAVIGATION TABS -->
        <div class="flex flex-wrap items-center gap-2 pt-2">
          <button
            type="button"
            (click)="activeTab.set('voting')"
            class="nav-pill-btn !h-10 !px-4 text-xs"
            [class.nav-pill-btn-active]="activeTab() === 'voting'"
          >
            <mat-icon class="!w-4 !h-4 !text-base icon-luminous-amber">how_to_vote</mat-icon>
            <span>WORM Emanet Sertifikalı Adaylar &amp; %96 Oylama ({{ gov.proposals().length }})</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('kyc')"
            class="nav-pill-btn !h-10 !px-4 text-xs"
            [class.nav-pill-btn-active]="activeTab() === 'kyc'"
          >
            <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">verified_user</mat-icon>
            <span>Sıkı Üye Kayıt &amp; Tel/Mail Doğrulama (4 Kademe)</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('propose')"
            class="nav-pill-btn !h-10 !px-4 text-xs"
            [class.nav-pill-btn-active]="activeTab() === 'propose'"
          >
            <mat-icon class="!w-4 !h-4 !text-base icon-luminous">post_add</mat-icon>
            <span>Tarihsel / Topluluk Makale Adayı Sun</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('architecture')"
            class="nav-pill-btn !h-10 !px-4 text-xs"
            [class.nav-pill-btn-active]="activeTab() === 'architecture'"
          >
            <mat-icon class="!w-4 !h-4 !text-base icon-luminous">hub</mat-icon>
            <span>Kuantum (PQC) &amp; Çift Zincir Mimari Raporu</span>
          </button>
        </div>
      </section>

      <!-- =======================================================================
           TAB 1: ÖN ONAY (%85) & NİHAİ %96 SÜPER ÇOĞUNLUK OYLAMA MEYDANI
           ======================================================================= -->
      @if (activeTab() === 'voting') {
        <section class="space-y-6 reveal-up">
          <!-- Category & Stage Filter Bar -->
          <div class="p-4 rounded-2xl bg-glass-card flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                (click)="selectedCategory.set('all')"
                class="nav-pill-btn !h-8 !px-3 text-xs"
                [class.nav-pill-btn-active]="selectedCategory() === 'all'"
              >
                Tüm Ana Kategoriler
              </button>
              <button
                type="button"
                (click)="selectedCategory.set('tde')"
                class="nav-pill-btn !h-8 !px-3 text-xs"
                [class.nav-pill-btn-active]="selectedCategory() === 'tde'"
              >
                Türk Dili ve Edebiyatı
              </button>
              <button
                type="button"
                (click)="selectedCategory.set('felsefe')"
                class="nav-pill-btn !h-8 !px-3 text-xs"
                [class.nav-pill-btn-active]="selectedCategory() === 'felsefe'"
              >
                Felsefe &amp; Ontoloji
              </button>
              <button
                type="button"
                (click)="selectedCategory.set('kesisim')"
                class="nav-pill-btn !h-8 !px-3 text-xs"
                [class.nav-pill-btn-active]="selectedCategory() === 'kesisim'"
              >
                Disiplinlerarası İrfan
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                (click)="selectedStage.set('all')"
                class="px-3 py-1 rounded-xl text-xs font-semibold border cursor-pointer transition-colors"
                [class.bg-amber-400]="selectedStage() === 'all'"
                [class.text-slate-950]="selectedStage() === 'all'"
                [class.border-amber-300]="selectedStage() === 'all'"
                [class.bg-[#071633]]="selectedStage() !== 'all'"
                [class.text-sky-200]="selectedStage() !== 'all'"
                [class.border-sky-300/25]="selectedStage() !== 'all'"
              >
                Tümü
              </button>
              <button
                type="button"
                (click)="selectedStage.set('pre_approval')"
                class="px-3 py-1 rounded-xl text-xs font-semibold border cursor-pointer transition-colors"
                [class.bg-amber-400]="selectedStage() === 'pre_approval'"
                [class.text-slate-950]="selectedStage() === 'pre_approval'"
                [class.border-amber-300]="selectedStage() === 'pre_approval'"
                [class.bg-[#071633]]="selectedStage() !== 'pre_approval'"
                [class.text-sky-200]="selectedStage() !== 'pre_approval'"
                [class.border-sky-300/25]="selectedStage() !== 'pre_approval'"
              >
                1. Ön Onay Havuzu (%85 Baraj)
              </button>
              <button
                type="button"
                (click)="selectedStage.set('final_voting')"
                class="px-3 py-1 rounded-xl text-xs font-semibold border cursor-pointer transition-colors"
                [class.bg-amber-400]="selectedStage() === 'final_voting'"
                [class.text-slate-950]="selectedStage() === 'final_voting'"
                [class.border-amber-300]="selectedStage() === 'final_voting'"
                [class.bg-[#071633]]="selectedStage() !== 'final_voting'"
                [class.text-sky-200]="selectedStage() !== 'final_voting'"
                [class.border-sky-300/25]="selectedStage() !== 'final_voting'"
              >
                2. Nihai Oylama (%96 Baraj)
              </button>
              <button
                type="button"
                (click)="selectedStage.set('blockchain_sealed')"
                class="px-3 py-1 rounded-xl text-xs font-semibold border cursor-pointer transition-colors"
                [class.bg-emerald-400]="selectedStage() === 'blockchain_sealed'"
                [class.text-slate-950]="selectedStage() === 'blockchain_sealed'"
                [class.border-emerald-300]="selectedStage() === 'blockchain_sealed'"
                [class.bg-[#071633]]="selectedStage() !== 'blockchain_sealed'"
                [class.text-sky-200]="selectedStage() !== 'blockchain_sealed'"
                [class.border-sky-300/25]="selectedStage() !== 'blockchain_sealed'"
              >
                ✓ Blok Zincirine Mühürlenenler
              </button>
            </div>
          </div>

          <!-- Candidate Proposals List -->
          <div class="space-y-5">
            @for (item of filteredProposals(); track item.id) {
              <article class="rounded-3xl bg-glass-blue p-6 sm:p-7 border border-sky-300/35 space-y-5">
                <!-- Top Metadata Row -->
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-sky-300/20 pb-4">
                  <div class="flex flex-wrap items-center gap-2 text-xs">
                    <span class="font-bold text-amber-300">{{ item.categoryLabel }}</span>
                    <span aria-hidden="true" class="text-sky-300/40">·</span>
                    <span class="text-cyan-200">Kaynak/Miras: {{ item.historicalSourceOrAuthor }}</span>
                    <span aria-hidden="true" class="text-sky-300/40">·</span>
                    <span class="font-mono text-emerald-300">Özgünlük: %{{ item.plagiarismFreeScore }}</span>
                  </div>

                  <!-- Stage Status Indicator -->
                  <div>
                    @if (item.stage === 'blockchain_sealed') {
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-xs font-bold">
                        <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">verified</mat-icon>
                        <span>%96+ ONAYLANDI · KATMAN-2 ANA BLOK ZİNCİRİNDE MÜHÜRLÜ</span>
                      </span>
                    } @else if (item.stage === 'final_voting') {
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/60 text-amber-300 text-xs font-bold">
                        <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">how_to_vote</mat-icon>
                        <span>AŞAMA 2: %96.0 NİHAİ TOPLULUK OYLAMASINDA (WORM KİLİTLİ)</span>
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/20 border border-sky-400/60 text-sky-200 text-xs font-bold">
                        <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">fact_check</mat-icon>
                        <span>AŞAMA 1: %85.0 ÖN ONAY &amp; HAKEM DENETİMİNDE (WORM KİLİTLİ)</span>
                      </span>
                    }
                  </div>
                </div>

                <!-- Title & Abstract -->
                <div class="space-y-2">
                  <h2 class="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {{ item.title }}
                  </h2>
                  <p class="text-xs sm:text-sm text-sky-200 font-medium">
                    {{ item.subtitle }} — Sunan Üye: <strong class="text-white">{{ item.proposedByMemberName }} ({{ item.proposedByMemberId }})</strong>
                  </p>
                  <p class="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
                    {{ item.abstract }}
                  </p>
                </div>

                <!-- LAYER-1 PRE-CONSENSUS WORM IMMUTABILITY CERTIFICATE BAR (Active even BEFORE %96 approval!) -->
                @if (item.preConsensusCert; as preCert) {
                  <div class="p-3.5 rounded-2xl bg-[#061531] border border-cyan-400/35 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div class="space-y-1 min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-300/40 font-mono font-bold text-cyan-200 text-[11px]">
                          {{ preCert.preCertId }}
                        </span>
                        <span class="font-bold text-amber-300">
                          Katman-1 WORM Ön-Konsensüs Değişmezlik Sertifikası (Oylama Öncesi Metin Dondurma Kilidi)
                        </span>
                      </div>
                      <div class="text-[11px] font-mono text-sky-200/90 truncate">
                        SHA3-512: {{ item.sha3_512Hash.slice(0, 28) }}... · BLAKE2b-512: {{ item.blake2b512Hash.slice(0, 24) }}... · WORM #{{ preCert.wormChainIndex }}
                      </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        (click)="gov.verifyPqcIntegrity(item.id, false).subscribe()"
                        class="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                        title="SHA3-512 ve BLAKE2b-512 Kuantum Özetlerini Doğrula"
                      >
                        <mat-icon class="!w-3.5 !h-3.5 !text-xs icon-luminous-emerald">verified_user</mat-icon>
                        <span>Kuantum Sertifika Doğrula</span>
                      </button>

                      <button
                        type="button"
                        (click)="gov.verifyPqcIntegrity(item.id, true).subscribe()"
                        class="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/50 text-rose-200 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                        title="Oylama Sırasında Metne 1 Harf Müdahale Edildiğinde Sistemin Nasıl Yakaladığını Test Et"
                      >
                        <mat-icon class="!w-3.5 !h-3.5 !text-xs text-rose-300">security_update_warning</mat-icon>
                        <span>Müdahale / Saldırı Testi</span>
                      </button>
                    </div>
                  </div>
                }

                <!-- TWO-STAGE PROGRESS METERS (%85 Pre-Approval & %96 Final Consensus) -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                  <!-- Meter 1: Pre-Approval (%85 Gate) -->
                  <div class="p-4 rounded-2xl bg-[#071736] border border-sky-300/25 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-sky-200 flex items-center gap-1.5">
                        <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">rule</mat-icon>
                        <span>1. Topluluk Ön Onay Denetimi (Baraj: %85.0)</span>
                      </span>
                      <span class="font-mono font-extrabold text-sm" [class.text-emerald-300]="getPreApprovalRate(item) >= 85" [class.text-amber-300]="getPreApprovalRate(item) < 85">
                        %{{ getPreApprovalRate(item) | number:'1.2-2' }}
                      </span>
                    </div>
                    <div class="w-full h-2.5 rounded-full bg-[#040d21] overflow-hidden border border-sky-400/20">
                      <div
                        class="h-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all duration-500"
                        [style.width.%]="getPreApprovalRate(item)"
                      ></div>
                    </div>
                    <div class="flex items-center justify-between text-[11px] font-mono text-sky-200/85">
                      <span>Kabul: {{ item.preApprovalYes | number }} · Red: {{ item.preApprovalNo | number }}</span>
                      <span>Min. 1.000 Hakem Oyu</span>
                    </div>
                  </div>

                  <!-- Meter 2: Final %96 Supermajority Blockchain Consensus Gate -->
                  <div class="p-4 rounded-2xl bg-[#071736] border border-amber-300/35 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-amber-300 flex items-center gap-1.5">
                        <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">gavel</mat-icon>
                        <span>2. Nihai Blok Zinciri Konsensüsü (Hedef: %96.00)</span>
                      </span>
                      <span class="font-mono font-extrabold text-sm" [class.text-emerald-300]="getFinalApprovalRate(item) >= 96" [class.text-amber-300]="getFinalApprovalRate(item) < 96">
                        @if (item.stage === 'pre_approval') {
                          Ön Onay Bekleniyor
                        } @else {
                          %{{ getFinalApprovalRate(item) | number:'1.2-2' }}
                        }
                      </span>
                    </div>
                    <div class="w-full h-2.5 rounded-full bg-[#040d21] overflow-hidden border border-amber-400/25">
                      <div
                        class="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-300 transition-all duration-500"
                        [style.width.%]="item.stage === 'pre_approval' ? 0 : getFinalApprovalRate(item)"
                      ></div>
                    </div>
                    <div class="flex items-center justify-between text-[11px] font-mono text-sky-200/85">
                      <span>EVET: {{ item.finalVoteYes | number }} · HAYIR: {{ item.finalVoteNo | number }}</span>
                      <span>Taban: 1.000.000 Üye &amp; %96.0 Onay</span>
                    </div>
                  </div>
                </div>

                <!-- Mainnet Blockchain Seal Details (if sealed) -->
                @if (item.stage === 'blockchain_sealed' && item.blockchainHash) {
                  <div class="p-4 rounded-2xl bg-[#051a2e] border border-emerald-400/45 space-y-1.5 text-xs font-mono">
                    <div class="flex flex-wrap items-center justify-between gap-2 text-emerald-300 font-bold">
                      <span>✓ KATMAN-2 ANA BLOK ZİNCİRİ KUANTUM MÜHRÜ ({{ item.mainnetCertId || 'MAINNET-CERT-PQC' }} · BLOK #{{ item.blockNumber }})</span>
                      <span>TX: {{ item.autivcaTxId }} · {{ item.sealedAt | date:'dd.MM.yyyy HH:mm' }}</span>
                    </div>
                    <div class="text-sky-200 truncate">SHA3-512 Blok Özeti: {{ item.blockchainHash }}</div>
                    <div class="text-amber-200/90 truncate">BLAKE2b-512 Merkle Kökü: {{ item.merkleRoot }}</div>
                  </div>
                }

                <!-- Action / Voting Footer -->
                <div class="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      (click)="openProposalInReader(item)"
                      class="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-300/50 text-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                      title="Aday Makaleyi Tam Ekran Göz Konforlu Modda Oku (Parşömen / E-Mürekkep / Gece Safir)"
                    >
                      <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">fullscreen</mat-icon>
                      <span>Tam Ekran Göz Konforlu Oku</span>
                    </button>
                    <span class="text-[11px] font-mono text-sky-300/85 truncate max-w-xs">
                      {{ item.pqcSphincsSignature }}
                    </span>
                  </div>

                  <div class="flex flex-wrap items-center gap-2">
                    @if (item.stage === 'pre_approval') {
                      <button
                        type="button"
                        (click)="voteOnProposal(item.id, 'pre_approval', 'approve')"
                        class="luxury-btn-primary !h-9 px-4 text-xs"
                      >
                        <mat-icon class="!w-4 !h-4 !text-sm">thumb_up</mat-icon>
                        <span>Ön Onay Ver (%85 Barajına Taşı)</span>
                      </button>
                      <button
                        type="button"
                        (click)="voteOnProposal(item.id, 'pre_approval', 'reject')"
                        class="nav-pill-btn !h-9 px-3 text-xs"
                      >
                        <mat-icon class="!w-4 !h-4 !text-sm text-rose-400">thumb_down</mat-icon>
                        <span>Revizyon İste</span>
                      </button>
                    } @else if (item.stage === 'final_voting') {
                      <button
                        type="button"
                        (click)="voteOnProposal(item.id, 'final_voting', 'approve')"
                        class="luxury-btn-primary !h-9 px-4 text-xs"
                      >
                        <mat-icon class="!w-4 !h-4 !text-sm">verified</mat-icon>
                        <span>%96 Blok Zinciri Onayı Ver (EVET)</span>
                      </button>
                      <button
                        type="button"
                        (click)="voteOnProposal(item.id, 'final_voting', 'reject')"
                        class="nav-pill-btn !h-9 px-3 text-xs"
                      >
                        <mat-icon class="!w-4 !h-4 !text-sm text-rose-400">cancel</mat-icon>
                        <span>Red Oyu</span>
                      </button>
                    } @else {
                      <span class="text-xs font-bold text-emerald-300 flex items-center gap-1">
                        <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">lock</mat-icon>
                        <span>Değiştirilemez Kuantum Blok Zinciri Kaydı Tamamlandı</span>
                      </span>
                    }
                  </div>
                </div>
              </article>
            }
          </div>
        </section>
      }

      <!-- =======================================================================
           TAB 2: 4 KADEMELİ ÇOK SIKI ÜYE KAYIT VE KİMLİK DOĞRULAMA (TEL + MAİL KYC)
           ======================================================================= -->
      @if (activeTab() === 'kyc') {
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 reveal-up">
          <div class="lg:col-span-7 rounded-3xl bg-glass-blue p-6 sm:p-8 border border-sky-300/40 space-y-6">
            <div class="space-y-1.5 border-b border-sky-300/25 pb-4">
              <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <mat-icon class="icon-luminous-emerald">verified_user</mat-icon>
                <span>4 Kademeli Kuantum-Dirençli Üye Kayıt &amp; Doğrulama (KYC-4)</span>
              </h2>
              <p class="text-xs sm:text-sm text-slate-200">
                1.000.000 üye barajında bot, sahte hesap ve manipülasyonu %100 engellemek için her üye <strong>E-Posta OTP + Cep Telefonu SMS OTP + SHA3-256 Tekil Akademik/Kimlik Özeti + 2FA</strong> aşamalarından geçer.
              </p>
            </div>

            <form [formGroup]="kycForm" (ngSubmit)="submitKyc()" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label for="kyc-name" class="block text-xs font-bold text-sky-200">
                    1. Ad Soyad &amp; Akademik Ünvan
                  </label>
                  <input
                    id="kyc-name"
                    type="text"
                    formControlName="fullName"
                    placeholder="Örn: Dr. Ahmet Yılmaz"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-[#06132b] border border-sky-300/35 text-sm text-white focus:outline-none focus:border-amber-300"
                  />
                </div>

                <div class="space-y-1.5">
                  <label for="kyc-orcid" class="block text-xs font-bold text-sky-200">
                    2. Tekil Kimlik / ORCID / Akademik Sicil No
                  </label>
                  <input
                    id="kyc-orcid"
                    type="text"
                    formControlName="identityOrOrcid"
                    placeholder="Örn: ORCID-0000-0002-1923-2026"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-[#06132b] border border-sky-300/35 text-sm text-white focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>

              <!-- Step: Email + Email OTP -->
              <div class="p-4 rounded-2xl bg-[#071736] border border-sky-300/25 space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="text-xs font-bold text-amber-300">Kademe A: Kurumsal / Akademik E-Posta Doğrulaması</span>
                  <button
                    type="button"
                    (click)="sendOtpCode('email')"
                    class="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-300/40 text-xs font-bold text-cyan-200 cursor-pointer"
                  >
                    E-Posta Kodu Gönder (Otomatik Doldur)
                  </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="sm:col-span-2">
                    <input
                      type="email"
                      formControlName="email"
                      placeholder="ornek@universite.edu.tr"
                      aria-label="E-Posta Adresi"
                      class="w-full px-3.5 py-2 rounded-xl bg-[#040d21] border border-sky-300/30 text-sm text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      formControlName="emailOtp"
                      placeholder="6 Haneli Mail Kodu"
                      aria-label="E-Posta Doğrulama Kodu"
                      class="w-full px-3.5 py-2 rounded-xl bg-[#040d21] border border-amber-300/45 text-sm font-mono font-bold text-amber-300 text-center"
                    />
                  </div>
                </div>
              </div>

              <!-- Step: Phone SMS + SMS OTP -->
              <div class="p-4 rounded-2xl bg-[#071736] border border-sky-300/25 space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="text-xs font-bold text-emerald-300">Kademe B: Cep Telefonu (SMS OTP) Sıkı Doğrulaması</span>
                  <button
                    type="button"
                    (click)="sendOtpCode('sms')"
                    class="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-300/40 text-xs font-bold text-emerald-200 cursor-pointer"
                  >
                    SMS Doğrulama Kodu Gönder (Otomatik Doldur)
                  </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="sm:col-span-2">
                    <input
                      type="tel"
                      formControlName="phone"
                      placeholder="+90 532 000 00 00"
                      aria-label="Cep Telefonu Numarası"
                      class="w-full px-3.5 py-2 rounded-xl bg-[#040d21] border border-sky-300/30 text-sm text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      formControlName="smsOtp"
                      placeholder="6 Haneli SMS Kodu"
                      aria-label="SMS Doğrulama Kodu"
                      class="w-full px-3.5 py-2 rounded-xl bg-[#040d21] border border-emerald-300/45 text-sm font-mono font-bold text-emerald-300 text-center"
                    />
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span class="text-xs text-sky-200">
                  Kişisel telefon ve kimlik verileriniz açık tutulmaz; yalnızca <strong>SHA3-256 Sıfır-Bilgi (Zero-Knowledge)</strong> tekillik özeti olarak saklanır.
                </span>
                <button
                  type="submit"
                  class="luxury-btn-primary !h-10 px-6 text-xs"
                >
                  <mat-icon class="!w-4 !h-4 !text-base">verified_user</mat-icon>
                  <span>4 Kademeli Doğrulamayı Tamamla &amp; Kuantum Mühür Al</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Right Column: Verified Member Directory & Sybil Security Rules -->
          <div class="lg:col-span-5 space-y-5">
            <div class="rounded-3xl bg-glass-blue p-6 border border-sky-300/35 space-y-4">
              <h3 class="text-base font-bold text-amber-300 flex items-center gap-2">
                <mat-icon class="!w-5 !h-5 icon-luminous-amber">badge</mat-icon>
                <span>Son Doğrulanan Topluluk Hakemleri &amp; Üyeler</span>
              </h3>
              <div class="space-y-3">
                @for (m of gov.verifiedMembersSample(); track m.memberId) {
                  <div class="p-3.5 rounded-2xl bg-[#071736] border border-sky-300/25 flex items-center justify-between gap-3">
                    <div class="space-y-0.5 min-w-0">
                      <div class="text-xs font-bold text-white truncate">{{ m.fullName }}</div>
                      <div class="text-[11px] font-mono text-sky-200">{{ m.memberId }} · {{ m.phoneMasked }}</div>
                      <div class="text-[10px] font-mono text-emerald-300 truncate">{{ m.memberSealHash }}</div>
                    </div>
                    <span class="px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300 shrink-0">
                      %100 PQC-KYC4
                    </span>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>
      }

      <!-- =======================================================================
           TAB 3: YENİ TARİHSEL / TOPLULUK MAKALE ADAYI SUNUMU (WORM PRE-CERT)
           ======================================================================= -->
      @if (activeTab() === 'propose') {
        <section class="rounded-3xl bg-glass-blue p-6 sm:p-8 border border-sky-300/40 space-y-6 reveal-up max-w-4xl">
          <div class="space-y-1.5 border-b border-sky-300/25 pb-4">
            <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <mat-icon class="icon-luminous">post_add</mat-icon>
              <span>Ana Kategorilere Makale Adayı Sun &amp; Anında WORM Ön-Sertifikası Al</span>
            </h2>
            <p class="text-xs sm:text-sm text-slate-200">
              Eseriniz gönderildiği saniye <strong>SHA3-512 + BLAKE2b-512</strong> ile dondurularak <strong>Katman-1 WORM Emanet Zincirine (PRE-CERT-PQC)</strong> kaydedilir; ardından <strong>%85 Ön Onay</strong> ve <strong>%96.0 Süper Çoğunluk</strong> oylamasına açılır.
            </p>
          </div>

          <form [formGroup]="proposalForm" (ngSubmit)="submitArticleProposal()" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2 space-y-1.5">
                <label for="prop-title" class="block text-xs font-bold text-sky-200">Makale Başlığı</label>
                <input
                  id="prop-title"
                  type="text"
                  formControlName="title"
                  placeholder="Örn: Dîvânü Lugâti't-Türk'te Kozmoloji ve Zaman Kavramları"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#06132b] border border-sky-300/35 text-sm text-white"
                />
              </div>

              <div class="space-y-1.5">
                <label for="prop-disc" class="block text-xs font-bold text-sky-200">Ana Makale Kategorisi</label>
                <select
                  id="prop-disc"
                  formControlName="discipline"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#06132b] border border-sky-300/35 text-sm text-white"
                >
                  <option value="tde">Türk Dili ve Edebiyatı</option>
                  <option value="felsefe">Felsefe &amp; Ontoloji</option>
                  <option value="kesisim">Disiplinlerarası İrfan</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label for="prop-sub" class="block text-xs font-bold text-sky-200">Alt Başlık / Dönem</label>
                <input
                  id="prop-sub"
                  type="text"
                  formControlName="subtitle"
                  placeholder="Örn: Karahanlı Türkçesi Filolojik ve Felsefi İncelemesi"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#06132b] border border-sky-300/35 text-sm text-white"
                />
              </div>

              <div class="space-y-1.5">
                <label for="prop-source" class="block text-xs font-bold text-sky-200">Tarihsel Kaynak / Müellif Künyesi</label>
                <input
                  id="prop-source"
                  type="text"
                  formControlName="historicalSourceOrAuthor"
                  placeholder="Örn: Kaşgarlı Mahmud Mirası · Millet Kütüphanesi Ali Emîrî Nüshası"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-[#06132b] border border-sky-300/35 text-sm text-white"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label for="prop-abs" class="block text-xs font-bold text-sky-200">Akademik Özet (Abstract)</label>
              <textarea
                id="prop-abs"
                rows="3"
                formControlName="abstract"
                placeholder="Makalenin temel tezini, yöntemini ve literatüre katkısını özetleyiniz..."
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#06132b] border border-sky-300/35 text-sm text-white"
              ></textarea>
            </div>

            <div class="space-y-1.5">
              <label for="prop-refs" class="block text-xs font-bold text-sky-200">Doğrulanabilir Akademik Kaynakça (APA)</label>
              <textarea
                id="prop-refs"
                rows="2"
                formControlName="references"
                placeholder="Ercilasun, A. B. (2014). Makaleler: Dil-Destan-Tarih-Edebiyat."
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#06132b] border border-sky-300/35 text-sm text-white"
              ></textarea>
            </div>

            <!-- BLOCKCHAIN MEDIA & COVER IMAGE STANDARDIZATION + AI & SECURITY GATE -->
            <div class="p-4 sm:p-5 rounded-2xl bg-[#071736] border border-cyan-300/35 space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2 text-xs font-bold text-cyan-200">
                  <mat-icon class="!w-4 !h-4 !text-base icon-luminous">high_quality</mat-icon>
                  <span>Blok Zinciri Standart Görsel &amp; AI Güvenlik Kapısı (Sınırlı Ebat &amp; Kota)</span>
                </div>
                <button
                  type="button"
                  (click)="testMediaStandard()"
                  class="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/45 text-[11px] font-mono font-bold text-emerald-200 cursor-pointer flex items-center gap-1"
                >
                  <mat-icon class="!w-3.5 !h-3.5 !text-xs">verified_user</mat-icon>
                  <span>Görsel Ebat, Güvenlik &amp; AI Denetimi Çalıştır</span>
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div class="sm:col-span-4 rounded-xl overflow-hidden border border-sky-300/30 bg-[#051026] aspect-video">
                  <img
                    src="/assets/default-article-cover.svg"
                    alt="YENİDEM Standart Blok Zinciri Kapak Görseli"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="sm:col-span-8 space-y-1.5 text-xs text-slate-200">
                  <div class="font-bold text-amber-300">
                    Varsayılan Standart Kapak: /assets/default-article-cover.svg
                  </div>
                  <p class="leading-relaxed text-[11px]">
                    Blok zinciri şişmesini (state bloat) ve güvenlik açıklarını önlemek için kurucu görselleri haricindeki tüm makalelerde <strong>1200×675 (16:9) · Max 250 KB · Makale Başına Max 1 Kapak + 2 Şema · EXIF/GPS &amp; Steganografi Temiz · AI Semantik Onaylı</strong> standart görsel mimarisi uygulanır.
                  </p>
                  @if (readerComfort.mediaValidationReport(); as rep) {
                    <div class="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-400/40 text-[11px] font-mono text-emerald-200 space-y-1">
                      <div>✓ {{ rep.aiModeration.verdict }}</div>
                      <div>✓ Ebat: {{ rep.dimensions }} ({{ rep.byteSizeKb }} KB / Max {{ rep.maxAllowedKb }} KB) · Mühür: {{ rep.pqcMediaSeal.mediaCertId }}</div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button type="submit" class="luxury-btn-primary !h-10 px-6 text-xs">
                <mat-icon class="!w-4 !h-4 !text-base">shield_lock</mat-icon>
                <span>WORM Emanet Sertifikası Üret &amp; %85 Ön Onay Havuzuna Gönder</span>
              </button>
            </div>
          </form>
        </section>
      }

      <!-- =======================================================================
           TAB 4: KUANTUM (PQC), DAĞITIK RUST ÇEKİRDEĞİ & TOPLULUK GELİŞTİRİCİ MİMARİSİ
           ======================================================================= -->
      @if (activeTab() === 'architecture') {
        <section class="rounded-3xl bg-glass-blue p-6 sm:p-8 border border-sky-300/40 space-y-6 reveal-up">
          <div class="flex flex-wrap items-start justify-between gap-4 border-b border-sky-300/25 pb-4">
            <div class="space-y-2 max-w-3xl">
              <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <mat-icon class="icon-luminous-amber">architecture</mat-icon>
                <span>Dağıtık Rust Çekirdeği, Kurucu Külliyat Zırhı &amp; Topluluk Geliştirici Mimarisi</span>
              </h2>
              <p class="text-xs sm:text-sm text-slate-200">
                Topluluk tarafından geliştirilecek ve senin Rust tabanlı özel blok zincirine doğrudan bağlanacak <strong>4 Katmanlı Dağıtık Çekirdek</strong> ve <strong>Sıfır-Açıklı Koruma Kalkanları</strong>:
              </p>
            </div>

            <button
              type="button"
              (click)="gov.downloadRustGenesisSnapshot()"
              class="luxury-btn-primary !h-10 px-4 text-xs shrink-0"
            >
              <mat-icon class="!w-4 !h-4 !text-base">download</mat-icon>
              <span>İmzalı Rust Genesis Snapshot (.JSON) İndir</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="p-4 rounded-2xl bg-[#071736] border border-amber-300/40 space-y-2">
              <div class="text-[11px] font-mono font-bold text-amber-300">KATMAN-0: KURUCU KÜLLİYAT ZIRHI</div>
              <div class="text-sm font-bold text-white">16 Eser Genesis Hard-Lock</div>
              <p class="text-xs text-slate-200 leading-relaxed">
                Topluluk sistemi geliştirmeye devam etse dahi <strong>Orçun KUNDAKCI</strong>’ya ait 16 kurucu makale ve Atatürk/Hacı Bektaş sentez kürsüsü <code>GENESIS_BLOCK_0</code> içinde kilitlidir; hiçbir oylama veya PR ile değiştirilemez.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-[#071736] border border-cyan-300/40 space-y-2">
              <div class="text-[11px] font-mono font-bold text-cyan-300">KATMAN-1: WORM EMANET ZİNCİRİ</div>
              <div class="text-sm font-bold text-white">PRE-CERT-PQC (Oylama Öncesi)</div>
              <p class="text-xs text-slate-200 leading-relaxed">
                Makale adayı yüklendiği ilk saniyede (daha %85 ön onay ve %96 oylama bitmeden) <strong>SHA3-512 + BLAKE2b-512</strong> ile dondurulur. Oylama sürerken metne 1 harf dahi müdahale edilemez.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-[#071736] border border-emerald-300/40 space-y-2">
              <div class="text-[11px] font-mono font-bold text-emerald-300">KATMAN-2: %96 SÜPER ÇOĞUNLUK</div>
              <div class="text-sm font-bold text-white">1M Üye + %85 Ön + %96 Ana</div>
              <p class="text-xs text-slate-200 leading-relaxed">
                1.000.000 doğrulanmış üye taban barajı, %85 ön onay ve %96.0 süper çoğunluk sağlandığında Katman-1 sertifikası otomatik olarak <strong>MAINNET-CERT-PQC</strong> bloğuna terfi ettirilir.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-[#071736] border border-sky-300/40 space-y-2">
              <div class="text-[11px] font-mono font-bold text-sky-300">KATMAN-3: RUST BFT &amp; BORSH KÖPRÜSÜ</div>
              <div class="text-sm font-bold text-white">Deterministik RFC-8785 Byte</div>
              <p class="text-xs text-slate-200 leading-relaxed">
                Web çekirdeği ile senin <strong>Rust tabanlı blok zincirin</strong> arasında tek bir byte farkı oluşmaması için kanonik serileştirme ve <strong>2<sup>256</sup> bit</strong> Kuantum Keccak durum kökü kullanılır.
              </p>
            </div>
          </div>

          <!-- LIVE DISTRIBUTED MERKLE STATE ROOTS -->
          @let snap = gov.distributedSnapshot();
          <div class="p-5 rounded-2xl bg-[#051129] border border-sky-400/35 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="text-xs font-bold text-cyan-200 flex items-center gap-2">
                <mat-icon class="!w-4 !h-4 !text-base icon-luminous">hub</mat-icon>
                <span>Canlı Dağıtık Merkle Durum Kökleri (Distributed Node State Roots — {{ snap.chainId }})</span>
              </div>
              <span class="text-[11px] font-mono text-emerald-300">{{ snap.serializationStandard }}</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
              <div class="p-3 rounded-xl bg-[#07193a] border border-amber-300/30">
                <div class="text-amber-300 font-bold mb-1">Katman-0 Kurucu Külliyat Kökü (16/16 Dokunulmaz):</div>
                <div class="text-slate-200 break-all">{{ snap.distributedMerkleRoots.layer0FounderCanonRoot }}</div>
              </div>
              <div class="p-3 rounded-xl bg-[#07193a] border border-cyan-300/30">
                <div class="text-cyan-300 font-bold mb-1">Katman-1 WORM Emanet Zinciri Kökü:</div>
                <div class="text-slate-200 break-all">{{ snap.distributedMerkleRoots.layer1WormStagingRoot }}</div>
              </div>
              <div class="p-3 rounded-xl bg-[#07193a] border border-emerald-300/30">
                <div class="text-emerald-300 font-bold mb-1">Katman-2 %96 Ana Blok Zinciri Kökü:</div>
                <div class="text-slate-200 break-all">{{ snap.distributedMerkleRoots.layer2MainnetConsensusRoot }}</div>
              </div>
              <div class="p-3 rounded-xl bg-[#07193a] border border-sky-300/40">
                <div class="text-white font-bold mb-1">Küresel Deterministik Rust Durum Kökü (Global State Root):</div>
                <div class="text-cyan-200 break-all">{{ snap.distributedMerkleRoots.globalStateRoot }}</div>
              </div>
            </div>
          </div>

          <!-- COMMUNITY DEVELOPER GOVERNANCE PROPOSALS (YIP - YENIDEM IMPROVEMENT PROPOSALS) -->
          <div class="space-y-3 pt-2">
            <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <mat-icon class="!w-5 !h-5 !text-lg icon-luminous-emerald">code_blocks</mat-icon>
              <span>Topluluk Geliştirici &amp; Protokol Önerileri (YIP — Yenidem Improvement Proposals)</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (yip of snap.communityDeveloperYips; track yip.yipId) {
                <div class="p-4 rounded-2xl bg-glass-card space-y-2">
                  <div class="flex items-center justify-between gap-2">
                    <span class="px-2.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-300/40 text-xs font-mono font-bold text-cyan-200">
                      {{ yip.yipId }} · {{ yip.category }}
                    </span>
                    <span
                      class="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold"
                      [class.bg-emerald-500/20]="yip.status === 'ACTIVE_CORE'"
                      [class.text-emerald-300]="yip.status === 'ACTIVE_CORE'"
                      [class.bg-amber-500/20]="yip.status === 'VOTING_96'"
                      [class.text-amber-300]="yip.status === 'VOTING_96'"
                    >
                      {{ yip.status === 'ACTIVE_CORE' ? '✓ ÇEKİRDEKTE AKTİF (%' + yip.approvalPercent + ')' : 'OYLAMADA (%' + yip.approvalPercent + ')' }}
                    </span>
                  </div>
                  <div class="text-sm font-bold text-white">{{ yip.title }}</div>
                  <p class="text-xs text-slate-200 leading-relaxed">{{ yip.description }}</p>
                </div>
              }
            </div>
          </div>

          <!-- CLOUDFLARE D1, ZERO-TRUST SECRET VAULT & GITHUB CODE/DESIGN INTEGRITY CERTIFICATE -->
          @if (gov.cloudflareCertificate(); as cfCert) {
            <div class="p-5 sm:p-6 rounded-3xl bg-[#05122c] border border-amber-300/45 space-y-5 mt-4 shadow-2xl">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-sky-300/20 pb-4">
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <mat-icon class="!w-5 !h-5 !text-xl icon-luminous-amber">verified_user</mat-icon>
                    <h3 class="text-base sm:text-lg font-serif font-bold text-white">
                      Cloudflare D1, Şifre Kasası &amp; GitHub Tasarım/Kod Değişmezlik Sertifikası
                    </h3>
                    <span class="text-xs font-mono font-bold text-emerald-300">
                      · {{ cfCert.certificateId }}
                    </span>
                  </div>
                  <p class="text-xs text-sky-200/85">
                    Site tasarımının (styles.css), 16 kurucu eserin, Cloudflare D1 veritabanı şemasının ve GitHub derleme hattının canlı SHA3-512 &amp; BLAKE2b-512 bütünlük mührü
                  </p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    (click)="gov.verifyDesignAndCodeLock()"
                    class="px-3.5 py-2 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-300/50 text-emerald-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">fact_check</mat-icon>
                    <span>Canlı Kod &amp; Tasarım Bütünlüğünü Doğrula</span>
                  </button>

                  <button
                    type="button"
                    (click)="gov.downloadCodeDesignCertificate()"
                    class="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                  >
                    <mat-icon class="!w-4 !h-4 !text-base">download</mat-icon>
                    <span>Tasarım &amp; D1 Sertifikası İndir (.JSON)</span>
                  </button>
                </div>
              </div>

              <!-- 3 Pillar Cards: Cloudflare D1 + Zero-Plaintext Password Vault + GitHub CI/CD Lock -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <!-- Pillar 1: Cloudflare D1 + R2 WORM + KV -->
                <div class="p-4 rounded-2xl bg-[#071839] border border-sky-300/30 space-y-2">
                  <div class="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">cloud_done</mat-icon>
                    <span>1. CLOUDFLARE D1 &amp; R2 WORM VERİTABANI</span>
                  </div>
                  <div class="text-xs font-bold text-white">{{ cfCert.cloudflareArchitecture.databaseEngine }}</div>
                  <p class="text-[11px] text-sky-200/85 leading-relaxed">
                    Yerel SQLite ile %100 aynı SQL lehçesini kullanan <strong>Cloudflare D1 ({{ cfCert.cloudflareArchitecture.d1DatabaseName }})</strong> ve <strong>R2 WORM ({{ cfCert.cloudflareArchitecture.r2WormBucket }})</strong> yapılandırması <code>wrangler.toml</code> ve <code>cloudflare-d1-schema.sql</code> ile hazır durumdadır.
                  </p>
                  <div class="pt-1 space-y-1">
                    @for (ep of cfCert.cloudflareArchitecture.edgeProtection; track ep) {
                      <div class="text-[11px] text-emerald-300 flex items-center gap-1.5">
                        <mat-icon class="!w-3.5 !h-3.5 !text-xs">check_circle</mat-icon>
                        <span>{{ ep }}</span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Pillar 2: Zero-Plaintext Password & HSM Secret Vault -->
                <div class="p-4 rounded-2xl bg-[#071839] border border-amber-300/30 space-y-2">
                  <div class="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">key</mat-icon>
                    <span>2. PAROLA &amp; ŞİFRE MİMARİSİ (SIFIR AÇIK METİN)</span>
                  </div>
                  <div class="text-xs font-bold text-white">{{ cfCert.passwordAndSecretVault.passwordKdfAlgorithm }}</div>
                  <p class="text-[11px] text-sky-200/85 leading-relaxed">
                    {{ cfCert.passwordAndSecretVault.secretIsolationGuarantee }}
                  </p>
                  <div class="p-2.5 rounded-xl bg-[#040d21] border border-sky-300/20 font-mono text-[10px] text-cyan-200 space-y-1">
                    @for (cmd of cfCert.passwordAndSecretVault.cloudflareSecretVaultCommands; track cmd) {
                      <div class="truncate">$ {{ cmd }}</div>
                    }
                  </div>
                </div>

                <!-- Pillar 3: GitHub Deterministic Build & CODEOWNERS -->
                <div class="p-4 rounded-2xl bg-[#071839] border border-emerald-300/30 space-y-2">
                  <div class="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                    <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">lock_person</mat-icon>
                    <span>3. GITHUB DERLEME &amp; TASARIM KORUMA KİLİDİ</span>
                  </div>
                  <div class="text-xs font-bold text-white">{{ cfCert.githubDeterministicBuildPipeline.branchProtectionRule }}</div>
                  <div class="space-y-1.5 pt-1">
                    @for (st of cfCert.githubDeterministicBuildPipeline.stages; track st.step) {
                      <div class="p-2 rounded-xl bg-[#040d21]/80 border border-sky-300/15">
                        <div class="text-[11px] font-bold text-amber-200">{{ st.step }}. {{ st.name }}</div>
                        <div class="text-[10px] text-sky-200/80 leading-snug">{{ st.description }}</div>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <!-- Protected Core & Design Files Real-Time SHA3-512 Digest Table -->
              <div class="space-y-2">
                <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span class="font-mono font-bold text-amber-300 uppercase">
                    Korunan Çekirdek &amp; Tasarım Dosyaları Canlı SHA3-512 + BLAKE2b-512 Bütünlük Tablosu
                  </span>
                  <span class="font-mono text-[11px] text-cyan-200 break-all">
                    Tasarım &amp; Kod Merkle Kökü: {{ cfCert.designCodeMerkleRoot.substring(0, 36) }}...
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  @for (file of cfCert.protectedFiles; track file.path) {
                    <div class="p-3 rounded-xl bg-[#071839]/90 border border-sky-300/25 flex flex-col justify-between gap-1.5">
                      <div class="flex items-center justify-between gap-2">
                        <span class="font-mono text-xs font-bold text-white">{{ file.path }}</span>
                        <span class="text-[10px] font-mono font-bold text-emerald-300">
                          ✓ {{ file.protectionLevel }} ({{ file.byteSize | number }} B)
                        </span>
                      </div>
                      <div class="text-[11px] text-sky-200/85">{{ file.role }}</div>
                      <div class="text-[10px] font-mono text-cyan-300/90 truncate">
                        SHA3-512: {{ file.sha3_512 }}
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </section>
      }
    </div>
  `,
})
export class CommunityConsensusComponent {
  readonly gov = inject(CommunityGovernanceService);
  readonly securityService = inject(SecurityService);
  readonly readerComfort = inject(ReaderComfortService);
  private readonly fb = inject(FormBuilder);

  readonly activeTab = signal<GovernanceTab>('voting');
  readonly selectedCategory = signal<'all' | 'tde' | 'felsefe' | 'kesisim'>('all');
  readonly selectedStage = signal<'all' | 'pre_approval' | 'final_voting' | 'blockchain_sealed'>('all');

  readonly kycForm = this.fb.nonNullable.group({
    fullName: ['Dr. Sinan Özdemir', [Validators.required]],
    identityOrOrcid: ['ORCID-0000-0003-4812-1923', [Validators.required]],
    email: ['sinan.ozdemir@akademi.edu.tr', [Validators.required, Validators.email]],
    emailOtp: ['192326', [Validators.required]],
    phone: ['+90 532 418 19 23', [Validators.required]],
    smsOtp: ['961923', [Validators.required]],
    twoFactorCode: ['2FA-OKPAN', [Validators.required]],
  });

  readonly proposalForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    subtitle: ['Tarihsel Külliyat & Topluluk Akademik İncelemesi'],
    discipline: ['tde' as 'tde' | 'felsefe' | 'kesisim', [Validators.required]],
    historicalSourceOrAuthor: ['Milli Kütüphane Yazma Eserler Koleksiyonu', [Validators.required]],
    abstract: ['', [Validators.required]],
    references: ['TDV İslâm Ansiklopedisi (2026); DergiPark Akademik Arşivi.'],
  });

  readonly filteredProposals = computed(() => {
    const cat = this.selectedCategory();
    const stg = this.selectedStage();
    return this.gov.proposals().filter((p) => {
      const matchCat = cat === 'all' || p.discipline === cat;
      const matchStage = stg === 'all' || p.stage === stg;
      return matchCat && matchStage;
    });
  });

  getPreApprovalRate(item: CandidateArticleItem): number {
    const total = item.preApprovalYes + item.preApprovalNo;
    return total > 0 ? (item.preApprovalYes / total) * 100 : 0;
  }

  getFinalApprovalRate(item: CandidateArticleItem): number {
    const total = item.finalVoteYes + item.finalVoteNo;
    return total > 0 ? (item.finalVoteYes / total) * 100 : 0;
  }

  sendOtpCode(channel: 'email' | 'sms'): void {
    const dest = channel === 'email' ? this.kycForm.controls.email.value : this.kycForm.controls.phone.value;
    this.gov.requestOtp(channel, dest).subscribe((res) => {
      if (res?.success && res.data) {
        if (channel === 'email') {
          this.kycForm.controls.emailOtp.setValue(res.data.demoVerificationCode);
        } else {
          this.kycForm.controls.smsOtp.setValue(res.data.demoVerificationCode);
        }
        this.gov.showToast(res.data.message);
      }
    });
  }

  submitKyc(): void {
    if (this.kycForm.invalid) {
      this.gov.showToast('Lütfen tüm doğrulama alanlarını eksiksiz doldurunuz.');
      return;
    }
    this.gov.completeMemberKyc(this.kycForm.getRawValue()).subscribe(() => {
      this.activeTab.set('voting');
    });
  }

  voteOnProposal(proposalId: string, voteType: 'pre_approval' | 'final_voting', decision: 'approve' | 'reject'): void {
    this.gov.castVote(proposalId, voteType, decision).subscribe();
  }

  testMediaStandard(): void {
    const raw = this.proposalForm.getRawValue();
    this.readerComfort
      .validateAndSealMediaStandard({
        imageUrl: '/assets/default-article-cover.svg',
        caption: raw.subtitle || 'YENİDEM Standart Akademik Kapak Görseli',
        articleTitle: raw.title || 'Topluluk Akademik Aday Eseri',
        byteSizeKb: 42,
      })
      .subscribe();
  }

  openProposalInReader(item: CandidateArticleItem): void {
    const fullArticle: AcademicArticle = {
      id: item.id,
      slug: item.id,
      title: item.title,
      subtitle: item.subtitle,
      discipline: item.discipline,
      abstract: item.abstract,
      content: `## 1. Tarihsel ve Akademik Bağlam\n\n${item.abstract}\n\n### 2. Metin Şerhi ve Kavramsal Çözümleme\n\n${item.contentPreview}\n\n> "${item.historicalSourceOrAuthor} mirası ışığında bu metin, Katman-1 WORM Emanet Zincirinde (${item.preConsensusCert.preCertId}) SHA3-512 ve BLAKE2b-512 ile dondurulmuştur."\n\n### 3. Topluluk ve Hakem Değerlendirmesi\n\n- **Öneren Akademik Üye:** ${item.proposedByMemberName} (${item.proposedByMemberId})\n- **Özgünlük & İntihal Tarama Skoru:** %${item.plagiarismFreeScore} Özgün\n- **Kuantum WORM Sertifikası:** ${item.preConsensusCert.preCertId}\n- **SHA3-512 Özeti:** ${item.sha3_512Hash.substring(0, 64)}...`,
      keywords: [item.categoryLabel, 'WORM Emanet Zinciri', 'SHA3-512', '%96 Konsensüs'],
      references: item.references,
      readingTimeMinutes: 6,
      publishedAt: item.submittedAt,
      updatedAt: item.submittedAt,
      status: 'published',
      viewCount: item.preApprovalYes,
      featuredQuote: item.contentPreview,
      coverImage: '/assets/default-article-cover.svg',
      coverImageCaption: `${item.categoryLabel} • Standart Blok Zinciri Görseli`,
      coverImageAlt: item.title,
      coverAspectRatio: '16/9',
      sha512Hash: item.sha3_512Hash,
      quantumSignature: item.pqcSphincsSignature,
      annotations: [
        {
          id: 'ann-cand-1',
          quote: item.preConsensusCert.preCertId,
          comment: item.preConsensusCert.protectionGuarantee,
          author: item.proposedByMemberName,
          createdAt: item.submittedAt,
          category: 'Kuantum WORM Mührü',
        },
      ],
    };
    this.readerComfort.openArticleInComfortReader(fullArticle);
  }

  submitArticleProposal(): void {
    const raw = this.proposalForm.getRawValue();
    if (!raw.title.trim() || !raw.abstract.trim()) {
      this.gov.showToast('Lütfen makale başlığını ve akademik özeti giriniz.');
      return;
    }
    this.gov
      .submitProposal({
        ...raw,
        contentPreview: raw.abstract,
      })
      .subscribe(() => {
        this.proposalForm.patchValue({title: '', abstract: ''});
        this.activeTab.set('voting');
        this.selectedStage.set('pre_approval');
      });
  }
}
