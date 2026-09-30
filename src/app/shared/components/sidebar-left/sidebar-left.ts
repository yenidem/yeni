import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {ArticleService} from '../../../core/services/article.service';
import {RecentArticleCard} from './components/recent-article-card/recent-article-card';

@Component({
  selector: 'app-sidebar-left',
  imports: [MatIconModule, ReactiveFormsModule, RecentArticleCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full',
  },
  template: `
    <div class="w-full p-4 sm:p-5 space-y-6">
      <!-- Live Corpus Metrics Strip -->
      <div class="grid grid-cols-2 gap-2.5">
        <div class="p-3 rounded-2xl bg-glass-card text-center space-y-0.5">
          <span class="block text-lg font-serif font-extrabold text-cyan-200 tabular-nums">
            {{ articleService.articles().length }}
          </span>
          <span class="block text-[10px] text-sky-200/85 font-medium">Mühürlü Makale</span>
        </div>
        <div class="p-3 rounded-2xl bg-glass-card text-center space-y-0.5">
          <span class="block text-lg font-serif font-extrabold text-amber-300 tabular-nums">
            {{ totalReadingMinutes() }} dk
          </span>
          <span class="block text-[10px] text-sky-200/85 font-medium">Toplam Etüt</span>
        </div>
      </div>

      <!-- Recent Articles Feed -->
      <div class="space-y-3.5">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">update</mat-icon>
            </div>
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-white">Güncel Makaleler</h3>
              <p class="text-[10px] text-sky-200/80">Son neşredilen incelemeler</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-2.5">
          @for (article of articleService.articles().slice(0, 6); track article.id; let idx = $index) {
            <app-recent-article-card [article]="article" [index]="idx + 1" />
          }
        </div>
      </div>

      <!-- Interactive Academic Newsletter Box -->
      <div class="p-4 sm:p-5 rounded-3xl bg-glass-blue space-y-3">
        <div class="flex items-center gap-2">
          <mat-icon class="icon-luminous !w-4 !h-4 !text-base">mail</mat-icon>
          <h4 class="text-xs font-bold text-cyan-200 tracking-wider uppercase">Akademik Bülten</h4>
        </div>
        <p class="text-xs text-sky-100/85 leading-relaxed font-sans">
          Yeni makaleler, felsefi şerhler ve edebi analizlerden haberdar olun.
        </p>

        @if (subscribed()) {
          <div class="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2">
            <mat-icon class="!w-4 !h-4 !text-base icon-luminous-emerald">check_circle</mat-icon>
            <span>Bülten kaydınız başarıyla alındı.</span>
          </div>
        } @else {
          <div class="space-y-2 pt-1">
            <input
              type="email"
              [formControl]="emailControl"
              placeholder="E-posta adresiniz..."
              (keydown.enter)="subscribeNewsletter()"
              class="w-full px-3.5 py-2.5 rounded-xl bg-[#061229]/90 border border-sky-300/30 text-xs text-white placeholder-sky-200/50 focus:outline-hidden focus:border-cyan-300"
            />
            <button
              type="button"
              (click)="subscribeNewsletter()"
              class="w-full py-2.5 luxury-btn-primary !h-10 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5"
            >
              <mat-icon class="!w-4 !h-4 !text-sm">notifications_active</mat-icon>
              <span>Bültene Abone Ol</span>
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class SidebarLeft {
  readonly articleService = inject(ArticleService);
  readonly emailControl = new FormControl('', [Validators.required, Validators.email]);
  readonly subscribed = signal<boolean>(false);

  readonly totalReadingMinutes = computed(() =>
    this.articleService.articles().reduce((sum, a) => sum + (a.readingTimeMinutes || 0), 0)
  );

  subscribeNewsletter(): void {
    if (this.emailControl.value && this.emailControl.value.trim().length > 3) {
      this.subscribed.set(true);
      this.emailControl.reset();
    }
  }
}
