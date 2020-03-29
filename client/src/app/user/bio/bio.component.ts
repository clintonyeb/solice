import { Component, OnInit, Input } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { IUser } from '../../utils/interfaces';

@Component({
  selector: "app-bio",
  templateUrl: "./bio.component.html",
  styleUrls: ["./bio.component.scss"]
})
export class BioComponent implements OnInit {
  user: IUser;
  active: Array<IUser>;
  @Input() status: boolean;

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
  
}
