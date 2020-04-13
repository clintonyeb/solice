import { Component, OnInit } from "@angular/core";
import { IPost } from "../../utils/interfaces";
import { Post } from "../../utils/post";
import { UsersService } from 'app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'app/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-story",
  templateUrl: "./story.component.html",
  styleUrls: ["./story.component.css"],
})
export class StoryComponent extends Post implements OnInit {
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
            if (data.length < 10) {
              this.canLoadMore = false;
            }
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
}
