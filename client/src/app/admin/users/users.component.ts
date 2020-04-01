import { Component, OnInit } from "@angular/core";
import { IUser } from "../../utils/interfaces";
import { AdminsService } from "../../services/admins.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent implements OnInit {
  users: Array<IUser>;
  user: IUser;
  constructor(private adminService: AdminsService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.adminService
      .getUsers()
      .subscribe((d: Array<IUser>) => (this.users = d));
  }

  showUser(user: IUser) {
    this.user = user;
  }

  enableUser(user: IUser) {
    this.adminService.enableUser(user._id).subscribe((d: IUser) => {
      var foundIndex = this.users.findIndex(p => p._id === d._id);
      this.users.splice(foundIndex, 1, d);
      this.user = d;
    });
  }

  disableUser(user: IUser) {
    this.adminService.disableUser(user._id).subscribe((d: IUser) => {
      var foundIndex = this.users.findIndex(p => p._id === d._id);
      this.users.splice(foundIndex, 1, d);
      this.user = d;
    });
  }
}
