import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { SessionService } from "../../services/session.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  authenticated = false;
  constructor(
    private userService: UsersService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authenticateUser();
  }

  authenticateUser() {
    this.sessionService.validateToken((err, res) => {
      if (err) {
        return this.router.navigate([
          "/session/login",
          { message: "Please login to continue" }
        ]);
      }
      if (res.role >= 2) {
        return (this.authenticated = true);
      }
      return this.router.navigate([
        "/session/login",
        { message: "Please login to continue" }
      ]);
    });
  }
}
