import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static notBlank(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (typeof value !== 'string') return null;
      return value.trim().length === 0 && value.length > 0
        ? { notBlank: true }
        : null;
    };
  }

  static minLengthTrimmed(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (typeof value !== 'string') return null;
      const trimmedLength = value.trim().length;
      return trimmedLength > 0 && trimmedLength < min
        ? { minLengthTrimmed: { requiredLength: min, actualLength: trimmedLength } }
        : null;
    };
  }
}