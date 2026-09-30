export type DoorType = 'seriat' | 'tarikat' | 'marifet' | 'hakikat';

export interface MakamItem {
  id: number;
  door: DoorType;
  numberInDoor: number; // 1 to 10
  title: string;
  originalTerm: string;
  classicalMeaning: string;
  modernInterpretation: string; // Çağdaş psikoloji / felsefe yorumu
  contemporaryPractice: string; // 21. yüzyıl gündelik yaşamdaki karşılığı
  corePrinciple: string;
  relatedQuote: string;
  quoteAuthor: string;
}

export interface DoorDefinition {
  id: DoorType;
  name: string;
  symbol: string;
  element: string; // Toprak, Su, Hava, Ateş (Kadim kozmoloji)
  spiritualLevel: string;
  modernConcept: string; // Hukuk & Sosyal Düzen, İç Disiplin, Sezgi & Biliş, Evrensel Bütünlük
  description: string;
  color: string;
  accentBg: string;
  borderClass: string;
  icon: string;
  totalMakams: number;
}

export interface ErenSage {
  id: string;
  name: string;
  title: string;
  era: string; // e.g. "13. Yüzyıl"
  location: string; // e.g. "Hacıbektaş / Nevşehir, Horasan'dan Anadolu'ya"
  archetype: string; // e.g. "Radikal Hümanist & Akıl Rehberi"
  modernCounterpart: string; // e.g. "Jürgen Habermas & Baruch Spinoza ile Diyalog"
  biography: string;
  philosophicalEssence: string;
  avatarSeed: string;
  bannerImage: string;
  bannerCaption: string;
  symbolicElement: string;
  keyDifferentiator: string; // Neden bugün dinlemeliyiz?
  famousAphorisms: {
    quote: string;
    source: string;
    modernTake: string;
  }[];
  relatedMakams: number[]; // References to Makam IDs
  relatedArticleSlug?: string;
}

export interface WisdomDilemma {
  id: string;
  situation: string; // Modern sıkıntı (örn: "Tükenmişlik ve Anlamsızlık")
  description: string;
  category: 'zihin' | 'toplum' | 'vicdan' | 'varoluş';
  door: DoorType;
  makamNumber: number;
  makamTitle: string;
  sageName: string;
  sageQuote: string;
  actionableStep: string;
}
