import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { INotification, IAd } from "../../utils/interfaces";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.css"],
})
export class ActivityComponent implements OnInit {
  ad: IAd;
  constructor(private userService: UsersService) {}
  notifications: Array<INotification>;

  ngOnInit(): void {
    this.getNotifications();
    this.getAd();
  }

  getNotifications() {
    this.userService.getNotifications();
    this.userService.notificationSubject.subscribe(
      (notifications: INotification[]) => {
        this.notifications = notifications;
      },
      (err) => {}
    );
  }

  getAd() {
    this.userService.getAds().subscribe((data: IAd) => {
      this.ad = data;
    });
  }
}
