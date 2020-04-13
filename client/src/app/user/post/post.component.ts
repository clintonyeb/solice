import { Component, OnInit } from "@angular/core";
import { IPost } from "../../utils/interfaces";
import { Post } from '../../utils/post';
import { UsersService } from 'app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'app/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"],
})
export class PostComponent extends Post implements OnInit {
  constructor(
    public userService: UsersService,
    public toastService: ToastrService,
    public sessionService: SessionService,
    public router: Router
  ) {
    super(userService, toastService, sessionService, router);
  }
  
  getFeed() {
    this.loading = true;
    this.userService
      .getPosts()
      .finally(() => (this.loading = false))
      .subscribe(
        (data) => {
          this.feed = <IPost[]>data;
        },
        (err) => console.log(err)
      );
  }

  getMoreFeed() {
    this.loading = true;
    const _page = this.page + 1;
    if (this.query.value) {
      return this.userService
        .searchFeed(this.query.value, "posts", _page)
        .finally(() => (this.loading = false))
        .subscribe(
          (data: Array<IPost>) => {
            this.feed = this.feed.concat(<IPost[]>data);
            this.page = _page;
            this.toastService.success(
              "Posts",
              "More posts have been loaded..."
            );
            if (data.length < 10) {
              this.canLoadMore = false;
            }
          },
          (err) => console.error(err)
        );
    }
    this.userService
      .getPosts(_page)
      .finally(() => (this.loading = false))
      .subscribe(
        (data) => {
          this.feed = this.feed.concat(<IPost[]>data);
          this.page = _page;
        },
        (err) => console.log(err)
      );
  }

  search() {
    this.loading = true;
    this.userService
      .searchFeed(this.query.value, "posts")
      .finally(() => (this.loading = false))
      .subscribe(
        (data: Array<IPost>) => (this.feed = data),
        (err) => console.error(err)
      );
  }
}
