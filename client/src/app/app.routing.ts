import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

// import { LandingComponent } from "./user/landing/landing.component";
import { LoginComponent } from "./session/login/login.component";
import { RegisterComponent } from "./session/register/register.component";
import { SessionComponent } from "./session/session.component";
import { AuthGuardService } from "./services/auth-guard.service";
import { SessionService } from "./services/session.service";
import { UserComponent } from "./user/user.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "./shared/shared.module";
import { DashboardComponent } from "./user/dashboard/dashboard.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { DashboardComponent as AdminDashboardComponent } from "./admin/dashboard/dashboard.component";
import { PostsComponent } from "./admin/posts/posts.component";
import { UsersComponent } from "./admin/users/users.component";
import { AdsComponent } from "./admin/ads/ads.component";
import { RequestsComponent } from "./admin/requests/requests.component";
import { RequestsComponent as UserRequestsComponent } from "./session/requests/requests.component";
import { FiltersComponent } from "./admin/filters/filters.component";

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
      { path: "request", component: UserRequestsComponent },
      { path: "forgot-password", component: LoginComponent },
      { path: "recover-password", component: LoginComponent }
    ]
  },
  {
    path: "users",
    component: UserComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: "", redirectTo: "feeds", pathMatch: "full" },
      { path: "feeds", component: DashboardComponent }
    ]
  },
  {
    path: "admins",
    component: AdminDashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: "", redirectTo: "posts", pathMatch: "full" },
      { path: "posts", component: PostsComponent },
      { path: "requests", component: RequestsComponent },
      { path: "filters", component: FiltersComponent },
      { path: "ads", component: AdsComponent },
      { path: "users", component: UsersComponent }
    ]
  },
  { path: "**", component: NotFoundComponent }
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
  providers: [SessionService, AuthGuardService]
})
export class AppRoutingModule {}
