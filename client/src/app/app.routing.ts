import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { ComponentsComponent } from "./components/components.component";
import { LandingComponent } from "./layouts/landing/landing.component";
import { LoginComponent } from "./session/login/login.component";
import { RegisterComponent } from "./session/register/register.component";
import { ProfileComponent } from "./layouts/profile/profile.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { SessionComponent } from "./session/session.component";

const routes: Routes = [
  { path: "", redirectTo: "session", pathMatch: "full" },
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
    component: ComponentsComponent,
    children: [{ path: "profile", component: ProfileComponent }]
  },
  { path: "landing", component: LandingComponent },
  { path: "**", component: LandingComponent }
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  declarations: [FooterComponent],
  exports: []
})
export class AppRoutingModule {}
