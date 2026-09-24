import { Injectable, signal } from '@angular/core';
import {
  CanonCalculation,
  EnergyCalculation,
  WaterCalculation,
  GasCalculation,
  CalculationSummary
} from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private readonly HISTORY_KEY = 'casa_suba_calc_history';
  
  public readonly history = signal<CalculationSummary[]>(this.loadHistory());

  constructor() {}

  // --- Canon Calculation ---
  public calculateCanon(
    currentRent: number,
    ipcPercentage: number,
    saveHistory: boolean = false
  ): CanonCalculation {
    const rent = Math.max(0, currentRent);
    const ipc = Math.max(0, ipcPercentage);
    
    const ipcDifference = Math.round(rent * (ipc / 100));
    const newRent = rent + ipcDifference;
    const annualDifference = ipcDifference * 12;

    const result: CanonCalculation = {
      currentRent: rent,
      ipcPercentage: ipc,
      ipcDifference,
      newRent,
      annualDifference,
      calculatedAt: new Date()
    };

    if (saveHistory) {
      this.saveToHistory({
        id: crypto.randomUUID(),
        type: 'canon',
        title: 'Nuevo Canon de Arrendamiento',
        date: new Date(),
        details: `Canon actual: ${this.formatCurrency(rent)} | Incremento (${ipc}%): ${this.formatCurrency(ipcDifference)} | Nuevo: ${this.formatCurrency(newRent)}`
      });
    }

    return result;
  }

  // --- Energy Calculation ---
  public calculateEnergy(
    totalBill: number,
    pricePerKwh: number,
    apt3Kwh: number,
    apt4Kwh: number,
    saveHistory: boolean = false
  ): EnergyCalculation {
    const bill = Math.max(0, totalBill);
    const price = Math.max(0.0001, pricePerKwh); // Prevent division by zero
    const a3Kwh = Math.max(0, apt3Kwh);
    const a4Kwh = Math.max(0, apt4Kwh);

    // Total kWh = Total Bill / Price per kWh
    const totalKwh = bill / price;

    // Apt 2 consumption = Total kWh - (Apt 3 + Apt 4)
    const apt2Kwh = Math.max(0, totalKwh - (a3Kwh + a4Kwh));

    const apt3Cost = Math.round(a3Kwh * price);
    const apt4Cost = Math.round(a4Kwh * price);
    const apt2Cost = Math.round(apt2Kwh * price);

    const result: EnergyCalculation = {
      totalBill: bill,
      pricePerKwh: price,
      totalKwh,
      apt3Kwh: a3Kwh,
      apt4Kwh: a4Kwh,
      apt2Kwh,
      apt2Cost,
      apt3Cost,
      apt4Cost,
      calculatedAt: new Date()
    };

    if (saveHistory) {
      this.saveToHistory({
        id: crypto.randomUUID(),
        type: 'energy',
        title: 'Servicio de Energía',
        date: new Date(),
        details: `Total: ${this.formatCurrency(bill)} | Apt 2: ${this.formatCurrency(apt2Cost)} | Apt 3: ${this.formatCurrency(apt3Cost)} | Apt 4: ${this.formatCurrency(apt4Cost)}`
      });
    }

    return result;
  }

  // --- Water Calculation ---
  // Input: commercialPerStore is the fixed value charged to 1 SINGLE commercial store.
  // Internally multiplied by 3 for the total of the 3 commercial stores.
  public calculateWater(
    totalBill: number,
    commercialPerStore: number,
    apt2People: number,
    apt3People: number,
    apt4People: number,
    saveHistory: boolean = false
  ): WaterCalculation {
    const bill = Math.max(0, totalBill);
    const perStore = Math.max(0, commercialPerStore);
    const commercialTotal = Math.min(bill, perStore * 3); // Total for 3 commercial stores combined
    const p2 = Math.max(0, apt2People);
    const p3 = Math.max(0, apt3People);
    const p4 = Math.max(0, apt4People);

    const residentialPool = Math.max(0, bill - commercialTotal);
    const totalPeople = p2 + p3 + p4;

    const costPerPerson = totalPeople > 0 ? residentialPool / totalPeople : 0;

    const apt2Cost = Math.round(p2 * costPerPerson);
    const apt3Cost = Math.round(p3 * costPerPerson);
    const apt4Cost = Math.round(p4 * costPerPerson);

    const result: WaterCalculation = {
      totalBill: bill,
      commercialTotal,
      commercialPerStore: perStore,
      residentialPool,
      apt2People: p2,
      apt3People: p3,
      apt4People: p4,
      totalPeople,
      costPerPerson,
      apt2Cost,
      apt3Cost,
      apt4Cost,
      calculatedAt: new Date()
    };

    if (saveHistory) {
      this.saveToHistory({
        id: crypto.randomUUID(),
        type: 'water',
        title: 'Servicio de Agua',
        date: new Date(),
        details: `Total: ${this.formatCurrency(bill)} | Cuota Local (c/u): ${this.formatCurrency(perStore)} (Total 3 Locales: ${this.formatCurrency(commercialTotal)}) | Apt 2 (${p2}p): ${this.formatCurrency(apt2Cost)} | Apt 3 (${p3}p): ${this.formatCurrency(apt3Cost)} | Apt 4 (${p4}p): ${this.formatCurrency(apt4Cost)}`
      });
    }

    return result;
  }

  // --- Gas Calculation ---
  public calculateGas(
    totalBill: number,
    saveHistory: boolean = false
  ): GasCalculation {
    const bill = Math.max(0, totalBill);
    const shareAmount = Math.round(bill / 2);

    const result: GasCalculation = {
      totalBill: bill,
      shareAmount,
      calculatedAt: new Date()
    };

    if (saveHistory) {
      this.saveToHistory({
        id: crypto.randomUUID(),
        type: 'gas',
        title: 'Servicio de Gas',
        date: new Date(),
        details: `Total: ${this.formatCurrency(bill)} | Pago por mitad (1/2): ${this.formatCurrency(shareAmount)}`
      });
    }

    return result;
  }

  // Utility currency formatter
  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  }

  // History persistence
  private loadHistory(): CalculationSummary[] {
    try {
      const data = localStorage.getItem(this.HISTORY_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
      }
    } catch (e) {
      console.warn('Failed to load history', e);
    }
    return [];
  }

  private saveToHistory(item: CalculationSummary): void {
    const current = [item, ...this.history()].slice(0, 20); // Keep last 20 calculations
    this.history.set(current);
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(current));
    } catch (e) {
      console.error('Failed to save calculation history', e);
    }
  }

  public clearHistory(): void {
    this.history.set([]);
    try {
      localStorage.removeItem(this.HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  }
}
