import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle theme from dark to light and vice versa', () => {
    service.setTheme('dark');
    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBe(true);

    service.toggleTheme();
    expect(service.theme()).toBe('light');
    expect(service.isDark()).toBe(false);

    service.toggleTheme();
    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBe(true);
  });

  it('should apply data-theme attribute on documentElement', () => {
    service.setTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    service.setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should persist chosen theme to localStorage', () => {
    service.setTheme('light');
    expect(localStorage.getItem('casa-suba-theme')).toBe('light');
  });
});
