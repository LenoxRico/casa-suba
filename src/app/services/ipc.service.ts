import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IpcService {
  private readonly STORAGE_KEY = 'casa_suba_ipc_rate';
  private readonly DEFAULT_IPC = 5.1; // Default reference IPC %

  // Signal for reactive IPC state
  public readonly ipcRate = signal<number>(this.loadInitialIpc());

  constructor() {}

  private loadInitialIpc(): number {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available, using default IPC rate.', e);
    }
    return this.DEFAULT_IPC;
  }

  public updateIpcRate(newRate: number, saveToStorage: boolean = true): void {
    const validRate = Math.max(0, newRate);
    this.ipcRate.set(validRate);

    if (saveToStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, validRate.toString());
      } catch (e) {
        console.error('Failed to save IPC rate to LocalStorage', e);
      }
    }
  }

  public resetToDefault(): void {
    this.updateIpcRate(this.DEFAULT_IPC, true);
  }
}
