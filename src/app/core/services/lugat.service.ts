import {Injectable, computed, signal} from '@angular/core';
import {LUGAT_TERMS} from '../data/lugat.data';
import {LugatCategory, LugatTerm} from '../models/lugat.model';

@Injectable({
  providedIn: 'root',
})
export class LugatService {
  private readonly allTerms = signal<LugatTerm[]>(LUGAT_TERMS);
  readonly selectedCategory = signal<LugatCategory | 'all'>('all');
  readonly selectedRootLanguage = signal<string>('all');
  readonly searchQuery = signal<string>('');
  readonly selectedLetter = signal<string>('all');
  readonly selectedTerm = signal<LugatTerm | null>(null);

  readonly terms = computed(() => this.allTerms());

  readonly filteredTerms = computed(() => {
    let list = this.allTerms();
    const cat = this.selectedCategory();
    const rootLang = this.selectedRootLanguage();
    const query = this.searchQuery().trim().toLowerCase();
    const letter = this.selectedLetter().toUpperCase();

    if (cat !== 'all') {
      list = list.filter((t) => t.category === cat);
    }

    if (rootLang !== 'all') {
      list = list.filter((t) => t.rootLanguage.toLowerCase().includes(rootLang.toLowerCase()));
    }

    if (letter !== 'all') {
      list = list.filter((t) => t.term.toUpperCase().startsWith(letter));
    }

    if (query) {
      list = list.filter(
        (t) =>
          t.term.toLowerCase().includes(query) ||
          (t.osmanlica && t.osmanlica.includes(query)) ||
          t.shortDefinition.toLowerCase().includes(query) ||
          t.deepExplanation.toLowerCase().includes(query) ||
          t.associatedThinkers.some((th) => th.toLowerCase().includes(query)) ||
          t.relatedKeywords.some((kw) => kw.toLowerCase().includes(query))
      );
    }

    return list;
  });

  readonly availableLetters = computed(() => {
    const letters = new Set<string>();
    for (const term of this.allTerms()) {
      const firstChar = term.term.charAt(0).toUpperCase();
      letters.add(firstChar);
    }
    return Array.from(letters).sort((a, b) => a.localeCompare(b, 'tr'));
  });

  getTermById(id: string): LugatTerm | undefined {
    return this.allTerms().find((t) => t.id === id);
  }

  setCategory(category: LugatCategory | 'all'): void {
    this.selectedCategory.set(category);
  }

  setRootLanguage(lang: string): void {
    this.selectedRootLanguage.set(lang);
  }

  setSearchQuery(q: string): void {
    this.searchQuery.set(q);
  }

  setLetter(letter: string): void {
    this.selectedLetter.set(letter);
  }

  openTermModal(term: LugatTerm): void {
    this.selectedTerm.set(term);
  }

  closeTermModal(): void {
    this.selectedTerm.set(null);
  }
}
