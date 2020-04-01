import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { SharedModule } from "app/shared/shared.module";
import { BrowserModule } from "@angular/platform-browser";
import { PostsComponent } from "./posts/posts.component";
import { RequestsComponent } from "./requests/requests.component";
import { AdsComponent } from "./ads/ads.component";
import { UsersComponent } from "./users/users.component";
import { TimeagoModule } from "ngx-timeago";

@NgModule({
  declarations: [
    DashboardComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    PostsComponent,
    RequestsComponent,
    AdsComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    RouterModule,
    SharedModule,
    BrowserModule,
    TimeagoModule.forRoot()
  ]
})
export class AdminModule {}
