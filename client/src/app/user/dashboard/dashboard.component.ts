import { Component, OnInit, ViewChild } from "@angular/core";
import { SessionService } from "../../services/session.service";
import { Router } from "@angular/router";
import { UsersService } from "../../services/users.service";
import { BioComponent } from "../bio/bio.component";
import { INotify, INotification, IUser } from "../../utils/interfaces";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  authenticated = false;
  active = false;
  mainSection = "feed"; // feed, profile, view-profile
  @ViewChild("bio") bio: BioComponent;
  userId: string;
  user: IUser;

  constructor(
    private sessionService: SessionService,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authenticateUser();
  }

  ngOnDestroy() {
    this.userService.closeConnections();
  }

  authenticateUser() {
    this.sessionService.validateToken((err, res) => {
      if (err) {
        return this.router.navigate([
          "/session/login",
          { message: "Please login to continue" }
        ]);
      }
      this.user = res;
      this.authenticated = true;
      this.userService.activeSubject.subscribe(
        (d: boolean) => {
          this.active = d;
        },
        err => {
          console.log(err);
        }
      );
      this.userService.goActive();
    });
  }

  editProfile(value: string) {
    this.bio.refresh();
    this.mainSection = value;
  }

  viewProfile(value: string) {
    this.userId = value;
    this.mainSection = "view-profile";
  }
}
