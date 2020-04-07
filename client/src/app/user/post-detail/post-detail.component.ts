import { Component, OnInit } from "@angular/core";
import { IPost, IComment, IUser } from "../../utils/interfaces";
import { UsersService } from "app/services/users.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionService } from "app/services/session.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.component.html",
  styleUrls: ["./post-detail.component.css"],
})
export class PostDetailComponent implements OnInit {
  post: IPost;
  comments: Array<IComment>;
  user: IUser;
  loading = false;
  focus1: any;

  commentForm = new FormGroup({
    text: new FormControl("", [Validators.required]),
  });

  constructor(
    private userService: UsersService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getPost();
    this.sessionService.currentUserSubject.subscribe(
      (user: IUser) => (this.user = user)
    );
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  getPost() {
    const postId = this.route.snapshot.paramMap.get("id");
    this.userService.getPostById(postId).subscribe((data: IPost) => {
      this.post = data;
      this.getComments(this.post);
    });
  }

  goToFeed() {
    this.router.navigate(["/users"]);
  }

  hasLiked(post: { likes: string | string[] }): boolean {
    const userId = this.user._id;
    return post.likes.indexOf(userId) > -1;
  }

  hasCommented(post: { comments: any[] }): boolean {
    const userId = this.user._id;
    return (
      post.comments.find(
        (comm: { postedBy: string }) => comm.postedBy === userId
      ) !== undefined
    );
  }

  getComments(post: IPost) {
    this.commentForm.reset();
    this.userService.getComments(post._id).subscribe(
      (d: Array<IComment>) => (this.comments = d),
      (err) => {}
    );
  }

  isMyComment(postedBy) {
    const userId = this.user._id;
    return postedBy._id === userId;
  }

  isMyPost(postedBy) {
    const userId = this.user._id;
    return postedBy._id === userId;
  }

  deleteComment(post, comment) {
    return this.userService.deleteComment(post._id, comment._id).subscribe(
      (data: IPost) => {
        this.post = data;
        this.getComments(data);
      },
      (err) => {}
    );
  }

  likePost(post: IPost) {
    this.userService.likePost(post._id).subscribe(
      (d: IPost) => (this.post = d),
      (err) => console.error(err)
    );
  }

  commentPost(post: IPost) {
    this.loading = true;
    this.userService
      .commentPost(post._id, this.commentForm.value.text)
      .subscribe(
        (data: IPost) => {
          this.post = data;
          this.getComments(data);
          this.toastService.success("Comment", "Comment saved!");
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  deletePost(post) {
    this.loading = true;
    this.userService
      .deletePost(post._id)
      .subscribe(
        () => {
          this.goToFeed();
        },
        (err) => {
          this.loading = false;
        }
      );
  }
}
