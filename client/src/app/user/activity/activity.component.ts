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
    console.log("here");

    this.getNotifications();
  }

  getNotifications() {
    this.userService
      .getNotifications()
      .subscribe((data: Array<INotification>) => {
        this.notifications = data;
      });
  }
}
