import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalculatorService } from '../../services/calculator.service';
import { IpcService } from '../../services/ipc.service';
import { CanonCalculation, PropertyUnit } from '../../models/property.model';

@Component({
  selector: 'app-canon-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canon-calculator.component.html',
  styleUrl: './canon-calculator.component.scss'
})
export class CanonCalculatorComponent implements OnInit {
  private calculatorService = inject(CalculatorService);
  public ipcService = inject(IpcService);

  // Form Inputs
  public currentRent: number | null = 1200000;
  public saveIpcToStorage: boolean = true;
  public selectedUnitId: string = 'custom';

  // Synchronized IPC Percentage property linked bi-directionally to IpcService signal
  public get ipcPercentage(): number {
    return this.ipcService.ipcRate();
  }

  public set ipcPercentage(val: number) {
    const numericVal = Number(val);
    if (!isNaN(numericVal) && numericVal >= 0) {
      this.ipcService.updateIpcRate(numericVal, this.saveIpcToStorage);
      this.calculate(false); // Update display preview without recording history
    }
  }

  // Property Units preset list
  public propertyUnits: PropertyUnit[] = [
    { id: 'local-1', name: 'Local Comercial 1', type: 'commercial', floor: 'Piso 1' },
    { id: 'local-2', name: 'Local Comercial 2', type: 'commercial', floor: 'Piso 1' },
    { id: 'local-3', name: 'Local Comercial 3', type: 'commercial', floor: 'Piso 1' },
    { id: 'apto-2', name: 'Apartamento 2', type: 'residential', floor: 'Piso 2' },
    { id: 'apto-3', name: 'Apartamento 3', type: 'residential', floor: 'Piso 3' },
    { id: 'apto-4', name: 'Apartamento 4', type: 'residential', floor: 'Piso 4' }
  ];

  // Output Result
  public result: CanonCalculation | null = null;

  ngOnInit(): void {
    // Auto calculate initial default values for rendering without saving to history
    this.calculate(false);
  }

  public onIpcChange(): void {
    this.ipcService.updateIpcRate(this.ipcPercentage, this.saveIpcToStorage);
    this.calculate(false);
  }

  public setIpcPreset(presetValue: number): void {
    this.ipcPercentage = presetValue;
  }

  // Calculation method: saveHistory defaults to true when triggered explicitly by button click
  public calculate(saveHistory: boolean = true): void {
    if (this.currentRent === null || this.currentRent < 0) {
      return;
    }

    this.result = this.calculatorService.calculateCanon(
      this.currentRent,
      this.ipcPercentage,
      saveHistory
    );
  }

  public formatMoney(amount: number): string {
    return this.calculatorService.formatCurrency(amount);
  }

  public resetForm(): void {
    this.currentRent = 1200000;
    this.calculate(false);
  }
}
