import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IUser } from "app/utils/interfaces";
import { UsersService } from "app/services/users.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  user: IUser;
  @Output() main = new EventEmitter<string>();

  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    const userId = this.route.snapshot.paramMap.get("id");
    this.userService.getUserById(userId).subscribe((data: IUser) => {
      this.user = data;
    });
  }

  goToFeed() {
    this.router.navigate(["/users"]);
  }
}
