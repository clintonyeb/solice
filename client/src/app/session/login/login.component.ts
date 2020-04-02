import { SessionService } from "./../../services/session.service";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IAlert, MessageAlert, ErrorAlert } from "app/utils/alert";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

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
  suspended = false;

  // controls
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required])
  });

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastrService
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
        if (data["role"] >= 2) {
          this.toastService.success("Login", "Logged in as Admin");
          this.router.navigate(["/admins"]);
        } else {
          this.toastService.success("Login", "Logged in as User");
          this.router.navigate(["/"]);
        }
      },
      err => {
        this.form.patchValue({
          password: ""
        });
        const mess = this.sessionService.handleError(err);
        this.alert = new ErrorAlert("Login error!", mess);
        this.alert.status = true;

        if (mess === "Your Account has been suspended") {
          this.suspended = true;
        }
      }
    );
  }

  closeAlert() {
    this.alert.status = false;
  }
}
