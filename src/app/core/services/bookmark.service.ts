import {Injectable, signal} from '@angular/core';
import {AcademicArticle} from '../models/article.model';

const STORAGE_KEY = 'orcun_academic_reading_list';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private readonly bookmarkedArticles = signal<AcademicArticle[]>([]);
  readonly bookmarks = this.bookmarkedArticles.asReadonly();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.bookmarkedArticles.set(JSON.parse(data));
      }
    } catch {
      // Local storage disabled or corrupted
    }
  }

  private saveToStorage(list: AcademicArticle[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Storage error
    }
  }

  isBookmarked(articleId: string): boolean {
    return this.bookmarkedArticles().some((a) => a.id === articleId);
  }

  toggleBookmark(article: AcademicArticle): boolean {
    const exists = this.isBookmarked(article.id);
    let updated: AcademicArticle[];
    if (exists) {
      updated = this.bookmarkedArticles().filter((a) => a.id !== article.id);
    } else {
      updated = [article, ...this.bookmarkedArticles()];
    }
    this.bookmarkedArticles.set(updated);
    this.saveToStorage(updated);
    return !exists;
  }

  removeBookmark(articleId: string): void {
    const updated = this.bookmarkedArticles().filter((a) => a.id !== articleId);
    this.bookmarkedArticles.set(updated);
    this.saveToStorage(updated);
  }

  clearAll(): void {
    this.bookmarkedArticles.set([]);
    this.saveToStorage([]);
  }
}
