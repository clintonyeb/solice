import { IAlert } from "app/utils/alert";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SessionService } from "../../services/session.service";
import { MessageAlert, ErrorAlert } from "../../utils/alert";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.css"]
})
export class RequestsComponent implements OnInit {
  captchaSiteKey = environment.CAPTCHA_SITE_KEY;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    text: new FormControl("", [Validators.required]),
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

    this.sessionService.submitRequest(this.form.value).subscribe(
      data => {
        this.form.reset();
        this.alert = new MessageAlert(
          "Request successful!",
          "Your request was placed successfully..."
        );
        this.alert.status = true;
      },
      err => {
        const mess = this.sessionService.handleError(err);
        this.alert = new ErrorAlert("Login error!", mess);
        this.alert.status = true;
      }
    );
  }

  closeAlert() {
    this.alert.status = false;
  }
}
