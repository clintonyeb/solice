import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  buttonText: string;
  buttonURL: string;
  constructor(private router: Router) {
    router.events.forEach(event => {
      if (event instanceof NavigationEnd) {
        this.setButton();
      }
    });
  }

  ngOnInit(): void {
    this.setButton();
  }

  setButton() {
    if (this.router.url.startsWith("/session/login")) {
      this.buttonText = "Sign Up";
      this.buttonURL = "/session/register";
    } else {
      this.buttonText = "Log In";
      this.buttonURL = "/session/login";
    }
  }
}
