import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IPost, IComment, IUser } from "../../utils/interfaces";
import { UsersService } from "../../services/users.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { SessionService } from "../../services/session.service";

@Component({
  selector: "app-story",
  templateUrl: "./story.component.html",
  styleUrls: ["./story.component.css"],
})
export class StoryComponent implements OnInit {
  feed: Array<IPost>;

  query = new FormControl("");
  commentActive: IPost;
  comments: Array<IComment>;
  focus1: any;
  page = 1;
  user: IUser;
  loading = false;

  commentForm = new FormGroup({
    text: new FormControl("", [Validators.required]),
  });

  constructor(
    private userService: UsersService,
    private toastService: ToastrService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.getFeed();
    this.userService.newPostObserver.subscribe((data: IPost) => this.add(data));
    this.sessionService.currentUserSubject.subscribe(
      (user: IUser) => (this.user = user)
    );
  }

  // getUser(userId: any) {
  //   return this.userService.getUserById(userId);
  // }

  getFeed() {
    this.loading = true;
    this.userService.getFeed().subscribe(
      (data) => {
        this.feed = <IPost[]>data;
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  getMoreFeed() {
    this.loading = true;
    const _page = this.page + 1;
    if (this.query.value) {
      return this.userService
        .searchFeed(this.query.value, "feed", _page)
        .subscribe(
          (data: Array<IPost>) => {
            this.feed = this.feed.concat(<IPost[]>data);
            this.page = _page;
            this.toastService.success(
              "Posts",
              "More posts have been loaded..."
            );
            this.loading = false;
          },
          (err) => {
            console.error(err);
            this.loading = false;
          }
        );
    }
    this.userService.getFeed(_page).subscribe(
      (data) => {
        this.feed = this.feed.concat(<IPost[]>data);
        this.page = _page;
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  add(post: IPost) {
    this.feed.unshift(post);
  }

  search() {
    this.loading = true;
    this.userService.searchFeed(this.query.value, "feed").subscribe(
      (data: Array<IPost>) => {
        this.feed = data;
        this.loading = false;
      },
      (err) => {
        console.error(err);
        this.loading = false;
      }
    );
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
      .subscribe(
        (data: IPost) => {
          this.feed.splice(index, 1, data);
          this.getComments(data);
          this.toastService.success("Comment", "Comment saved!");
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
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
    this.commentActive = null;
    this.commentForm.reset();
    this.userService.getComments(post._id).subscribe(
      (d: Array<IComment>) => (this.comments = d),
      (err) => {}
    );
    this.commentActive = post;
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
    this.getMoreFeed();
  }
}
