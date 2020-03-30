import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { IUser } from "../../utils/interfaces";

@Component({
  selector: "app-bio",
  templateUrl: "./bio.component.html",
  styleUrls: ["./bio.component.scss"]
})
export class BioComponent implements OnInit {
  user: IUser;
  active: Array<IUser>;
  @Input() status: boolean;
  @Output() main = new EventEmitter<string>();

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.userService.getUser().subscribe((data: IUser) => {
      this.user = data;
    });
  }

  getActiveFriends() {}

  logout() {
    this.userService.logout();
  }

  editProfile() {
    this.main.emit("profile");
  }

  refresh() {
    this.getUserInfo();
  }
}
