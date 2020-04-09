import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { IUser } from "../../utils/interfaces";

@Component({
  selector: "app-bio",
  templateUrl: "./bio.component.html",
  styleUrls: ["./bio.component.scss"],
})
export class BioComponent implements OnInit {
  user: IUser;
  active: Array<IUser>;
  @Input() status: boolean;
  @Output() main = new EventEmitter<string>();
  currentUserSubscription: any;
  onlineUsersSubscription: any;

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.userService.getUser();
    this.currentUserSubscription = this.userService.currentUserSubject.subscribe(
      (data: IUser) => {
        this.user = data;
      }
    );
    this.getActiveFriends();
  }

  ngOnDestroy() {
    this.currentUserSubscription && this.currentUserSubscription.unsubscribe();
    this.onlineUsersSubscription && this.onlineUsersSubscription.unsubscribe();
  }

  getActiveFriends() {
    this.userService.getActive();
    this.onlineUsersSubscription = this.userService.onlineUsersSubject.subscribe(
      (data: Array<IUser>) => {
        this.active = data;
      }
    );
  }

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
