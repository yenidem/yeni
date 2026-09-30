export interface MecmuaIssue {
  id: string; // e.g. 'sayi-1'
  issueNumber: number;
  season: string; // e.g. 'Bahar 2026'
  title: string; // e.g. 'Gurbet, İntisap ve Varoluş'
  themeKicker: string; // e.g. 'Varlık, İrfan ve Gurbet Dosyası'
  editorialLetter: {
    title: string;
    author: string;
    lead: string;
    body: string[];
    date: string;
  };
  articleIds: string[]; // curated articles in reading order
  coverBadge: string;
  primaryColor: string; // amber, cyan, emerald
}
