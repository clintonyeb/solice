import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { LandingComponent } from "./user/landing/landing.component";
import { LoginComponent } from "./session/login/login.component";
import { RegisterComponent } from "./session/register/register.component";
import { ProfileComponent } from "./user/profile/profile.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { SessionComponent } from "./session/session.component";
import { ConfigService } from './services/config.service';
import { AuthGuardService } from './services/auth-guard.service';
import { SessionService } from './services/session.service';
import { UserComponent } from './user/user.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  { path: "", redirectTo: "users", pathMatch: "full" },
  {
    path: "session",
    component: SessionComponent,
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      {
        path: "login",
        component: LoginComponent
      },
      { path: "register", component: RegisterComponent },
      { path: "forgot-password", component: LoginComponent },
      { path: "recover-password", component: LoginComponent }
    ]
  },
  {
    path: "users",
    component: UserComponent,
    canActivate: [AuthGuardService],
    children: [{ path: "profile", component: ProfileComponent }]
  },
  { path: "landing", component: LandingComponent },
  { path: "**", component: LandingComponent }
];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    NgbModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
    BrowserModule,
    SharedModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [],
  providers: [ConfigService, SessionService, AuthGuardService]
})
export class AppRoutingModule {}
