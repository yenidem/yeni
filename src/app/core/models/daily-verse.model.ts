export interface LugatGlossaryItem {
  word: string;
  meaning: string;
  origin?: string;
}

export interface DailyVerse {
  id: string;
  poet: string;
  poetDates: string;
  sourceWork?: string;
  stanzaLine1: string;
  stanzaLine2: string;
  meter: string; // Vezin / Kalıp
  meterType: 'Aruz' | 'Hece';
  glossary: LugatGlossaryItem[];
  scholarlyCommentary: string; // Orçun Kundakcı Şerhi
  philosophicalThemes: string[];
  dateAssigned?: string;
}
