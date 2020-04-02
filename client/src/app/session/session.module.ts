import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SessionComponent } from "./session.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { RequestsComponent } from './requests/requests.component';

@NgModule({
  declarations: [SessionComponent, LoginComponent, RegisterComponent, RequestsComponent],
  imports: [
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    RouterModule,
    CommonModule,
    SharedModule
  ]
})
export class SessionModule {}
