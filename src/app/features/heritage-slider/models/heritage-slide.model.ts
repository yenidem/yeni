export type HeritageCategory = 'cumhuriyet' | 'pir' | 'yedi-ulu-ozan';

export interface HeritageQuote {
  id: string;
  text: string;
  secondLine?: string;
  source: string;
  yearOrContext: string;
  theme: string;
}

export interface HeritageSlide {
  id: string;
  order: number;
  name: string;
  title: string;
  era: string;
  birthDeath: string;
  region: string;
  category: HeritageCategory;
  categoryLabel: string;
  ozanIndex?: number; // 1..7 for Yedi Ulu Ozan
  emblemType:
    | 'ataturk'
    | 'haci-bektas'
    | 'nesimi'
    | 'sah-hatayi'
    | 'fuzuli'
    | 'yemini'
    | 'virani'
    | 'pir-sultan'
    | 'kul-himmet';
  accentColor: 'amber' | 'sky' | 'emerald' | 'rose';
  philosophicalAxis: string;
  scholarlySynthesis: string;
  searchKeyword: string;
  quotes: HeritageQuote[];
}
