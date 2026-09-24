import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService } from '../../services/calculator.service';
import { PropertyUnit } from '../../models/property.model';

@Component({
  selector: 'app-property-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-overview.component.html',
  styleUrl: './property-overview.component.scss'
})
export class PropertyOverviewComponent {
  public calculatorService = inject(CalculatorService);

  public units: PropertyUnit[] = [
    { id: 'local-1', name: 'Local Comercial 1', type: 'commercial', floor: 'Piso 1', defaultTenant: 'Local Comercial A' },
    { id: 'local-2', name: 'Local Comercial 2', type: 'commercial', floor: 'Piso 1', defaultTenant: 'Local Comercial B' },
    { id: 'local-3', name: 'Local Comercial 3', type: 'commercial', floor: 'Piso 1', defaultTenant: 'Local Comercial C' },
    { id: 'apto-2', name: 'Apartamento 2', type: 'residential', floor: 'Piso 2', defaultTenant: 'Residencial Apt 2' },
    { id: 'apto-3', name: 'Apartamento 3', type: 'residential', floor: 'Piso 3', defaultTenant: 'Residencial Apt 3' },
    { id: 'apto-4', name: 'Apartamento 4', type: 'residential', floor: 'Piso 4', defaultTenant: 'Residencial Apt 4' }
  ];

  public copiedItemIndex: number | null = null;

  public clearHistory(): void {
    this.calculatorService.clearHistory();
  }

  public copyToClipboard(text: string, index: number): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedItemIndex = index;
      setTimeout(() => {
        this.copiedItemIndex = null;
      }, 2000);
    });
  }

  public formatMoney(amount: number): string {
    return this.calculatorService.formatCurrency(amount);
  }
}
