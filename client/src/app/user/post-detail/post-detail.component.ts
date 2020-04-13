import { Component } from "@angular/core";
import { IPost, IUser } from "../../utils/interfaces";
import { UsersService } from "app/services/users.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionService } from "app/services/session.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Post } from '../../utils/post';

@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.component.html",
  styleUrls: ["./post-detail.component.css"],
})
export class PostDetailComponent extends Post {
  post: IPost;
  postDeleted = false;
  routeSubs;

  constructor(
    public userService: UsersService,
    public toastService: ToastrService,
    public route: ActivatedRoute,
    public router: Router,
    public sessionService: SessionService,
    public modalService: NgbModal
  ) {
    super(userService, toastService, sessionService, router);
    this.routeSubs = this.route.params.subscribe((params) => {
      this.getPost(params["id"]);
    });
  }

  ngOnInit(): void {
    this.currentUserSubject = this.sessionService.currentUserSubject.subscribe(
      (user: IUser) => (this.user = user)
    );
  }

  ngOnDestroy() {
    this.currentUserSubject && this.currentUserSubject.unsubscribe();
    this.routeSubs && this.routeSubs.unsubscribe();
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  getPost(postId) {
    this.userService.getPostById(postId).subscribe((data: IPost) => {
      if (!data) {
        return (this.postDeleted = true);
      }
      this.post = data;
      this.getComments(this.post);
    });
  }

  goToFeed() {
    this.router.navigate(["/users"]);
  }

  deletePost(post) {
    this.loading = true;
    this.userService.deletePost(post._id).subscribe(
      () => {
        this.goToFeed();
      },
      () => {
        this.loading = false;
      }
    );
  }
}
