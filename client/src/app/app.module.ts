import { SessionModule } from "./session/session.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // this is needed!
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { UserModule } from "./user/user.module";
import { AppComponent } from "./app.component";
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [AppComponent, ToastComponent],
  imports: [
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    ComponentsModule,
    SessionModule,
    UserModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
