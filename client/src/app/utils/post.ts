import { UsersService } from "app/services/users.service";
import { ToastrService } from "ngx-toastr";
import { SessionService } from "app/services/session.service";
import { Router } from "@angular/router";
import { IPost, IUser, IComment } from "app/utils/interfaces";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { OnInit } from "@angular/core";

export class Post implements OnInit {
  feed: Array<IPost>;
  currentUserSubject;
  newPostObserver;
  user: IUser;
  loading = false;
  canLoadMore = true;
  query = new FormControl("");
  commentActive: IPost;
  comments: Array<IComment>;
  focus1: any;
  page = 1;
  commentForm = new FormGroup({
    text: new FormControl("", [Validators.required]),
  });

  constructor(
    public userService: UsersService,
    public toastService: ToastrService,
    public sessionService: SessionService,
    public router: Router
  ) {}

  search() {
    throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
    this.getFeed();
    this.newPostObserver = this.userService.newPostObserver.subscribe(
      (data: IPost) => this.add(data)
    );
    this.currentUserSubject = this.sessionService.currentUserSubject.subscribe(
      (user: IUser) => (this.user = user)
    );
  }
  getFeed() {
    throw new Error("Method not implemented.");
  }

  ngOnDestroy() {
    this.currentUserSubject && this.currentUserSubject.unsubscribe();
    this.newPostObserver && this.newPostObserver.unsubscribe();
  }

  viewPost(postId) {
    this.router.navigate(["/users/main/posts", postId]);
  }

  add(post: IPost) {
    this.feed.unshift(post);
  }

  likePost(post: IPost, index: number) {
    this.userService.likePost(post._id).subscribe(
      (d: IPost) => this.feed.splice(index, 1, d),
      (err) => console.error(err)
    );
  }

  commentPost(post: IPost, index: number) {
    this.loading = true;
    this.userService
      .commentPost(post._id, this.commentForm.value.text)
      .finally(() => (this.loading = false))
      .subscribe(
        (data: IPost) => {
          this.feed.splice(index, 1, data);
          this.getComments(data);
          this.toastService.success("Comment", "Comment saved!");
        },
        (err) => {}
      );
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

  getLikes(post: any): Array<IUser> {
    return [];
  }

  getComments(post: IPost) {
    this.comments = [];
    this.commentForm.reset();
    this.commentActive = post;
    this.loading = true;
    this.userService
      .getComments(post._id)
      .finally(() => (this.loading = false))
      .subscribe(
        (d: Array<IComment>) => (this.comments = d),
        (err) => {}
      );
  }

  isMyComment(postedBy) {
    const userId = this.user._id;
    return postedBy._id === userId;
  }

  deleteComment(post, comment, index) {
    return this.userService.deleteComment(post._id, comment._id).subscribe(
      (data: IPost) => {
        this.feed.splice(index, 1, data);
        this.getComments(data);
      },
      (err) => {}
    );
  }

  onScroll() {
    this.canLoadMore && this.getMoreFeed();
  }

  getMoreFeed() {
    throw new Error("Method not implemented.");
  }

  isMyPost(postedBy) {
    const userId = this.user._id;
    return postedBy._id === userId;
  }
}
