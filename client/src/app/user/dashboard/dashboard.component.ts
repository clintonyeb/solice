import { Component, OnInit, ViewChild } from "@angular/core";
import { SessionService } from "../../services/session.service";
import { Router } from "@angular/router";
import { UsersService } from "../../services/users.service";
import { BioComponent } from "../bio/bio.component";
import { INotify, INotification, IUser } from "../../utils/interfaces";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  authenticated = false;
  active = false;
  // mainSection = "feed"; // feed, profile, view-profile
  @ViewChild("bio") bio: BioComponent;
  userId: string;
  user: IUser;
  @ViewChild("imageModal") imageModal;
  activeSubscription: any;
  imageSrc: string;

  constructor(
    private sessionService: SessionService,
    private userService: UsersService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.authenticateUser();
    this.userService.imageModalSubject.subscribe((data) => {
      this.openImage(data);
    });
  }

  ngOnDestroy() {
    this.userService.closeConnections();
    this.activeSubscription && this.activeSubscription.unsubscribe();
  }

  authenticateUser() {
    this.sessionService.validateToken((err, res) => {
      if (err) {
        return this.router.navigate([
          "/session/login",
          { message: "Please login to continue" },
        ]);
      }
      this.user = res;
      this.authenticated = true;
      this.activeSubscription = this.userService.activeSubject.subscribe(
        (d: boolean) => {
          this.active = d;
        },
        (err) => {
          console.log(err);
        }
      );
      this.userService.goActive();
    });
  }

  editProfile(value: string) {
    this.bio.refresh();
    this.router.navigate(["/users/main/profile"]);
  }

  viewProfile(value: string) {
    this.router.navigate(["/users/main/profiles", { id: value }]);
  }

  openImage(src: string) {
    this.imageSrc = src;
    if (src) {
      this.modalService
        .open(this.imageModal, {
          ariaLabelledBy: "modal-basic-title",
          centered: true,
          windowClass: "transparent-modal",
        })
        .result.then(
          (result) => {
            console.log("closed");
            // this.userService.setImageModal(null);
          },
          (reason) => {
            console.log("Dismissed");
          }
        );
    }
  }
}
