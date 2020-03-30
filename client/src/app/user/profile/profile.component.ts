import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IUser } from "app/utils/interfaces";
import { UsersService } from "app/services/users.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  user: IUser;
  @Input() userId: boolean;
  @Output() main = new EventEmitter<string>();

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.userService.getUserById(this.userId).subscribe((data: IUser) => {
      this.user = data;
    });
  }

  goToFeed() {
    this.main.emit("feed");
  }
}
