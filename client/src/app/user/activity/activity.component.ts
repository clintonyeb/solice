import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { INotification, IAd } from "../../utils/interfaces";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.css"]
})
export class ActivityComponent implements OnInit {
  ad: IAd;
  constructor(private userService: UsersService) {}
  notifications: Array<INotification>;

  ngOnInit(): void {
    this.getNotifications();
    this.watchForNotif();
    this.getAd();
  }

  getNotifications() {
    this.userService
      .getNotifications()
      .subscribe((data: Array<INotification>) => {
        this.notifications = data;
      });
  }

  watchForNotif() {
    this.userService.subject.subscribe(
      (d: any) => {
        if (!this.notifications) return;
        if (!(d === true || d === false)) {
          if (this.notifications.length > 10) {
            this.notifications.shift();
          }
          this.notifications.unshift(d);
        }
      },
      err => {}
    );
  }

  getAd() {
    this.userService.getAds().subscribe((data: IAd) => {
      this.ad = data;
    });
  }
}
