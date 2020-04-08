import { Injectable } from "@angular/core";
import { Router, CanLoad } from "@angular/router";
import { SessionService } from "./session.service";

@Injectable()
export class AuthGuardService implements CanLoad {
  constructor(public auth: SessionService, public router: Router) {}
  canLoad(): boolean {
    const res = this.auth.hasToken();
    if (!res)
      this.router.navigate([
        "/session/login",
        { message: "Please login to continue..." }
      ]);
    return res;
  }
}
