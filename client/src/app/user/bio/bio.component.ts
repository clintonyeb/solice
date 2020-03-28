import { Component, OnInit, Sanitizer } from "@angular/core";
import * as Rellax from "rellax";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-bio",
  templateUrl: "./bio.component.html",
  styleUrls: ["./bio.component.scss"]
})
export class BioComponent implements OnInit {
  user;
  constructor(private userService: UsersService) {}

  ngOnInit() {
    const rellaxHeader = new Rellax(".rellax-header");
    this.getUserInfo();
  }

  getUserInfo() {
    this.userService.getUser().subscribe(data => {
      this.user = data;
    });
  }
}
