import { Injectable, signal, computed } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'casa-suba-theme';

  // Default to stored theme, or dark mode
  public theme = signal<AppTheme>(this.getInitialTheme());
  public isDark = computed(() => this.theme() === 'dark');

  constructor() {
    this.applyTheme(this.theme());
  }

  public toggleTheme(): void {
    const nextTheme: AppTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  public setTheme(theme: AppTheme): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.THEME_STORAGE_KEY, theme);
      } catch {
        // Ignore localStorage errors in private browsing / sandboxes
      }
    }
  }

  private getInitialTheme(): AppTheme {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.THEME_STORAGE_KEY) as AppTheme | null;
        if (saved === 'light' || saved === 'dark') {
          return saved;
        }
      } catch {
        // Ignore localStorage error
      }
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }

    return 'dark';
  }

  private applyTheme(theme: AppTheme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', theme);
    if (body) {
      body.setAttribute('data-theme', theme);
      body.classList.remove('light-theme', 'dark-theme');
      body.classList.add(`${theme}-theme`);
    }
  }
}
