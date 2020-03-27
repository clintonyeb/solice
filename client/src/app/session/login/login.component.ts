import { SessionService } from "./../../services/session.service";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IAlert, MessageAlert, ErrorAlert } from "app/utils/alert";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  data: Date = new Date();
  focus;
  focus1;
  alert: IAlert;

  // controls
  form = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const pay = this.route.snapshot.paramMap.get("message");
    if (pay) {
      this.alert = new MessageAlert("success", pay);
      this.alert.status = true;
    }
  }

  onSubmit() {
    if (this.alert && this.alert.status) {
      this.alert.status = false;
    }
    this.sessionService.login(this.form.value).subscribe(
      data => {
        this.form.reset();
        this.alert = new MessageAlert(
          "Login successful!",
          "You have logged in successfully..."
        );
        this.alert.status = true;
        this.sessionService.saveSession(data);
        this.router.navigate(["/"]);
      },
      err => {
        this.form.patchValue({
          password: ""
        });
        this.alert = new ErrorAlert(
          "Login error!",
          this.sessionService.handleError(err)
        );
        this.alert.status = true;
      }
    );
  }

  closeAlert() {
    this.alert.status = false;
  }
}
