export type LugatCategory = 'tde' | 'felsefe' | 'tasavvuf' | 'estetik';

export interface LugatTerm {
  id: string;
  term: string;
  osmanlica?: string;
  rootLanguage: 'Arapça' | 'Farsça' | 'Grekçe' | 'Fransızca' | 'Türkçe' | 'Almanca' | 'Latince' | 'Arapça / Farsça' | 'İngilizce' | (string & {});
  etymology: string;
  category: LugatCategory;
  shortDefinition: string;
  deepExplanation: string;
  quote?: {
    text: string;
    source: string;
    commentary?: string;
  };
  associatedThinkers: string[];
  relatedKeywords: string[];
  relatedArticleSlugs?: string[];
}
