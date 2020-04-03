import { Component, OnInit } from "@angular/core";
import { environment } from "environments/environment";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IAlert, MessageAlert, ErrorAlert } from "app/utils/alert";
import { SessionService } from "app/services/session.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
  captchaSiteKey = environment.CAPTCHA_SITE_KEY;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    captcha: new FormControl()
  });
  focus: any;
  focus1: any;
  alert: IAlert;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.alert && this.alert.status) {
      this.alert.status = false;
    }

    this.sessionService.forgotPassword(this.form.value).subscribe(
      data => {
        this.form.reset();
        this.alert = new MessageAlert(
          "Request successful!",
          "We've sent you an email with a reset link"
        );
        this.alert.status = true;
      },
      err => {
        const mess = this.sessionService.handleError(err);
        this.alert = new ErrorAlert("Reset error!", mess);
        this.alert.status = true;
      }
    );
  }

  closeAlert() {
    this.alert.status = false;
  }
}
