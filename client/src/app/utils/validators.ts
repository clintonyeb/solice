import {
  ValidatorFn,
  AbstractControl,
  FormGroup,
  ValidationErrors
} from "@angular/forms";

export function matchesPattern(pattern: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const match = pattern.test(control.value);
    return match ? null : { forbidden: { value: control.value } };
  };
}

export const checkPasswords: ValidatorFn = (
  group: FormGroup
): ValidationErrors | null => {
  const pass = group.get("password").value;
  const confirmPass = group.get("cpassword").value;

  return pass === confirmPass ? null : { matched: false };
};

export function getFormValidationErrors(group: FormGroup): string | null {
  const controlName = Object.keys(group.controls).find(
    key => group.get(key).errors != null
  );

  if (controlName == null) {
    if (group.errors?.matched === true) {
      return null;
    }
    return "Password do not match";
  }
  const controlErrors = group.get(controlName).errors;
  const first = Object.keys(controlErrors)[0];
  console.log(controlErrors[first]);

  if (controlErrors[first] === true) {
    return `${controlName} is ${first}`;
  }

  if (first == "minlength") {
    return `${controlName} should be at least 6 characters`;
  }
  return `${controlName}'s ${first} is ${controlErrors[first]}`;
}
