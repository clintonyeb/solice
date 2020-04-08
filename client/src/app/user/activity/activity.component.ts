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
  notificationSubscription: any;

  ngOnInit(): void {
    this.getNotifications();
    this.getAd();
  }

  ngOnDestroy() {
    this.notificationSubscription.unsubscribe();
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
    this.notificationSubscription = this.userService
      .getAds()
      .subscribe((data: IAd) => {
        this.ad = data;
      });
  }

  getLink(noti) {
    switch (noti.type) {
      case 0:
      case 1:
      case 2:
      case 6:
      case 7:
        return "/users/main/posts/" + noti.targetPost;
      case 3:
      case 4:
      case 5:
        return "/users/main/profiles/" + noti.targetUser;
    }
  }
}
