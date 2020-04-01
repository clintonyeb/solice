import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar/navbar.component";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FooterComponent } from "./footer/footer.component";
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, NotFoundComponent],
  imports: [CommonModule, RouterModule, NgbModule],
  exports: [NavbarComponent, FooterComponent]
})
export class SharedModule {}
