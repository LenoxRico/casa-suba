import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { IpcService } from '../../services/ipc.service';

describe('HeaderComponent Modal Behavior', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let ipcService: IpcService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    ipcService = TestBed.inject(IpcService);
    ipcService.updateIpcRate(5.1, false);
    fixture.detectChanges();
  });

  it('should capture initial IPC rate on modal open', () => {
    expect(component.showIpcModal).toBe(false);
    component.openIpcModal();
    expect(component.showIpcModal).toBe(true);
    expect(component.tempIpcValue).toBe(5.1);
  });

  it('should discard draft changes when closing modal (Cancelar / X)', () => {
    component.openIpcModal();
    component.tempIpcValue = 12.5; // draft edit
    component.closeIpcModal();

    expect(component.showIpcModal).toBe(false);
    expect(ipcService.ipcRate()).toBe(5.1); // Original value retained!
  });

  it('should commit IPC rate when saveIpc is called (Guardar IPC)', () => {
    component.openIpcModal();
    component.tempIpcValue = 9.28;
    component.saveIpc();

    expect(component.showIpcModal).toBe(false);
    expect(ipcService.ipcRate()).toBe(9.28); // Value updated!
  });
});
