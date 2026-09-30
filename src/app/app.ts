import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet, RouterLink, Router, NavigationEnd} from '@angular/router';
import {Header} from './shared/components/header/header';
import {Footer} from './shared/components/footer/footer';
import {MatIconModule} from '@angular/material/icon';
import {Author2faModal} from './features/security/components/author-2fa-modal/author-2fa-modal';
import {QuantumVerifierModal} from './features/security/components/quantum-verifier-modal/quantum-verifier-modal';
import {OmniSearchModalComponent} from './features/search/omni-search-modal/omni-search-modal';
import {BookmarksModalComponent} from './features/bookmarks/bookmarks-modal/bookmarks-modal';
import {AmbientAudioBarComponent} from './shared/components/ambient-audio-bar/ambient-audio-bar';
import {AiGuideAssistantComponent} from './shared/components/ai-guide-assistant/ai-guide-assistant';
import {AccessibilityBarComponent} from './shared/components/accessibility-bar/accessibility-bar';
import {SiteBusinessCardComponent} from './shared/components/site-business-card/site-business-card';
import {FullScreenReaderModalComponent} from './shared/components/full-screen-reader/full-screen-reader-modal';
import {UserSettingsModalComponent} from './shared/components/user-settings-modal/user-settings-modal';
import {BottomChangeTickerComponent} from './shared/components/bottom-change-ticker/bottom-change-ticker';
import {CookiePolicyGateModalComponent} from './shared/components/cookie-policy-gate-modal/cookie-policy-gate-modal';
import {SidebarLeft} from './shared/components/sidebar-left/sidebar-left';
import {SidebarRight} from './shared/components/sidebar-right/sidebar-right';
import {SecurityService} from './core/services/security.service';
import {LayoutService} from './core/services/layout.service';
import {AccessibilityService} from './core/services/accessibility.service';
import {SeoCardService} from './core/services/seo-card.service';
import {UserCustomizationService} from './core/services/user-customization.service';
import {filter} from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    Header,
    Footer,
    MatIconModule,
    Author2faModal,
    QuantumVerifierModal,
    OmniSearchModalComponent,
    BookmarksModalComponent,
    AmbientAudioBarComponent,
    AiGuideAssistantComponent,
    AccessibilityBarComponent,
    SiteBusinessCardComponent,
    FullScreenReaderModalComponent,
    UserSettingsModalComponent,
    BottomChangeTickerComponent,
    CookiePolicyGateModalComponent,
    SidebarLeft,
    SidebarRight,
  ],
  host: {
    '(document:keydown)': 'handleGlobalKeydown($event)',
    '(window:resize)': 'handleResize()',
  },
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly securityService = inject(SecurityService);
  readonly layoutService = inject(LayoutService);
  readonly a11y = inject(AccessibilityService);
  readonly seoCard = inject(SeoCardService);
  readonly customService = inject(UserCustomizationService);
  readonly router = inject(Router);

  private resizeRafId: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.layoutService.syncViewport(window.innerWidth);
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.layoutService.closeAllDrawers();
        const nav = event as NavigationEnd;
        if (!nav.urlAfterRedirects.startsWith('/makale/')) {
          this.seoCard.setSiteBusinessCardMeta();
        }
      });
  }

  handleResize(): void {
    if (typeof window === 'undefined') return;
    if (this.resizeRafId !== null) return;
    this.resizeRafId = window.requestAnimationFrame(() => {
      this.layoutService.syncViewport(window.innerWidth);
      this.resizeRafId = null;
    });
  }

  handleGlobalKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.layoutService.toggleSearch();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === '[') {
      event.preventDefault();
      this.layoutService.toggleLeftSidebar();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === ']') {
      event.preventDefault();
      this.layoutService.toggleRightSidebar();
    }
  }
}
