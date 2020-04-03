import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IAlert, MessageAlert, ErrorAlert } from "app/utils/alert";
import { SessionService } from "app/services/session.service";
import { ActivatedRoute } from "@angular/router";
import { checkPasswords } from "../../utils/validators";

@Component({
  selector: "app-recover-password",
  templateUrl: "./recover-password.component.html",
  styleUrls: ["./recover-password.component.css"]
})
export class RecoverPasswordComponent implements OnInit {
  form = new FormGroup(
    {
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6)
      ]),
      cpassword: new FormControl("", [Validators.required]),
      token: new FormControl(this.route.snapshot.paramMap.get("token"), [
        Validators.required
      ])
    },
    { validators: checkPasswords }
  );
  focus: any;
  focus1: any;
  alert: IAlert;

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.alert && this.alert.status) {
      this.alert.status = false;
    }

    this.sessionService.resetPassword(this.form.value).subscribe(
      data => {
        this.form.reset();
        this.alert = new MessageAlert(
          "Congratulations!",
          "Password successfully changed"
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
