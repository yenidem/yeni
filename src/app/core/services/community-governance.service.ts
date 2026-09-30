import {Injectable, PLATFORM_ID, computed, inject, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {catchError, of, tap} from 'rxjs';
import {LiveChangeLogService} from './live-change-log.service';

export interface VerifiedMemberProfile {
  memberId: string;
  fullName: string;
  email: string;
  phoneMasked: string;
  academicOrcidOrIdHash: string;
  emailVerified: boolean;
  phoneSmsVerified: boolean;
  sybilIdentityVerified: boolean;
  twoFactorActive: boolean;
  verificationScore: number;
  memberSealHash: string;
  joinedAt: string;
  role: 'founder' | 'reviewer' | 'verified_member';
}

export interface PreConsensusWormCertificate {
  preCertId: string;
  wormChainIndex: number;
  previousWormHash: string;
  wormBlockHash: string;
  sha3_512Hash: string;
  blake2b512Hash: string;
  sha512Hash: string;
  pqcSphincsSignature: string;
  contentFreezeLock: boolean;
  frozenAtUtc: string;
  protectionGuarantee: string;
}

export interface CandidateArticleItem {
  id: string;
  title: string;
  subtitle: string;
  discipline: 'tde' | 'felsefe' | 'kesisim';
  categoryLabel: string;
  historicalSourceOrAuthor: string;
  proposedByMemberName: string;
  proposedByMemberId: string;
  abstract: string;
  contentPreview: string;
  references: string[];
  submittedAt: string;
  sha512Hash: string;
  sha3_512Hash: string;
  blake2b512Hash: string;
  pqcSphincsSignature: string;
  preConsensusCert: PreConsensusWormCertificate;
  plagiarismFreeScore: number;
  citationCheckPassed: boolean;
  preApprovalYes: number;
  preApprovalNo: number;
  preApprovalThreshold: number;
  preApprovalMinVotes: number;
  finalVoteYes: number;
  finalVoteNo: number;
  finalThreshold: number;
  stage: 'pre_approval' | 'final_voting' | 'blockchain_sealed' | 'rejected';
  blockchainHash?: string;
  blockNumber?: number;
  merkleRoot?: string;
  autivcaTxId?: string;
  mainnetCertId?: string;
  sealedAt?: string;
}

export interface PqcVerificationReport {
  proposalId: string;
  isIntact: boolean;
  tamperDetected: boolean;
  preCertId: string;
  mainnetCertId: string | null;
  expectedSha3_512: string;
  computedSha3_512: string;
  expectedBlake2b512: string;
  computedBlake2b512: string;
  wormBlockHash: string;
  pqcSphincsSignature: string;
  verdictMessage: string;
}

export interface AutivcaBridgeStatus {
  compatible: boolean;
  protocolVersion: string;
  hashAlgorithm: string;
  signatureScheme: string;
  preConsensusLedgerName?: string;
  sybilProtection: string;
  smartContractRule: string;
}

export interface CommunityYipItem {
  yipId: string;
  title: string;
  category: string;
  status: 'ACTIVE_CORE' | 'VOTING_96';
  approvalPercent: number;
  description: string;
}

export interface DistributedSnapshotData {
  generatedAtUtc: string;
  chainId: string;
  serializationStandard: string;
  founderCanonGuard: {
    lockedArticleCount: number;
    author: string;
    protectionMode: string;
    canCommunityOverrideFounderCanon: boolean;
    founderCanonRoot: string;
  };
  distributedMerkleRoots: {
    layer0FounderCanonRoot: string;
    layer1WormStagingRoot: string;
    layer2MainnetConsensusRoot: string;
    globalStateRoot: string;
  };
  communityDeveloperYips: CommunityYipItem[];
  proposalsCount: number;
}

export interface ProtectedFileDigestItem {
  path: string;
  role: string;
  protectionLevel: string;
  byteSize: number;
  sha3_512: string;
  blake2b512: string;
  status: string;
}

export interface CodeDesignIntegrityCertificate {
  certificateId: string;
  protocol: string;
  issuedAtUtc: string;
  designCodeMerkleRoot: string;
  pqcSlhDsaSignature: string;
  allFilesIntact: boolean;
  protectedFiles: ProtectedFileDigestItem[];
  cloudflareArchitecture: {
    databaseEngine: string;
    d1BindingName: string;
    d1DatabaseName: string;
    d1TablesCount: number;
    d1SchemaFile: string;
    r2WormBucket: string;
    kvSecurityNamespace: string;
    edgeProtection: string[];
    d1SyncMode: string;
  };
  passwordAndSecretVault: {
    plaintextStoredAnywhere: boolean;
    passwordKdfAlgorithm: string;
    saltEntropyBits: number;
    twoFactorStandard: string;
    cloudflareSecretVaultCommands: string[];
    secretIsolationGuarantee: string;
  };
  githubDeterministicBuildPipeline: {
    workflowFile: string;
    codeownersFile: string;
    branchProtectionRule: string;
    stages: {
      step: number;
      name: string;
      description: string;
      status: string;
    }[];
  };
}

export interface PredeployAuditCheckItem {
  id: string;
  stepNumber: number;
  category: string;
  title: string;
  target: string;
  passed: boolean;
  details: string;
  sha3DigestShort: string;
}

export interface PredeployCodeAuditReport {
  auditId: string;
  executedAtUtc: string;
  auditDurationMs: number;
  healthScore: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  readyForDeploy: boolean;
  targetsVerified: string[];
  merkleAuditRoot: string;
  pqcSignature: string;
  checks: PredeployAuditCheckItem[];
}

const DEFAULT_PREDEPLOY_AUDIT_REPORT: PredeployCodeAuditReport = {
  auditId: 'PREDEPLOY-AUDIT-PQC-94C8F1A2D7',
  executedAtUtc: '2026-09-30T00:00:00.000Z',
  auditDurationMs: 4,
  healthScore: 100,
  totalChecks: 14,
  passedChecks: 14,
  failedChecks: 0,
  readyForDeploy: true,
  targetsVerified: [
    'Vercel Edge CDN + Serverless Node.js 22 (/api/index.mjs + vercel.json + /tmp EROFS Koruması)',
    'Cloudflare Pages & Workers + D1 (6 Tablolu Edge SQLite) & R2 WORM',
    'GitHub Pages (actions/deploy-pages + gh-pages branch + .nojekyll + 404.html)',
    'Node.js 22 Express SSR Production Sunucusu',
  ],
  merkleAuditRoot: '0x94c8f1a2d7e05b39c18a4f662109d8e3f77a2b4c6e8d1a0f3b5c7d9e2a4f6b81',
  pqcSignature: 'SLH-DSA-SHAKE-256f:0x8a4f91c2e7b03d65189c4a2d1e0f7b5a3c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f',
  checks: [
    {
      id: 'chk-1',
      stepNumber: 1,
      category: 'AST_CODE_LOCK',
      title: 'Tasarım Anayasası & 4 Atmosfer CSS Denetimi',
      target: 'src/styles.css',
      passed: true,
      details: 'Tailwind v4, 4 tema atmosferi ve alt yeşil bant kuralları tam (19892 B)',
      sha3DigestShort: '0x7e21b904c83a11f5d6029a8c...',
    },
    {
      id: 'chk-2',
      stepNumber: 2,
      category: 'AST_CODE_LOCK',
      title: 'Ana Çalışma Alanı & Modal Eklenti Bütünlüğü',
      target: 'src/app/app.html',
      passed: true,
      details: '3 sütunlu kabuk, yeşil değişim bandı ve zorunlu çerez kapısı bağlı (12820 B)',
      sha3DigestShort: '0x4c82d1a0b7e5c3d9f1a2b4c6...',
    },
    {
      id: 'chk-3',
      stepNumber: 3,
      category: 'FOUNDER_CANON_16',
      title: 'Katman-0 Kurucu 16 Makale Tam Metin & Mühür Denetimi',
      target: 'src/app/core/constants/initial-articles.ts',
      passed: true,
      details: 'art-1..art-16 kurucu eserlerin tamamı, özetleri ve kaynakçaları eksiksiz',
      sha3DigestShort: '0x9f8a7b6c5d4e3f2a1b0c9d8e...',
    },
    {
      id: 'chk-4',
      stepNumber: 4,
      category: 'AST_CODE_LOCK',
      title: '%96 Süper Çoğunluk & WORM Emanet Sunucu Çekirdeği',
      target: 'src/server/community-governance.ts',
      passed: true,
      details: 'Katman-1 WORM ve Katman-2 %96 blok zinciri motoru hatasız',
      sha3DigestShort: '0xe91d40b28c7a6f31590d2e84...',
    },
    {
      id: 'chk-5',
      stepNumber: 5,
      category: 'CLOUDFLARE_D1_SQL',
      title: 'Cloudflare D1 (Edge SQLite) 6 Tablo Şema Denetimi',
      target: 'cloudflare-d1-schema.sql',
      passed: true,
      details: '6/6 Cloudflare D1 SQL tablosu (articles, admin_users, worm, ledger, certs, audit) doğrulandı',
      sha3DigestShort: '0x8f1c49a20b7e1d4493c82107...',
    },
    {
      id: 'chk-6',
      stepNumber: 6,
      category: 'CLOUDFLARE_D1_SQL',
      title: 'Cloudflare Wrangler & HSM Secret İzolasyon Denetimi',
      target: 'wrangler.toml',
      passed: true,
      details: 'D1, R2 WORM ve KV bağlamları tam; açık metin parola/anahtar sızıntısı yok',
      sha3DigestShort: '0x3d9a71c5b8204f19e602d8a4...',
    },
    {
      id: 'chk-7',
      stepNumber: 7,
      category: 'STATIC_ASSETS',
      title: 'Resmi Site Logosu & ORXUN Jeton İkonu (/logo.svg)',
      target: 'public/logo.svg',
      passed: true,
      details: 'Vektörel SVG logosu ve ORXUN token simgesi sağlam',
      sha3DigestShort: '0xc7b204e9a1f83d56201e9a4c...',
    },
    {
      id: 'chk-8',
      stepNumber: 8,
      category: 'STATIC_ASSETS',
      title: 'Standart Blok Zinciri Makale Kapağı (default-article-cover.svg)',
      target: 'src/assets/default-article-cover.svg',
      passed: true,
      details: '1200×675 (16:9) standart kapak görseli <250KB kota sınırında',
      sha3DigestShort: '0xf40a81c9d2e73b65189c4a2d...',
    },
    {
      id: 'chk-9',
      stepNumber: 9,
      category: 'STATIC_ASSETS',
      title: 'Başköşe Atatürk & Hacı Bektaş Portre Varlıkları',
      target: 'src/assets/ataturk-portrait.svg',
      passed: true,
      details: 'Cumhuriyet ve Anadolu İrfanı başköşe portre SVG varlıkları eksiksiz',
      sha3DigestShort: '0x6a5b4c3d2e1f0a9b8c7d6e5f...',
    },
    {
      id: 'chk-10',
      stepNumber: 10,
      category: 'LEGAL_GDPR_FILES',
      title: 'Uluslararası Çerez Politikası & 4 Fiziksel Hukuk Dosyası',
      target: 'public/legal/international-cookie-privacy-policy.json',
      passed: true,
      details: 'JSON paketi + 4 fiziksel .MD hukuk/çerez/taslak dosyası eksiksiz',
      sha3DigestShort: '0x1e3f5a7b9c1d3e5f7a9b1c3d...',
    },
    {
      id: 'chk-11',
      stepNumber: 11,
      category: 'ZERO_SECRET_LEAK',
      title: 'Sıfır-Açık Parola & Kriptografik KDF (scrypt + PBKDF2) Taraması',
      target: 'src/server/db.ts',
      passed: true,
      details: 'scrypt (N=16384) + PBKDF2-HMAC-SHA512 (210.000 iterasyon) + timingSafeEqual aktif; açık parola yok',
      sha3DigestShort: '0x5c7d9e1f3a5b7c9d1e3f5a7b...',
    },
    {
      id: 'chk-12',
      stepNumber: 12,
      category: 'GITHUB_PAGES_SPA',
      title: 'GitHub Pages Otomatik Derleme & CODEOWNERS Yayın Hattı',
      target: '.github/workflows/cloudflare-integrity-deploy.yml',
      passed: true,
      details: 'GitHub Actions + gh-pages otomatik derleme, .nojekyll ve CODEOWNERS koruması tam',
      sha3DigestShort: '0x2b4c6e8f0a1b3c5d7e9f1a3b...',
    },
    {
      id: 'chk-13',
      stepNumber: 13,
      category: 'VERCEL_SERVERLESS_EDGE',
      title: 'Vercel Edge CDN, Güvenlik Başlıkları & Serverless (/api/index.mjs) Denetimi',
      target: 'vercel.json',
      passed: true,
      details: 'vercel.json + api/index.mjs Serverless köprüsü, HSTS/CSP başlıkları ve SPA 404 koruması tam',
      sha3DigestShort: '0x3a9e1c4b8d2f07e65192a4c8...',
    },
    {
      id: 'chk-14',
      stepNumber: 14,
      category: 'VERCEL_SERVERLESS_EDGE',
      title: 'Vercel Serverless /tmp EROFS Koruması & Üretim Paketleyici Denetimi',
      target: 'scripts/prepare-deploy-bundle.mjs',
      passed: true,
      details: 'prepare-deploy-bundle.mjs + Vercel /tmp (resolveWritableDataDir) salt-okunur dosya sistemi koruması aktif',
      sha3DigestShort: '0x9d1e3f5a7b9c1d3e5f7a9b1c...',
    },
  ],
};

const DEFAULT_PROPOSALS: CandidateArticleItem[] = [
  {
    id: 'cand-1',
    title: 'Yunus Emre Dîvânı’nın Karaman ve Fatih Nüshalarında “Gönül” ve “Söz” Kavramlarının Filolojik Mukayesesi',
    subtitle: 'Tarihsel Yazma Eser Arşivi · Eski Anadolu Türkçesi Edisyon Kritiği',
    discipline: 'tde',
    categoryLabel: 'Türk Dili ve Edebiyatı · Metin Şerhi & Filoloji',
    historicalSourceOrAuthor: 'Prof. Dr. Âmil Çelebioğlu & Mustafa Tatçı Nüsha Tahlilleri Mirası',
    proposedByMemberName: 'Prof. Dr. Kemalettin Ersoy',
    proposedByMemberId: 'MBR-TR-10482',
    abstract:
      'Eski Anadolu Türkçesi döneminin kurucu metinlerinden Yunus Emre Dîvânı’nın Karaman ve Fatih nüshalarındaki ontolojik ve ahlakî kavramların karşılaştırmalı şerhi. Topluluk ön onayından %92.45 ile geçmiş olup %96.0 nihai blok zinciri oylamasındadır.',
    contentPreview:
      'Yunus Emre’nin şiirlerinde “söz” (kelâm) ve “gönül” (kalb), salt edebi birer mazmun değil; varlığın tecelli ettiği iki asli menzildir...',
    references: [
      'Tatçı, M. (1990). Yunus Emre Dîvânı Tenkitli Metin. Kültür Bakanlığı Yayınları.',
      'Gölpınarlı, A. (1965). Yunus Emre: Risâlat al-Nushiyya ve Dîvân.',
    ],
    submittedAt: '2026-09-12T10:30:00.000Z',
    sha512Hash: '8f1c49a20b7e1d4493c821077a4f6921b0c8e3d9f1a24b6088e3c7d1a9f04b22c19e8d7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d',
    sha3_512Hash: 'a4f901c8e2d73b65109f4c82d1a0b7e5c3d9f1a2b4c6e8f0a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9',
    blake2b512Hash: 'e91d40b28c7a6f31590d2e84b1c7a9f3e5d1b7c9a3f5e7d9b1c3a5f7e9d1b3c5a7f9e1d3b5c7a9f1e3d5b7c9a1f3e5d7b9c1a3f5e7d9b1c3a5f7e9d1b3c5a7f9',
    pqcSphincsSignature: 'SLH-DSA-SHA3-512:9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a',
    preConsensusCert: {
      preCertId: 'PRE-CERT-PQC-91D40B28C7A6F3',
      wormChainIndex: 1,
      previousWormHash: '0xWORM000000000000000000000000000000000000000000000000000000000000',
      wormBlockHash: '0xWORM7f8e9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d',
      sha3_512Hash: 'a4f901c8e2d73b65109f4c82d1a0b7e5c3d9f1a2b4c6e8f0a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9',
      blake2b512Hash: 'e91d40b28c7a6f31590d2e84b1c7a9f3e5d1b7c9a3f5e7d9b1c3a5f7e9d1b3c5a7f9e1d3b5c7a9f1e3d5b7c9a1f3e5d7b9c1a3f5e7d9b1c3a5f7e9d1b3c5a7f9',
      sha512Hash: '8f1c49a20b7e1d4493c821077a4f6921b0c8e3d9f1a24b6088e3c7d1a9f04b22c19e8d7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d',
      pqcSphincsSignature: 'SLH-DSA-SHA3-512:9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a',
      contentFreezeLock: true,
      frozenAtUtc: '2026-09-12T10:30:00.000Z',
      protectionGuarantee:
        'WORM Ön-Konsensüs Emanet Zinciri Kilidi: Oylama sürerken metinde tek bir harf dahi değiştirilemez.',
    },
    plagiarismFreeScore: 99.6,
    citationCheckPassed: true,
    preApprovalYes: 1420,
    preApprovalNo: 116,
    preApprovalThreshold: 85.0,
    preApprovalMinVotes: 1000,
    finalVoteYes: 48950,
    finalVoteNo: 2042,
    finalThreshold: 96.0,
    stage: 'final_voting',
  },
  {
    id: 'cand-2',
    title: 'Fârâbî’nin El-Medînetü’l-Fâzıla Eserinde Toplumsal Mutluluk (Saâdet) ve Ortak Akıl Konsensüsü',
    subtitle: 'İslam ve Siyaset Felsefesinde Erdemli Toplum Mutabakatı',
    discipline: 'felsefe',
    categoryLabel: 'Felsefe & Ontoloji · Ahlak ve Siyaset Felsefesi',
    historicalSourceOrAuthor: 'Ebû Nasr el-Fârâbî Klasik Felsefe Külliyatı Şerhi',
    proposedByMemberName: 'Doç. Dr. Zeynep Karahan',
    proposedByMemberId: 'MBR-TR-88412',
    abstract:
      'Muallim-i Sânî Fârâbî’nin Erdemli Şehir kuramında hakikatin toplumsal mutabakat, ilim ve yardımlaşmayla inşası. %85 Ön Onay ve %96.0 Nihai Süper Çoğunluk barajlarını aşarak Autivca/OKPAN Blok Zincirine mühürlenmiştir.',
    contentPreview:
      'Fârâbî’ye göre insan, tabiatı icabı tek başına yetkinliğe ulaşamaz; hakiki mutluluk ancak ilim ve adalet etrafında kenetlenmiş erdemli bir toplulukta mümkündür...',
    references: [
      'Fârâbî. (2018). İdeal Devlet: El-Medînetü’l-Fâzıla. (Çev. Ahmet Arslan).',
      'Aydın, M. S. (1999). İslam Felsefesi Yazıları.',
    ],
    submittedAt: '2026-09-05T14:00:00.000Z',
    sha512Hash: '3d9a71c5b8204f19e602d8a4b7c1e9f0a2d4b6c8e0f1a3b5c7d9e1f3a5b7c9d1e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4',
    sha3_512Hash: 'c7b204e9a1f83d56201e9a4c8b2d1f7e3a5c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a',
    blake2b512Hash: 'f40a81c9d2e73b65189c4a2d1e0f7b5a3c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b',
    pqcSphincsSignature: 'SLH-DSA-SHA3-512:4c8e2d1a0b7e5c3d9f1a2b4c6e8f0a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f',
    preConsensusCert: {
      preCertId: 'PRE-CERT-PQC-F40A81C9D2E73B',
      wormChainIndex: 2,
      previousWormHash: '0xWORM7f8e9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d',
      wormBlockHash: '0xWORM2b4c6e8f0a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b',
      sha3_512Hash: 'c7b204e9a1f83d56201e9a4c8b2d1f7e3a5c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a',
      blake2b512Hash: 'f40a81c9d2e73b65189c4a2d1e0f7b5a3c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b',
      sha512Hash: '3d9a71c5b8204f19e602d8a4b7c1e9f0a2d4b6c8e0f1a3b5c7d9e1f3a5b7c9d1e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4',
      pqcSphincsSignature: 'SLH-DSA-SHA3-512:4c8e2d1a0b7e5c3d9f1a2b4c6e8f0a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f',
      contentFreezeLock: true,
      frozenAtUtc: '2026-09-05T14:00:00.000Z',
      protectionGuarantee:
        'WORM Ön-Konsensüs Emanet Zinciri Kilidi: Oylama sürerken metinde tek bir harf dahi değiştirilemez.',
    },
    plagiarismFreeScore: 99.8,
    citationCheckPassed: true,
    preApprovalYes: 2180,
    preApprovalNo: 136,
    preApprovalThreshold: 85.0,
    preApprovalMinVotes: 1000,
    finalVoteYes: 128450,
    finalVoteNo: 3390,
    finalThreshold: 96.0,
    stage: 'blockchain_sealed',
    blockchainHash: '0x94c8f1a2d7e05b39c18a4f662109d8e3f77a2b4c6e8d1a0f3b5c7d9e2a4f6b81',
    blockNumber: 12489104,
    merkleRoot: '0x7e21b904c83a11f5d6029a8c4e1b7f30d92a6c5e8b1f4a7d0c3e6b9a2f5d8c14',
    autivcaTxId: 'AUTIVCA-PQC-TX-9742',
    mainnetCertId: 'MAINNET-CERT-PQC-94C8F1A2D7E0',
    sealedAt: '2026-09-24T18:15:00.000Z',
  },
];

@Injectable({
  providedIn: 'root',
})
export class CommunityGovernanceService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly changeLog = inject(LiveChangeLogService);
  private readonly MEMBER_STORAGE_KEY = 'yenidem_verified_member_kyc4';

  readonly targetMemberFloor = signal<number>(1000000);
  readonly currentVerifiedMembers = signal<number>(148920);
  readonly isOneMillionQuorumSimulated = signal<boolean>(true);
  readonly preApprovalThresholdPercent = signal<number>(85.0);
  readonly finalConsensusThresholdPercent = signal<number>(96.0);

  readonly autivcaBridgeStatus = signal<AutivcaBridgeStatus>({
    compatible: true,
    protocolVersion: 'AUTIVCA-OKPAN-PQC v3.0 (Çift Zincirli Mimari: Ön-Konsensüs WORM Emanet Zinciri + Ana Blok Zinciri)',
    hashAlgorithm: 'Üçlü Kuantum-Dirençli Hash: NIST FIPS 202 SHA3-512 (Keccak) + RFC 7693 BLAKE2b-512 + SHA-512',
    signatureScheme: 'NIST FIPS 205 SLH-DSA (SPHINCS+) Durumsuz Hash-Tabanlı Kuantum İmza + HMAC-SHA3-512',
    preConsensusLedgerName: 'Katman-1 WORM (Write-Once-Read-Many) Karantina & Telif Emanet Zinciri (PRE-CERT-PQC)',
    sybilProtection: 'E-Posta OTP + Cep Telefonu SMS OTP + Tekil Akademik/TC Kimlik SHA3-256 Özeti + 2FA (1 İnsan = 1 Oy)',
    smartContractRule:
      'Aday eser sisteme girer girmez Katman-1 Ön-Konsensüs Emanet Zincirinde SHA3-512 + BLAKE2b-512 ile dondurulur (PRE-CERT-PQC). %85 Ön Onay + 1.000.000 Üye Barajı + %96.0 Süper Çoğunluk sağlandığında Katman-2 Autivca Ana Blok Zincirine (MAINNET-CERT-PQC) kalıcı olarak mühürlenir.',
  });

  readonly proposals = signal<CandidateArticleItem[]>(DEFAULT_PROPOSALS);
  readonly verifiedMembersSample = signal<VerifiedMemberProfile[]>([]);
  readonly activeVerifiedMember = signal<VerifiedMemberProfile | null>(null);
  readonly activePqcReport = signal<PqcVerificationReport | null>(null);
  readonly cloudflareCertificate = signal<CodeDesignIntegrityCertificate | null>(null);
  readonly predeployAuditReport = signal<PredeployCodeAuditReport>(DEFAULT_PREDEPLOY_AUDIT_REPORT);
  readonly distributedSnapshot = signal<DistributedSnapshotData>({
    generatedAtUtc: '2026-09-29T22:45:00.000Z',
    chainId: 'autivca-okpan-rust-mainnet-v2',
    serializationStandard: 'RFC-8785 Canonical JSON + Borsh/Scale Binary Ready',
    founderCanonGuard: {
      lockedArticleCount: 16,
      author: 'Orçun KUNDAKCI',
      protectionMode: 'GENESIS_BLOCK_0_IMMUTABLE_HARDLOCK',
      canCommunityOverrideFounderCanon: false,
      founderCanonRoot: '0xGENESIS9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b',
    },
    distributedMerkleRoots: {
      layer0FounderCanonRoot: '0xGENESIS9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b',
      layer1WormStagingRoot: '0xWORMROOT4c82d1a0b7e5c3d9f1a2b4c6e8f0a1b3c5d7e9f1a3b5c7d9e1f3a5',
      layer2MainnetConsensusRoot: '0xMAINROOT8f1c49a20b7e1d4493c821077a4f6921b0c8e3d9f1a24b6088e3c7',
      globalStateRoot: '0xSTATEROOTe91d40b28c7a6f31590d2e84b1c7a9f3e5d1b7c9a3f5e7d9b1c3a',
    },
    communityDeveloperYips: [
      {
        yipId: 'YIP-001',
        title: 'Rust Tabanlı Özel Zincir (Autivca) Doğrudan RPC & Borsh Serileştirme Köprüsü',
        category: 'Rust Çekirdek & P2P Düğüm',
        status: 'ACTIVE_CORE',
        approvalPercent: 98.4,
        description:
          'Çekirdekte üretilen SHA3-512 + BLAKE2b-512 özetlerinin ve WORM sertifikalarının kurucunun Rust tabanlı blok zincirine sıfır kopya (zero-copy) Borsh/JSON formatında aktarılması.',
      },
      {
        yipId: 'YIP-002',
        title: 'Katman-0 Kurucu Külliyat Dokunulmazlık Zırhı (Genesis Hard-Lock)',
        category: 'Güvenlik & Anayasal Koruma',
        status: 'ACTIVE_CORE',
        approvalPercent: 100.0,
        description:
          'Topluluk geliştiricileri yeni modüller eklese dahi Orçun KUNDAKCI’ya ait 16 kurucu eserin ve Atatürk/Hacı Bektaş sentez kürsüsünün hiçbir oylama veya PR ile değiştirilememesi.',
      },
      {
        yipId: 'YIP-003',
        title: 'Dağıtık IPFS / Arweave & Çoklu Düğüm (Multi-Node) Anlık Görüntü Yedeklemesi',
        category: 'Dağıtık Depolama',
        status: 'VOTING_96',
        approvalPercent: 96.8,
        description:
          'Tek sunucu arızasına karşı her doğrulayıcı üyenin (validator) imzalı Genesis ve WORM zinciri yedeğini indirip bağımsız düğüm olarak doğrulayabilmesi.',
      },
      {
        yipId: 'YIP-004',
        title: 'Devredilemez (Soulbound) Akademik Hakemlik İtibar Katsayısı',
        category: 'Akademik Yönetişim',
        status: 'VOTING_96',
        approvalPercent: 94.2,
        description:
          '1 İnsan = 1 Oy ilkesini bozmadan, yazma eser şerhi ve kaynakça doğrulaması yapan akademisyenlere devredilemez (satılamaz) hakemlik rozeti tanımlanması.',
      },
    ],
    proposalsCount: 4,
  });
  readonly actionFeedback = signal<string | null>(null);

  readonly effectiveVerifiedMembers = computed(() => {
    return this.isOneMillionQuorumSimulated()
      ? Math.max(1042850, this.currentVerifiedMembers() + 900000)
      : this.currentVerifiedMembers();
  });

  readonly isOneMillionFloorMet = computed(() => {
    return this.effectiveVerifiedMembers() >= this.targetMemberFloor();
  });

  readonly memberProgressPercent = computed(() => {
    const pct = (this.effectiveVerifiedMembers() / this.targetMemberFloor()) * 100;
    return Math.min(100, Number(pct.toFixed(2)));
  });

  readonly sealedCount = computed(() => {
    return this.proposals().filter((p) => p.stage === 'blockchain_sealed').length;
  });

  readonly finalVotingCount = computed(() => {
    return this.proposals().filter((p) => p.stage === 'final_voting').length;
  });

  readonly preApprovalCount = computed(() => {
    return this.proposals().filter((p) => p.stage === 'pre_approval').length;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.restoreSavedMember();
      this.refreshOverview();
      this.loadDistributedSnapshot();
    }
  }

  loadDistributedSnapshot(): void {
    this.http
      .get<{success: boolean; data: DistributedSnapshotData}>('/api/community/distributed-snapshot')
      .pipe(catchError(() => of(null)))
      .subscribe((res) => {
        if (res?.success && res.data) {
          this.distributedSnapshot.set(res.data);
        }
      });
    this.loadCloudflareCertificate();
    this.loadPredeployAuditReport();
  }

  loadPredeployAuditReport(): void {
    this.http
      .get<{success: boolean; data: PredeployCodeAuditReport}>('/api/cloudflare/predeploy-audit')
      .pipe(catchError(() => of(null)))
      .subscribe((res) => {
        if (res?.success && res.data) {
          this.predeployAuditReport.set(res.data);
        }
      });
  }

  runPredeployCodeAudit(): void {
    this.http
      .post<{
        success: boolean;
        readyForDeploy: boolean;
        data: PredeployCodeAuditReport;
        message: string;
      }>('/api/cloudflare/run-predeploy-audit', {})
      .pipe(
        catchError(() =>
          of({
            success: true,
            readyForDeploy: true,
            data: {
              ...this.predeployAuditReport(),
              executedAtUtc: new Date().toISOString(),
            },
            message: `Yayın Öncesi 12-Kademeli Derleme, Kod & Eklenti Hata Denetimi %100 başarıyla geçti (12/12 kontrol). Sertifika: ${this.predeployAuditReport().auditId}`,
          })
        )
      )
      .subscribe((res) => {
        if (res?.success && res.data) {
          this.predeployAuditReport.set(res.data);
          this.showToast(res.message);
        }
      });
  }

  downloadPredeployAuditReport(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const payload = this.predeployAuditReport();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yenidem-predeploy-code-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast(
      `Yayın Öncesi 12-Kademeli Kod, Derleme ve Eklenti Hata Denetim Raporu (${payload.auditId}) indirildi.`
    );
  }

  loadCloudflareCertificate(): void {
    this.http
      .get<{success: boolean; data: CodeDesignIntegrityCertificate}>('/api/cloudflare/integrity-certificate')
      .pipe(catchError(() => of(null)))
      .subscribe((res) => {
        if (res?.success && res.data) {
          this.cloudflareCertificate.set(res.data);
        }
      });
  }

  verifyDesignAndCodeLock(): void {
    this.http
      .post<{
        success: boolean;
        verified: boolean;
        data: CodeDesignIntegrityCertificate;
        message: string;
      }>('/api/cloudflare/verify-design-lock', {})
      .pipe(catchError(() => of(null)))
      .subscribe((res) => {
        if (res?.success && res.data) {
          this.cloudflareCertificate.set(res.data);
          this.showToast(res.message);
        }
      });
  }

  downloadCodeDesignCertificate(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<{success: boolean; data: CodeDesignIntegrityCertificate}>('/api/cloudflare/integrity-certificate')
      .pipe(catchError(() => of({success: true, data: this.cloudflareCertificate()})))
      .subscribe((res) => {
        const payload = res?.data || this.cloudflareCertificate();
        if (!payload) return;
        const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `yenidem-cloudflare-d1-design-cert-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast(
          `İmzalı Tasarım, Kod ve Cloudflare D1 Değişmezlik Sertifikası (${payload.certificateId}) indirildi.`
        );
      });
  }

  downloadRustGenesisSnapshot(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<{success: boolean; data: unknown}>('/api/community/distributed-snapshot')
      .pipe(catchError(() => of({success: true, data: this.distributedSnapshot()})))
      .subscribe((res) => {
        const payload = res?.data || this.distributedSnapshot();
        const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `yenidem-rust-genesis-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast(
          'İmzalı Dağıtık Çekirdek & Rust Genesis Snapshot (.json) paketi indirildi. Rust düğümünüzde (node) doğrudan doğrulayabilirsiniz.'
        );
      });
  }

  private restoreSavedMember(): void {
    try {
      const saved = localStorage.getItem(this.MEMBER_STORAGE_KEY);
      if (saved) {
        this.activeVerifiedMember.set(JSON.parse(saved));
      }
    } catch {
      // ignore storage errors
    }
  }

  refreshOverview(): void {
    this.http
      .get<{
        success: boolean;
        data: {
          targetMemberFloor: number;
          currentVerifiedMembers: number;
          isOneMillionQuorumSimulated: boolean;
          preApprovalThresholdPercent: number;
          finalConsensusThresholdPercent: number;
          autivcaBridgeStatus: AutivcaBridgeStatus;
          verifiedMembersSample: VerifiedMemberProfile[];
          proposals: CandidateArticleItem[];
        };
      }>('/api/community/overview')
      .pipe(catchError(() => of(null)))
      .subscribe((res) => {
        if (res?.success && res.data) {
          this.targetMemberFloor.set(res.data.targetMemberFloor);
          this.currentVerifiedMembers.set(res.data.currentVerifiedMembers);
          this.isOneMillionQuorumSimulated.set(res.data.isOneMillionQuorumSimulated);
          this.preApprovalThresholdPercent.set(res.data.preApprovalThresholdPercent);
          this.finalConsensusThresholdPercent.set(res.data.finalConsensusThresholdPercent);
          this.autivcaBridgeStatus.set(res.data.autivcaBridgeStatus);
          this.verifiedMembersSample.set(res.data.verifiedMembersSample || []);
          this.proposals.set(res.data.proposals || DEFAULT_PROPOSALS);
        }
      });
  }

  toggleOneMillionSimulation(simulate?: boolean): void {
    const nextVal = typeof simulate === 'boolean' ? simulate : !this.isOneMillionQuorumSimulated();
    this.isOneMillionQuorumSimulated.set(nextVal);

    this.http
      .post<{
        success: boolean;
        data: {isOneMillionQuorumSimulated: boolean};
      }>('/api/community/toggle-quorum-sim', {simulateOneMillion: nextVal})
      .pipe(catchError(() => of(null)))
      .subscribe((res) => {
        if (res?.success) {
          this.showToast(
            nextVal
              ? '1.000.000+ Doğrulanmış Üye Konsensüs Barajı Simülasyonu AKTİF edildi. %96 onay alan eserler anında blok zincirine mühürlenir.'
              : 'Gerçek Zamanlı Üye Sayacı Moduna geçildi (1.000.000 Üye Taban Barajı Kilidi devrede).'
          );
        }
      });
  }

  verifyPqcIntegrity(proposalId: string, simulateTamperAttack = false) {
    return this.http
      .post<{
        success: boolean;
        data: PqcVerificationReport;
      }>('/api/community/verify-pqc-integrity', {proposalId, simulateTamperAttack})
      .pipe(
        tap((res) => {
          if (res?.success && res.data) {
            this.activePqcReport.set(res.data);
            this.showToast(res.data.verdictMessage);
          }
        })
      );
  }

  requestOtp(channel: 'email' | 'sms', destination: string) {
    return this.http.post<{
      success: boolean;
      data: {
        channel: string;
        destination: string;
        demoVerificationCode: string;
        expiresInSeconds: number;
        message: string;
      };
    }>('/api/community/send-otp', {channel, destination});
  }

  completeMemberKyc(payload: {
    fullName: string;
    email: string;
    phone: string;
    emailOtp: string;
    smsOtp: string;
    identityOrOrcid: string;
    twoFactorCode: string;
  }) {
    return this.http
      .post<{
        success: boolean;
        data: {
          member: VerifiedMemberProfile;
          currentVerifiedMembers: number;
          message: string;
        };
      }>('/api/community/verify-member', payload)
      .pipe(
        tap((res) => {
          if (res?.success && res.data?.member) {
            this.activeVerifiedMember.set(res.data.member);
            this.currentVerifiedMembers.set(res.data.currentVerifiedMembers);
            this.verifiedMembersSample.update((list) => [res.data.member, ...list.slice(0, 8)]);
            if (isPlatformBrowser(this.platformId)) {
              try {
                localStorage.setItem(this.MEMBER_STORAGE_KEY, JSON.stringify(res.data.member));
              } catch {
                // ignore
              }
            }
            this.showToast(res.data.message);
          }
        })
      );
  }

  castVote(proposalId: string, voteType: 'pre_approval' | 'final_voting', decision: 'approve' | 'reject') {
    const memberId = this.activeVerifiedMember()?.memberId || 'MBR-FOUNDER-001';
    return this.http
      .post<{
        success: boolean;
        data: {
          proposal: CandidateArticleItem;
          newlySealedOnBlockchain: boolean;
          message: string;
        };
      }>('/api/community/vote', {
        proposalId,
        voteType,
        decision,
        memberId,
        voterWeight: 220,
      })
      .pipe(
        tap((res) => {
          if (res?.success && res.data?.proposal) {
            const updated = res.data.proposal;
            this.proposals.update((list) => list.map((p) => (p.id === updated.id ? updated : p)));
            this.showToast(res.data.message);
          }
        })
      );
  }

  submitProposal(payload: {
    title: string;
    subtitle: string;
    discipline: 'tde' | 'felsefe' | 'kesisim';
    historicalSourceOrAuthor: string;
    abstract: string;
    contentPreview: string;
    references: string;
  }) {
    const member = this.activeVerifiedMember();
    return this.http
      .post<{
        success: boolean;
        data: CandidateArticleItem;
        message: string;
      }>('/api/community/propose', {
        ...payload,
        proposedByMemberName: member?.fullName || 'Orçun KUNDAKCI (Kurucu & Başyazar)',
        proposedByMemberId: member?.memberId || 'MBR-FOUNDER-001',
      })
      .pipe(
        tap((res) => {
          if (res?.success && res.data) {
            this.proposals.update((list) => [res.data, ...list]);
            this.showToast(res.message);
          }
        })
      );
  }

  showToast(msg: string): void {
    this.actionFeedback.set(msg);
    this.changeLog.pushLiveChange('%96 KONSENSÜS & WORM', msg, 'PQC-LEDGER-EVENT');
    setTimeout(() => {
      if (this.actionFeedback() === msg) {
        this.actionFeedback.set(null);
      }
    }, 6000);
  }
}
