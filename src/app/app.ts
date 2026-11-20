import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { CanonCalculatorComponent } from './components/canon-calculator/canon-calculator.component';
import { UtilitiesCalculatorComponent } from './components/utilities-calculator/utilities-calculator.component';
import { PropertyOverviewComponent } from './components/property-overview/property-overview.component';

export type DashboardTab = 'home' | 'canon' | 'utilities' | 'overview';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    CanonCalculatorComponent,
    UtilitiesCalculatorComponent,
    PropertyOverviewComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Mobile-app like home navigation hub as the initial screen
  public activeTab = signal<DashboardTab>('home');

  public setTab(tab: DashboardTab | string): void {
    if (tab === 'home' || tab === 'canon' || tab === 'utilities' || tab === 'overview') {
      this.activeTab.set(tab);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
}
