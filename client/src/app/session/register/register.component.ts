import { FormControl, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SessionService } from "app/services/session.service";
import { MessageAlert, ErrorAlert, IAlert, Notify } from "app/utils/alert";
import {
  matchesPattern,
  checkPasswords,
  getFormValidationErrors
} from "../../utils/validators";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  data: Date = new Date();
  focus;
  focus1;
  focus2;
  focus3;
  focus4;
  alert: IAlert;
  formAlert: IAlert;

  form = new FormGroup(
    {
      email: new FormControl("", [
        Validators.required,
        Validators.email
      ]),
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6)
      ]),
      cpassword: new FormControl("", [Validators.required])
    },
    { validators: checkPasswords }
  );

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private toastService: ToastrService
  ) {}

  ngOnInit() {}

  onSubmit() {
    if (this.formAlert && this.formAlert.status) {
      this.formAlert.status = false;
    }

    if (this.alert && this.alert.status) {
      this.alert.status = false;
    }

    // validate form here
    if (!this.form.valid) {
      const mess =
        getFormValidationErrors(this.form) || "Errors in your form...";
      this.formAlert = new ErrorAlert("Errors", mess);
      this.formAlert.status = true;
      return;
    }

    this.sessionService.register(this.form.value).subscribe(
      data => {
        this.form.reset();
        this.alert = new MessageAlert(
          "Account registration successful!",
          "You have created an account successfully!"
        );
        this.toastService.success(
          "Account",
          "Account registration successful!"
        );
        this.alert.status = true;
        this.router.navigate([
          "/session/login",
          { message: "Account registration successful" }
        ]);
      },
      err => {
        this.form.patchValue({
          password: "",
          cpassword: ""
        });
        this.alert = new ErrorAlert(
          "Account error!",
          this.sessionService.handleError(err)
        );
        this.alert.status = true;
      }
    );
  }
}
