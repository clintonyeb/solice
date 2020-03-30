import { Component, OnInit, Input } from "@angular/core";
import { IPost, IComment, IUser } from "../../utils/interfaces";
import { UsersService } from "../../services/users.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-story",
  templateUrl: "./story.component.html",
  styleUrls: ["./story.component.css"]
})
export class StoryComponent implements OnInit {
  feed: Array<IPost>;
  @Input() type: string;
  query = new FormControl("");
  commentActive: IPost;
  comments: Array<IComment>;
  focus1: any;

  commentForm = new FormGroup({
    text: new FormControl("", [Validators.required])
  });

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getFeed();
  }

  getUser(userId: any) {
    return this.userService.getUserById(userId);
  }

  getFeed() {
    if (this.type === "posts") {
      this.userService.getPosts().subscribe(
        data => {
          this.feed = <IPost[]>data;
        },
        err => console.log(err)
      );
    } else {
      this.userService.getFeed().subscribe(
        data => {
          this.feed = <IPost[]>data;
        },
        err => console.log(err)
      );
    }
  }

  add(post: IPost) {
    this.feed.unshift(post);
  }

  search() {
    this.userService.searchFeed(this.query.value, this.type).subscribe(
      (data: Array<IPost>) => (this.feed = data),
      err => console.error(err)
    );
  }

  likePost(post: IPost, index: number) {
    this.userService.likePost(post._id).subscribe(
      (d: IPost) => this.feed.splice(index, 1, d),
      err => console.error(err)
    );
  }

  commentPost(post: IPost, index: number) {
    this.userService
      .commentPost(post._id, this.commentForm.value.text)
      .subscribe(
        (data: IPost) => {
          this.feed.splice(index, 1, data);
          this.getComments(data);
        },
        err => {}
      );
  }

  hasLiked(post: { likes: string | string[] }): boolean {
    const userId = localStorage.getItem("userId");
    return post.likes.indexOf(userId) > -1;
  }

  hasCommented(post: { comments: any[] }): boolean {
    const userId = localStorage.getItem("userId");
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
    this.commentForm.reset();
    this.userService.getComments(post._id).subscribe(
      (d: Array<IComment>) => (this.comments = d),
      err => {}
    );
    this.commentActive = post;
  }

  isMyComment(postedBy) {
    const userId = localStorage.getItem("userId");
    return postedBy._id === userId;
  }

  deleteComment(post, comment, index) {
    return this.userService.deleteComment(post._id, comment._id).subscribe((data: IPost) => { 
      this.feed.splice(index, 1, data);
      this.getComments(data);
    }, err => { });
  }
}
