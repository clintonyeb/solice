import { UserComponent } from "./user.component";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { LandingComponent } from "../user/landing/landing.component";
import { ProfileComponent } from "../user/profile/profile.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "app/shared/navbar/navbar.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    FormsModule,
    BrowserAnimationsModule,
    NgbModule,
    RouterModule,
    CommonModule,
    SharedModule
  ],
  declarations: [LandingComponent, ProfileComponent, UserComponent]
})
export class UserModule {}
