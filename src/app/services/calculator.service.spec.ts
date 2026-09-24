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

  it('should calculate Water split correctly and add history only when saveHistory = true', () => {
    const result = service.calculateWater(150000, 30000, 2, 3, 1, true);
    expect(result.costPerPerson).toBe(20000);
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
