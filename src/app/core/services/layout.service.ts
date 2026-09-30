import {Injectable, signal, computed} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  readonly isSearchOpen = signal<boolean>(false);
  readonly isBookmarksOpen = signal<boolean>(false);
  readonly isAiGuideOpen = signal<boolean>(false);
  readonly isAudioDeckOpen = signal<boolean>(false);
  readonly isLeftSidebarVisible = signal<boolean>(true);
  readonly isRightSidebarVisible = signal<boolean>(true);
  readonly isMobile = signal<boolean>(false);
  readonly hasHydratedViewport = signal<boolean>(false);

  private lastIsMobile: boolean | null = null;

  readonly anySidebarVisible = computed(
    () => this.isLeftSidebarVisible() || this.isRightSidebarVisible()
  );

  readonly isFocusMode = computed(
    () => !this.isLeftSidebarVisible() && !this.isRightSidebarVisible()
  );

  toggleSearch(): void {
    this.isSearchOpen.update(v => !v);
  }

  toggleBookmarks(): void {
    this.isBookmarksOpen.update(v => !v);
  }

  toggleAiGuide(): void {
    const next = !this.isAiGuideOpen();
    this.isAiGuideOpen.set(next);
    if (next) {
      this.isAudioDeckOpen.set(false);
    }
  }

  toggleAudioDeck(): void {
    const next = !this.isAudioDeckOpen();
    this.isAudioDeckOpen.set(next);
    if (next) {
      this.isAiGuideOpen.set(false);
    }
  }

  toggleLeftSidebar(): void {
    const next = !this.isLeftSidebarVisible();
    this.isLeftSidebarVisible.set(next);
    if (next && this.isMobile()) {
      this.isRightSidebarVisible.set(false);
    }
  }

  toggleRightSidebar(): void {
    const next = !this.isRightSidebarVisible();
    this.isRightSidebarVisible.set(next);
    if (next && this.isMobile()) {
      this.isLeftSidebarVisible.set(false);
    }
  }

  toggleFocusMode(): void {
    if (this.anySidebarVisible()) {
      this.isLeftSidebarVisible.set(false);
      this.isRightSidebarVisible.set(false);
    } else {
      if (this.isMobile()) {
        this.isLeftSidebarVisible.set(true);
      } else {
        this.isLeftSidebarVisible.set(true);
        this.isRightSidebarVisible.set(true);
      }
    }
  }

  syncViewport(width: number): void {
    const mobile = width < 1024;
    this.isMobile.set(mobile);
    this.hasHydratedViewport.set(true);

    if (this.lastIsMobile !== mobile) {
      this.lastIsMobile = mobile;
      if (mobile) {
        this.isLeftSidebarVisible.set(false);
        this.isRightSidebarVisible.set(false);
      } else {
        this.isLeftSidebarVisible.set(true);
        this.isRightSidebarVisible.set(true);
      }
    }
  }

  setMobile(isMobile: boolean): void {
    this.syncViewport(isMobile ? 768 : 1440);
  }

  closeAllDrawers(): void {
    if (this.isMobile()) {
      this.isLeftSidebarVisible.set(false);
      this.isRightSidebarVisible.set(false);
    }
  }
}
