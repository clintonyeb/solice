import { SessionModule } from "./session/session.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // this is needed!
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { UserModule } from "./user/user.module";
import { AppComponent } from "./app.component";
import { AdminModule } from "./admin/admin.module";
import { ToastrModule } from "ngx-toastr";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    SessionModule,
    UserModule,
    AdminModule,
    ToastrModule.forRoot({
      toastClass: "bg-primary ngx-toastr text-white"
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
