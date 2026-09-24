export interface PropertyUnit {
  id: string;
  name: string;
  type: 'commercial' | 'residential';
  floor?: string;
  defaultTenant?: string;
}

export interface CanonCalculation {
  currentRent: number;
  ipcPercentage: number;
  ipcDifference: number;
  newRent: number;
  annualDifference: number;
  calculatedAt: Date;
}

export interface EnergyCalculation {
  totalBill: number;
  pricePerKwh: number;
  totalKwh: number;
  apt3Kwh: number;
  apt4Kwh: number;
  apt2Kwh: number;
  apt2Cost: number;
  apt3Cost: number;
  apt4Cost: number;
  calculatedAt: Date;
}

export interface WaterCalculation {
  totalBill: number;
  commercialTotal: number;
  commercialPerStore: number;
  residentialPool: number;
  apt2People: number;
  apt3People: number;
  apt4People: number;
  totalPeople: number;
  costPerPerson: number;
  apt2Cost: number;
  apt3Cost: number;
  apt4Cost: number;
  calculatedAt: Date;
}

export interface GasCalculation {
  totalBill: number;
  shareAmount: number; // divided by 2
  calculatedAt: Date;
}

export interface CalculationSummary {
  id: string;
  type: 'canon' | 'energy' | 'water' | 'gas';
  title: string;
  date: Date;
  details: string;
}
