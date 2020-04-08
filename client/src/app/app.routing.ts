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
import { CreateAdsComponent } from "./admin/create-ads/create-ads.component";
import { ForgotPasswordComponent } from "./session/forgot-password/forgot-password.component";
import { RecoverPasswordComponent } from "./session/recover-password/recover-password.component";
import { StoryComponent } from "./user/story/story.component";
import { PostComponent } from "./user/post/post.component";
import { FeedFriendComponent } from "./user/feed-friend/feed-friend.component";
import { ProfileComponent } from "./user/profile/profile.component";
import { UpdateProfileComponent } from "./user/update-profile/update-profile.component";
import { FeedComponent } from "./user/feed/feed.component";
import { PostDetailComponent } from "./user/post-detail/post-detail.component";

const routes: Routes = [
  { path: "", redirectTo: "users", pathMatch: "full" },
  {
    path: "session",
    component: SessionComponent,
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      {
        path: "login",
        component: LoginComponent,
      },
      { path: "register", component: RegisterComponent },
      { path: "request", component: UserRequestsComponent },
      { path: "forgot-password", component: ForgotPasswordComponent },
      { path: "recover-password/:token", component: RecoverPasswordComponent },
    ],
  },
  {
    path: "users",
    component: UserComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: "", redirectTo: "main", pathMatch: "full" },
      {
        path: "main",
        component: DashboardComponent,
        children: [
          { path: "", redirectTo: "feeds", pathMatch: "full" },
          {
            path: "feeds",
            component: FeedComponent,
            children: [
              { path: "", redirectTo: "timeline", pathMatch: "full" },
              { path: "timeline", component: StoryComponent },
              { path: "posts", component: PostComponent },
              { path: "subscriptions", component: FeedFriendComponent },
              { path: "subscribers", component: FeedFriendComponent },
              { path: "people", component: FeedFriendComponent },
            ],
          },
          {
            path: "profiles/:id",
            component: ProfileComponent,
          },
          {
            path: "profile",
            component: UpdateProfileComponent,
          },
          {
            path: "posts/:id",
            component: PostDetailComponent,
          },
        ],
      },
    ],
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
      { path: "users", component: UsersComponent },
      { path: "new-ads", component: CreateAdsComponent },
    ],
  },
  { path: "**", component: NotFoundComponent },
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
    RouterModule.forRoot(routes),
  ],
  providers: [SessionService, AuthGuardService],
})
export class AppRoutingModule {}
