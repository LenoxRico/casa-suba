import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalculatorService } from '../../services/calculator.service';
import {
  EnergyCalculation,
  WaterCalculation,
  GasCalculation
} from '../../models/property.model';

export type ServiceType = 'energy' | 'water' | 'gas';

@Component({
  selector: 'app-utilities-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utilities-calculator.component.html',
  styleUrl: './utilities-calculator.component.scss'
})
export class UtilitiesCalculatorComponent {
  private calculatorService = inject(CalculatorService);

  public activeService: ServiceType = 'energy';

  // --- Energy Form Inputs ---
  public energyTotalBill: number | null = 250000;
  public energyPricePerKwh: number | null = 850;
  public energyApt3Kwh: number | null = 110;
  public energyApt4Kwh: number | null = 95;
  public energyResult: EnergyCalculation | null = null;
  public energyError: string | null = null;

  // --- Water Form Inputs ---
  public waterTotalBill: number | null = 180000;
  public waterCommercialPerStore: number | null = 10000; // Value for ONE single store (multiplied by 3 internally)
  public waterApt2People: number | null = 2;
  public waterApt3People: number | null = 3;
  public waterApt4People: number | null = 1;
  public waterResult: WaterCalculation | null = null;
  public waterError: string | null = null;

  // --- Gas Form Inputs ---
  public gasTotalBill: number | null = 60000;
  public gasResult: GasCalculation | null = null;

  constructor() {
    // Run initial calculation for default state display without recording to history
    this.calculateEnergy(false);
  }

  public selectService(service: ServiceType): void {
    this.activeService = service;
    if (service === 'energy' && !this.energyResult) {
      this.calculateEnergy(false);
    } else if (service === 'water' && !this.waterResult) {
      this.calculateWater(false);
    } else if (service === 'gas' && !this.gasResult) {
      this.calculateGas(false);
    }
  }

  // --- Calculations (saveHistory defaults to false, true only on button click) ---
  public calculateEnergy(saveHistory: boolean = false): void {
    this.energyError = null;

    if (!this.energyTotalBill || this.energyTotalBill <= 0) {
      this.energyError = 'Ingrese un valor total válido para el recibo de energía.';
      return;
    }
    if (!this.energyPricePerKwh || this.energyPricePerKwh <= 0) {
      this.energyError = 'Ingrese un precio de kilovatio válido.';
      return;
    }
    const a3 = this.energyApt3Kwh || 0;
    const a4 = this.energyApt4Kwh || 0;

    const calculatedTotalKwh = this.energyTotalBill / this.energyPricePerKwh;
    if (a3 + a4 > calculatedTotalKwh) {
      this.energyError = `La suma del consumo de Apt 3 (${a3} kWh) y Apt 4 (${a4} kWh) supera el consumo total de la propiedad (${calculatedTotalKwh.toFixed(1)} kWh). Verifique los datos.`;
      return;
    }

    this.energyResult = this.calculatorService.calculateEnergy(
      this.energyTotalBill,
      this.energyPricePerKwh,
      a3,
      a4,
      saveHistory
    );
  }

  public calculateWater(saveHistory: boolean = false): void {
    this.waterError = null;

    if (!this.waterTotalBill || this.waterTotalBill <= 0) {
      this.waterError = 'Ingrese un valor total válido para el recibo de agua.';
      return;
    }
    const perStore = this.waterCommercialPerStore || 0;
    const commTotal = perStore * 3;
    if (commTotal > this.waterTotalBill) {
      this.waterError = `El cobro total a los 3 locales (${this.formatMoney(commTotal)}) supera el total de la factura de agua (${this.formatMoney(this.waterTotalBill)}).`;
      return;
    }

    const p2 = this.waterApt2People || 0;
    const p3 = this.waterApt3People || 0;
    const p4 = this.waterApt4People || 0;
    const totalP = p2 + p3 + p4;

    if (totalP <= 0) {
      this.waterError = 'Debe ingresar al menos 1 persona en total entre los apartamentos.';
      return;
    }

    this.waterResult = this.calculatorService.calculateWater(
      this.waterTotalBill,
      perStore,
      p2,
      p3,
      p4,
      saveHistory
    );
  }

  public calculateGas(saveHistory: boolean = false): void {
    if (!this.gasTotalBill || this.gasTotalBill <= 0) {
      return;
    }
    this.gasResult = this.calculatorService.calculateGas(this.gasTotalBill, saveHistory);
  }

  public formatMoney(amount: number): string {
    return this.calculatorService.formatCurrency(amount);
  }

  public getEnergySharePercent(aptKwh: number, totalKwh: number): string {
    if (!totalKwh || totalKwh === 0) return '0%';
    return ((aptKwh / totalKwh) * 100).toFixed(1) + '%';
  }
}
