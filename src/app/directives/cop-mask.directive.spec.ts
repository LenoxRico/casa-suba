import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CopMaskDirective } from './cop-mask.directive';

@Component({
  standalone: true,
  imports: [FormsModule, CopMaskDirective],
  template: `
    <input id="testInput" [(ngModel)]="moneyValue" copMask />
  `
})
class TestHostComponent {
  public moneyValue: number | null = 1000000;
}

describe('CopMaskDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    inputEl = fixture.nativeElement.querySelector('#testInput');
  });

  it('should format initial number with dots as thousands separator (1.000.000)', () => {
    expect(inputEl.value).toBe('1.000.000');
  });

  it('should update formatted display and model when typing digits', () => {
    inputEl.value = '250000';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('250.000');
    expect(component.moneyValue).toBe(250000);
  });

  it('should handle clearing input value to null', () => {
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('');
    expect(component.moneyValue).toBeNull();
  });

  it('should format model changes from component code into input value with dots', async () => {
    component.moneyValue = 3450000;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(inputEl.value).toBe('3.450.000');
  });
});
