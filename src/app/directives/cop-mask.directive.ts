import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  OnInit,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[copMask], input[appCopMask], input[currencyMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CopMaskDirective),
      multi: true
    }
  ]
})
export class CopMaskDirective implements ControlValueAccessor, OnInit {
  private onChange: (val: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Configure input for text entry with mobile numeric keypad
    this.renderer.setAttribute(this.el.nativeElement, 'type', 'text');
    this.renderer.setAttribute(this.el.nativeElement, 'inputmode', 'numeric');
    this.renderer.setAttribute(this.el.nativeElement, 'autocomplete', 'off');
  }

  // --- ControlValueAccessor Implementation ---

  writeValue(value: any): void {
    if (value === null || value === undefined || value === '') {
      this.el.nativeElement.value = '';
      return;
    }

    const num = Number(value);
    if (!isNaN(num)) {
      this.el.nativeElement.value = this.formatNumber(num);
    } else {
      this.el.nativeElement.value = '';
    }
  }

  registerOnChange(fn: (val: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }

  // --- Input & Keyboard Event Handling ---

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement;
    const originalValue = input.value;
    const cursorPos = input.selectionStart ?? originalValue.length;

    // Count raw digits to the left of cursor to preserve position accurately
    const digitsBeforeCursor = originalValue.slice(0, cursorPos).replace(/\D/g, '').length;

    // Extract digits only
    const rawDigits = originalValue.replace(/\D/g, '');

    if (!rawDigits) {
      input.value = '';
      this.onChange(null);
      return;
    }

    // Limit to 14 digits to avoid integer precision overflow in JavaScript
    const limitedDigits = rawDigits.slice(0, 14);
    const numericValue = parseInt(limitedDigits, 10);
    const formatted = this.formatNumber(numericValue);

    input.value = formatted;
    this.onChange(numericValue);

    // Reposition cursor right after the same count of digits
    let newCursorPos = 0;
    let digitsSeen = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        digitsSeen++;
      }
      if (digitsSeen >= digitsBeforeCursor) {
        newCursorPos = i + 1;
        break;
      }
    }
    if (digitsBeforeCursor === 0) {
      newCursorPos = 0;
    }

    input.setSelectionRange(newCursorPos, newCursorPos);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
    const input = this.el.nativeElement;
    const rawDigits = input.value.replace(/\D/g, '');
    if (rawDigits) {
      const num = parseInt(rawDigits, 10);
      input.value = this.formatNumber(num);
    } else {
      input.value = '';
    }
  }

  /**
   * Formats an integer number with Colombian dot thousands separator (.)
   * Example: 1000000 -> "1.000.000"
   */
  private formatNumber(value: number): string {
    if (isNaN(value)) return '';
    const integerPart = Math.floor(Math.abs(value)).toString();
    const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return value < 0 ? `-${formatted}` : formatted;
  }
}
