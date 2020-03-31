import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { INotification } from "../../utils/interfaces";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.css"]
})
export class ActivityComponent implements OnInit {
  constructor(private userService: UsersService) {}
  notifications: Array<INotification>;

  ngOnInit(): void {
    this.getNotifications();
    this.watchForNotif();
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
        console.log(d, "noti");
        if (!(d === true || d === false)) {
          if (this.getNotifications.length > 10) {
            this.notifications.shift();
          }
          this.notifications.unshift(d);
        }
      },
      err => {}
    );
  }
}
