import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  authenticated = false;
  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.authenticateUser();
  }

  authenticateUser() {
    this.sessionService.validateToken((err, res) => {
      if (err) { return this.router.navigate([
                 "/session/login",
                 { message: "Please login to continue" }]
      );
      }
      this.authenticated = true;
    });
  }
}
