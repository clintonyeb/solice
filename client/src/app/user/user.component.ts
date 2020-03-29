import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  Inject,
  ElementRef
} from "@angular/core";
import { Subscription } from "rxjs";
import { NavbarComponent } from "app/shared/navbar/navbar.component";
import { Router, NavigationEnd } from "@angular/router";
import { DOCUMENT, Location } from "@angular/common";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {
  private _router: Subscription;
  @ViewChild(NavbarComponent) navbar: NavbarComponent;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    @Inject(DOCUMENT) private document: any,
    private element: ElementRef,
    public location: Location
  ) {}
  ngOnInit() {
    var navbar: HTMLElement = this.element.nativeElement.children[0]
      .children[0];
    this._router = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        if (window.outerWidth > 991) {
          window.document.children[0].scrollTop = 0;
        } else {
          window.document.activeElement.scrollTop = 0;
        }
        this.navbar && this.navbar.sidebarClose();

        this.renderer.listen("window", "scroll", event => {
          const number = window.scrollY;
          var _location = this.location.path();
          _location = _location.split("/")[2];

          if (number > 150 || window.pageYOffset > 150) {
            navbar.classList.remove("navbar-transparent");
          } else if (
            _location !== "login" &&
            this.location.path() !== "/nucleoicons"
          ) {
            // remove logic
            // navbar.classList.add("navbar-transparent");
          }
        });
      });
  }
}
