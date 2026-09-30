export type DisciplineType = 'tde' | 'felsefe' | 'kesisim';

export interface AcademicArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  discipline: DisciplineType;
  abstract: string;
  content: string;
  keywords: string[];
  references: string[];
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
  viewCount: number;
  featuredQuote?: string;
  // Quantum-Resistant Cryptographic & Integrity Fields
  sha512Hash?: string;
  quantumSignature?: string;
  version?: number;
  wordCount?: number;
  charCount?: number;
  detailedDateTr?: string;
  academicPeriod?: string;
  doiOrIsbn?: string;
  lastRevisionReason?: string;
  // Visual Media & Cover Fields
  coverImage?: string;
  coverImageCaption?: string;
  coverImageAlt?: string;
  coverAspectRatio?: '16/9' | '4/3' | '21/9' | '1/1';
  visualAnalysisNotes?: string;
  // Blockchain & Cultural Heritage Persistence Fields
  blockchainHash?: string;
  blockNumber?: number;
  blockTimestamp?: string;
  isBlockchainVerified?: boolean;
  blockchainStatus?: 'pending' | 'submitted' | 'approved' | 'registered';
  certificateId?: string;
  submissionTimestamp?: string;
  revisionHistory?: {
    date: string;
    timestamp?: string;
    hash: string;
    note: string;
    reason?: string;
    author: string;
    version?: number;
  }[];
  annotations?: {
    id: string;
    quote: string;
    comment: string;
    author: string;
    createdAt: string;
    category?: string;
  }[];
}

export interface SecuritySession {
  authenticated: boolean;
  token: string | null;
  authorName: string;
  role: 'author' | 'visitor';
  twoFactorEnabled: boolean;
  loginTime?: string;
  expiresAt?: string;
}

export interface IntegrityVerificationResult {
  verified: boolean;
  algorithm: 'SHA-512 (Post-Quantum Security Grade)' | 'HMAC-SHA512';
  computedHash: string;
  storedHash: string;
  tampered: boolean;
  signedBy: string;
  timestamp: string;
}

export interface DisciplineMeta {
  id: DisciplineType;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  colorClass: string;
  badgeClass: string;
  bgClass: string;
}

export const DISCIPLINE_DEFINITIONS: Record<DisciplineType, DisciplineMeta> = {
  tde: {
    id: 'tde',
    label: 'Türk Dili ve Edebiyatı',
    shortLabel: 'TDE & Şerh',
    description: 'Klasik metin şerhi, Türk şiir poetikası, dilbilgisi ve semantik tahliller',
    icon: 'menu_book',
    colorClass: 'text-amber-400',
    badgeClass: 'bg-amber-950/70 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-950/40',
    bgClass: 'from-amber-500/15 to-amber-900/10',
  },
  felsefe: {
    id: 'felsefe',
    label: 'Felsefe',
    shortLabel: 'Felsefe & Mantık',
    description: 'Epistemoloji, dil felsefesi, mantık, varlık ve etik soruşturmaları',
    icon: 'psychology',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950/40',
    bgClass: 'from-emerald-500/15 to-emerald-900/10',
  },
  kesisim: {
    id: 'kesisim',
    label: 'Disiplinlerarası Kesişim',
    shortLabel: 'İrfan & Arakesit',
    description: 'Edebi metnin felsefi hermeneutiği, Anadolu irfanı ve varoluşsal anlatı',
    icon: 'auto_stories',
    colorClass: 'text-sky-400',
    badgeClass: 'bg-sky-950/70 text-sky-300 border-sky-500/40 shadow-sm shadow-sky-950/40',
    bgClass: 'from-sky-500/15 to-blue-900/10',
  },
};

export interface AiAcademicOptimization {
  academicSummary: string;
  refinedTitle: string;
  tdeLanguageCritique: string[];
  philosophicalArgumentCritique: string[];
  recommendedKeywords: string[];
  potentialReferences: string[];
  keyQuoteForCard: string;
}

export interface AiSocialPost {
  xThread: string;
  linkedInPost: string;
  instagramCaption: string;
  socialCardQuote: string;
  hashtags: string[];
}

export type SocialCardTheme = 'royal-blue' | 'parchment' | 'dark-editorial';
export type SocialCardFormat = 'x-twitter' | 'linkedin' | 'instagram-square' | 'instagram-story';

export interface CardFormatDimension {
  id: SocialCardFormat;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export const SOCIAL_CARD_FORMATS: CardFormatDimension[] = [
  {id: 'instagram-story', name: 'Instagram / TikTok Story (9:16)', width: 1080, height: 1920, aspectRatio: '9/16'},
  {id: 'x-twitter', name: 'X / Twitter (16:9)', width: 1200, height: 675, aspectRatio: '16/9'},
  {id: 'linkedin', name: 'LinkedIn (1.91:1)', width: 1200, height: 628, aspectRatio: '1.91/1'},
  {id: 'instagram-square', name: 'Instagram Kare (1:1)', width: 1080, height: 1080, aspectRatio: '1/1'},
];

export interface BlockchainCertificate {
  certificateId: string;
  issueDate: string;
  holder: string;
  articleTitle: string;
  articleHash: string;
  blockchainTx: string;
  blockNumber: number;
  issuer: string;
  verificationUrl: string;
}
