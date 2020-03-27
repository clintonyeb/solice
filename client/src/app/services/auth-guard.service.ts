import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from './session.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: SessionService, public router: Router) { }
  canActivate(): boolean {
    return this.auth.hasToken();
  }
}
