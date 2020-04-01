import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/admins/posts",
    title: "Posts",
    icon: "design_app",
    class: ""
  },
  {
    path: "/admins/requests",
    title: "Requests",
    icon: "education_atom",
    class: ""
  },
  {
    path: "/admins/ads",
    title: "Ads",
    icon: "location_map-big",
    class: ""
  },
  {
    path: "/admins/users",
    title: "Users",
    icon: "ui-1_bell-53",
    class: ""
  },

  {
    path: "/users",
    title: "User Dashboard",
    icon: "objects_spaceship",
    class: "active active-pro"
  }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
