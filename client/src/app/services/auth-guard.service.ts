import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionService } from "./session.service";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: SessionService, public router: Router) {}
  canActivate(): boolean {
    const res = this.auth.hasToken();
    if (!res)
      this.router.navigate([
        "/session/login",
        { message: "Please login to continue..." }
      ]);
    return res;
  }
}
