import {ChangeDetectionStrategy, Component, computed, inject, input, output, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {SeoCardService, SharePayload} from '../../../core/services/seo-card.service';

@Component({
  selector: 'app-quick-share-bar',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#071836] via-[#0b234d] to-[#081a3a] border border-sky-300/30 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
      <div class="space-y-0.5">
        <div class="flex items-center gap-2 text-xs font-serif font-bold text-amber-300">
          <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">share</mat-icon>
          <span>{{ label() }}</span>
        </div>
        <p class="text-[11px] text-sky-200/85 font-sans">
          Bu içeriği kartvizit önizlemesiyle sosyal ağlarda veya mesajlaşma uygulamalarında paylaşın
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- WhatsApp -->
        <a
          [href]="seoCard.getWhatsAppShareUrl(payload())"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-pill-btn !h-9 !px-3 text-xs !border-emerald-400/40 hover:!border-emerald-300"
          title="WhatsApp ile Paylaş"
        >
          <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-emerald">chat</mat-icon>
          <span>WhatsApp</span>
        </a>

        <!-- X (Twitter) -->
        <a
          [href]="seoCard.getXShareUrl(payload())"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-pill-btn !h-9 !px-3 text-xs !border-sky-400/40 hover:!border-sky-300"
          title="X (Twitter) üzerinde Paylaş"
        >
          <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">campaign</mat-icon>
          <span>X / Twitter</span>
        </a>

        <!-- LinkedIn -->
        <a
          [href]="seoCard.getLinkedInShareUrl(payload())"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-pill-btn !h-9 !px-3 text-xs !border-blue-400/40 hover:!border-blue-300"
          title="LinkedIn üzerinde Paylaş"
        >
          <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">work</mat-icon>
          <span class="hidden sm:inline">LinkedIn</span>
        </a>

        <!-- Telegram -->
        <a
          [href]="seoCard.getTelegramShareUrl(payload())"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-pill-btn !h-9 !px-3 text-xs !border-cyan-400/40 hover:!border-cyan-300"
          title="Telegram ile Gönder"
        >
          <mat-icon class="!w-4 !h-4 !text-sm icon-luminous">send</mat-icon>
          <span class="hidden sm:inline">Telegram</span>
        </a>

        <!-- Copy Link & Card Text -->
        <button
          type="button"
          (click)="copyCard()"
          class="nav-pill-btn !h-9 !px-3 text-xs !border-amber-400/45"
          title="Kartvizit Metni ve Bağlantıyı Kopyala"
        >
          <mat-icon class="!w-4 !h-4 !text-sm icon-luminous-amber">
            {{ copied() ? 'check' : 'content_copy' }}
          </mat-icon>
          <span>{{ copied() ? 'Kopyalandı!' : 'Bağlantı Kopyala' }}</span>
        </button>

        @if (showStudioButton()) {
          <button
            type="button"
            (click)="openStudio.emit()"
            class="luxury-btn-primary !h-9 !px-3.5 text-xs"
            title="Görsel Paylaşım Kartı (.PNG) Stüdyosunu Aç"
          >
            <mat-icon class="!w-4 !h-4 !text-sm">palette</mat-icon>
            <span>Görsel Kart Üret</span>
          </button>
        }
      </div>
    </div>
  `,
})
export class QuickShareBarComponent {
  readonly seoCard = inject(SeoCardService);

  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly summary = input.required<string>();
  readonly quote = input<string>('');
  readonly url = input<string>('');
  readonly label = input<string>('İçeriği & Makale Kartvizitini Paylaş');
  readonly showStudioButton = input<boolean>(false);

  readonly openStudio = output<void>();
  readonly copied = signal<boolean>(false);

  readonly payload = computed<SharePayload>(() => ({
    title: this.title(),
    subtitle: this.subtitle(),
    summary: this.summary(),
    quote: this.quote(),
    url: this.url(),
  }));

  async copyCard(): Promise<void> {
    await this.seoCard.copyShareCardText(this.payload());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2200);
  }
}
