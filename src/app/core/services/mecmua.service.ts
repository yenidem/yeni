import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FirebaseService } from '../../services/firebase';
import { MecmuaIssue } from '../models/issue.model';
import { from, map } from 'rxjs';
import { orderBy } from 'firebase/firestore';

export interface DictionaryEntry {
  id: string;
  word: string;
  definition: string;
  etymology?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class MecmuaService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly firebase = inject(FirebaseService);

  readonly issues = signal<MecmuaIssue[]>([]);
  readonly dictionary = signal<DictionaryEntry[]>([]);
  readonly loading = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadInitialData();
    }
  }

  async loadInitialData() {
    this.loading.set(true);
    try {
      const issues = await this.firebase.getCollection('issues', [orderBy('issueNumber', 'desc')]);
      this.issues.set(issues as unknown as MecmuaIssue[]);

      const dictionary = await this.firebase.getCollection('dictionary', [orderBy('word', 'asc')]);
      this.dictionary.set(dictionary as unknown as DictionaryEntry[]);
    } catch (error) {
      console.error('Failed to load Mecmua data', error);
    } finally {
      this.loading.set(false);
    }
  }

  // Dictionary methods
  addDictionaryEntry(entry: Partial<DictionaryEntry>) {
    return from(this.firebase.createDocument('dictionary', entry)).pipe(
      map(id => {
        if (id) this.loadInitialData();
        return id;
      })
    );
  }

  // Issue methods
  createIssue(issue: Partial<MecmuaIssue>) {
    return from(this.firebase.createDocument('issues', issue)).pipe(
      map(id => {
        if (id) this.loadInitialData();
        return id;
      })
    );
  }
}
