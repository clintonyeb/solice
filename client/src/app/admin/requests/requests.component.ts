import { Component, OnInit } from "@angular/core";
import { IUser } from "../../utils/interfaces";
import { AdminsService } from "../../services/admins.service";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.css"]
})
export class RequestsComponent implements OnInit {
  requests: Array<IUser>;
  request: IUser;

  constructor(private adminService: AdminsService) {}

  ngOnInit(): void {
    this.getRequests();
  }

  getRequests() {
    this.adminService
      .getRequests()
      .subscribe((d: Array<IUser>) => (this.requests = d));
  }

  showUser(user: IUser) {
    this.request = user;
  }

  enableUser(user: IUser) {
    this.adminService.enableUser(user._id).subscribe((d: IUser) => {
      var foundIndex = this.requests.findIndex(p => p._id === d._id);
      this.requests.splice(foundIndex, 1);
      this.request = d;
    });
  }

  getRequest(user: IUser) {
    return user.requests.find(req => req.status === 0);
  }
}
