import { Component, OnInit, Input } from "@angular/core";
import { IPost } from "../../utils/interfaces";
import { UsersService } from "../../services/users.service";
import { FormControl } from '@angular/forms';

@Component({
  selector: "app-story",
  templateUrl: "./story.component.html",
  styleUrls: ["./story.component.css"]
})
export class StoryComponent implements OnInit {
  feed: Array<IPost>;
  @Input() type: string;
  query = new FormControl("");

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getFeed();
  }

  getUser(userId) {
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
}
