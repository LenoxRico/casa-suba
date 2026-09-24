import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CanonCalculatorComponent } from './canon-calculator.component';
import { IpcService } from '../../services/ipc.service';

describe('CanonCalculatorComponent IPC Synchronization', () => {
  let component: CanonCalculatorComponent;
  let fixture: ComponentFixture<CanonCalculatorComponent>;
  let ipcService: IpcService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanonCalculatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanonCalculatorComponent);
    component = fixture.componentInstance;
    ipcService = TestBed.inject(IpcService);
    fixture.detectChanges();
  });

  it('should reflect IpcService rate in component ipcPercentage getter', () => {
    ipcService.updateIpcRate(7.5, false);
    expect(component.ipcPercentage).toBe(7.5);
  });

  it('should update IpcService rate when setting component ipcPercentage setter', () => {
    component.ipcPercentage = 10.2;
    expect(ipcService.ipcRate()).toBe(10.2);
  });

  it('should recalculate new rent automatically when IPC rate changes', () => {
    component.currentRent = 1000000;
    component.ipcPercentage = 8.0; // 8% increase
    expect(component.result?.newRent).toBe(1080000);
    expect(component.result?.ipcDifference).toBe(80000);
  });
});
