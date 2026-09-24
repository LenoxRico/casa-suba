import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
    service.clearHistory();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate Canon without adding to history when saveHistory is false', () => {
    service.calculateCanon(1000000, 5, false);
    expect(service.history().length).toBe(0);
  });

  it('should add entry to history when calculateCanon is called with saveHistory = true', () => {
    service.calculateCanon(1000000, 5, true);
    expect(service.history().length).toBe(1);
    expect(service.history()[0].type).toBe('canon');
  });

  it('should calculate Energy split correctly and add history only on button click (saveHistory = true)', () => {
    const result = service.calculateEnergy(200000, 1000, 50, 70, false);
    expect(result.apt2Kwh).toBe(80);
    expect(service.history().length).toBe(0);

    service.calculateEnergy(200000, 1000, 50, 70, true);
    expect(service.history().length).toBe(1);
    expect(service.history()[0].type).toBe('energy');
  });

  it('should calculate Water split taking single store charge and multiplying by 3 internally', () => {
    // Total bill: 150,000 COP, Charge for 1 single store: 10,000 COP -> Total 3 stores: 30,000 COP
    // Residential pool: 120,000 COP
    // Apt 2: 2 people, Apt 3: 3 people, Apt 4: 1 person -> Total 6 residents
    // Cost per person: 120,000 / 6 = 20,000 COP
    const result = service.calculateWater(150000, 10000, 2, 3, 1, true);
    expect(result.commercialPerStore).toBe(10000);
    expect(result.commercialTotal).toBe(30000);
    expect(result.residentialPool).toBe(120000);
    expect(result.totalPeople).toBe(6);
    expect(result.costPerPerson).toBe(20000);
    expect(result.apt2Cost).toBe(40000);
    expect(result.apt3Cost).toBe(60000);
    expect(result.apt4Cost).toBe(20000);
    expect(service.history().length).toBe(1);
    expect(service.history()[0].type).toBe('water');
  });

  it('should calculate Gas split correctly and add history only when saveHistory = true', () => {
    const result = service.calculateGas(50000, true);
    expect(result.shareAmount).toBe(25000);
    expect(service.history().length).toBe(1);
    expect(service.history()[0].type).toBe('gas');
  });
});
